/* ============================================================
   main.js — renderer, camera choreography and interaction.
   ============================================================ */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PLACES } from './data.js';
import { createWorld, makeSkyTexture } from './town.js';
import * as UI from './ui.js';

const canvas = document.getElementById('scene');
const labelLayer = document.getElementById('labels');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------- renderer ---------------- */
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 800 ? 1.6 : 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

/* ---------------- scene ---------------- */
const scene = new THREE.Scene();
scene.background = makeSkyTexture();
scene.fog = new THREE.Fog(0xe9d9f6, 82, 230);

const narrow = window.innerWidth < 760;
const camera = new THREE.PerspectiveCamera(narrow ? 58 : 42, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.set(0, 34, 54);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.enablePan = false;
controls.minDistance = 14;
controls.maxDistance = narrow ? 120 : 78;
controls.minPolarAngle = 0.25;
controls.maxPolarAngle = Math.PI / 2.12;
controls.autoRotate = !reduceMotion;
controls.autoRotateSpeed = 0.28;
controls.target.set(0, 3.2, 0);

/* ---------------- lights ---------------- */
scene.add(new THREE.AmbientLight(0xffffff, 0.38));

const hemi = new THREE.HemisphereLight(0xcfe0ff, 0xffd9ec, 0.85);
scene.add(hemi);

const sun = new THREE.DirectionalLight(0xfff4e2, 1.95);
sun.position.set(22, 32, 16);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.near = 1;
sun.shadow.camera.far = 110;
sun.shadow.camera.left = -34;
sun.shadow.camera.right = 34;
sun.shadow.camera.top = 34;
sun.shadow.camera.bottom = -34;
sun.shadow.bias = -0.0006;
sun.shadow.normalBias = 0.03;
scene.add(sun);

const rim = new THREE.DirectionalLight(0xd9c6ff, 0.6);
rim.position.set(-24, 14, -20);
scene.add(rim);

/* ---------------- world ---------------- */
const world = createWorld(PLACES);
scene.add(world.group);

/* ---------------- floating labels ---------------- */
const labels = new Map();
for (const g of world.pickables) {
  const el = document.createElement('div');
  el.className = 'label';
  el.innerHTML = `<span class="dot"></span>${g.userData.place.label}`;
  labelLayer.appendChild(el);
  labels.set(g.userData.id, el);
}
const tmp = new THREE.Vector3();

function updateLabels() {
  const hidden = UI.isScrollOpen();
  const candidates = [];

  for (const g of world.pickables) {
    const el = labels.get(g.userData.id);
    if (hidden || !entered) { el.classList.remove('on'); continue; }
    tmp.set(g.position.x, g.position.y + g.userData.labelY, g.position.z).project(camera);
    if (tmp.z > 1 || tmp.x < -0.88 || tmp.x > 0.88) { el.classList.remove('on'); continue; }
    candidates.push({
      el, g,
      x: (tmp.x * 0.5 + 0.5) * window.innerWidth,
      y: (-tmp.y * 0.5 + 0.5) * window.innerHeight,
      depth: tmp.z,
    });
  }

  // nearest labels win; anything that would collide with one already placed hides
  candidates.sort((a, b) => (a.g === hovered ? -1 : b.g === hovered ? 1 : a.depth - b.depth));
  const taken = [];
  for (const c of candidates) {
    const w = (c.el.offsetWidth || 130) / 2 + 5;
    const h = (c.el.offsetHeight || 28) / 2 + 4;
    const r = { l: c.x - w, r: c.x + w, t: c.y - h, b: c.y + h };
    const clash = taken.some((s) => !(r.r < s.l || r.l > s.r || r.b < s.t || r.t > s.b));
    if (clash && c.g !== hovered) { c.el.classList.remove('on'); continue; }
    taken.push(r);
    c.el.style.left = `${c.x}px`;
    c.el.style.top = `${c.y}px`;
    c.el.classList.add('on');
    c.el.classList.toggle('hot', hovered === c.g);
  }
}

/* ---------------- picking ---------------- */
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let hovered = null;
let entered = false;
let pointerDown = null;
let lastInteract = 0;

function setHover(g) {
  if (hovered === g) return;
  if (hovered) hovered.userData.hover = 0;
  hovered = g;
  if (hovered) {
    hovered.userData.hover = 1;
    canvas.style.cursor = 'pointer';
  } else {
    canvas.style.cursor = 'grab';
    UI.hideTip();
  }
}

function pickAt(clientX, clientY) {
  pointer.x = (clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(world.pickables, true);
  if (!hits.length) return null;
  let o = hits[0].object;
  while (o && !o.userData.id) o = o.parent;
  return o ?? null;
}

canvas.addEventListener('pointermove', (e) => {
  if (!entered || UI.isScrollOpen()) return;
  const g = pickAt(e.clientX, e.clientY);
  setHover(g);
  if (g) UI.showTip('Open the scroll', e.clientX, e.clientY);
  else UI.hideTip();
});

canvas.addEventListener('pointerdown', (e) => {
  pointerDown = { x: e.clientX, y: e.clientY, t: performance.now() };
  controls.autoRotate = false;
  lastInteract = clock.elapsedTime;
});

canvas.addEventListener('wheel', () => {
  controls.autoRotate = false;
  lastInteract = clock.elapsedTime;
}, { passive: true });

canvas.addEventListener('pointerup', (e) => {
  if (!entered || !pointerDown) return;
  const moved = Math.hypot(e.clientX - pointerDown.x, e.clientY - pointerDown.y);
  const quick = performance.now() - pointerDown.t < 600;
  pointerDown = null;
  if (moved > 8 || !quick) return;
  const g = pickAt(e.clientX, e.clientY);
  if (g) {
    setHover(g);
    focusPlace(g.userData.id, true);
  }
});

canvas.addEventListener('pointerleave', () => setHover(null));

/* ---------------- camera choreography ---------------- */
const HOME = {
  pos: new THREE.Vector3(0, narrow ? 36 : 28, narrow ? 80 : 46),
  target: new THREE.Vector3(0, narrow ? 1 : 2.2, 0),
};
let flying = null;   // { pos, target, until }

function placeGroup(id) {
  return world.pickables.find((g) => g.userData.id === id);
}

function focusPlace(id, openAfter) {
  const g = placeGroup(id);
  if (!g) return;
  UI.markDock(id);
  controls.autoRotate = false;

  const p = g.position;
  const isCentre = p.lengthSq() < 0.01;
  const dir = isCentre
    ? new THREE.Vector3(0.55, 0, 1).normalize()
    : p.clone().setY(0).normalize();

  const dist = (isCentre ? 17 : 13.5) * (narrow ? 1.45 : 1);
  const camPos = new THREE.Vector3(
    p.x + dir.x * dist,
    (isCentre ? 11 : 8.5),
    p.z + dir.z * dist
  );
  const look = new THREE.Vector3(p.x, g.userData.labelY * 0.45, p.z);

  flying = { pos: camPos, target: look };
  lastInteract = clock.elapsedTime;

  if (openAfter) {
    const place = g.userData.place;
    setTimeout(() => {
      UI.openScroll(place, { onClose: () => { UI.markDock(null); setHover(null); } });
    }, 620);
  }
}

function goHome() {
  flying = { pos: HOME.pos.clone(), target: HOME.target.clone() };
  UI.markDock(null);
}

/* ---------------- dock & topbar ---------------- */
UI.buildDock(PLACES, (id) => {
  if (UI.isScrollOpen()) UI.closeScroll();
  focusPlace(id, true);
});

const tourBtn = document.getElementById('tour-btn');
let tour = { on: false, i: 0, next: 0 };
tourBtn.addEventListener('click', () => {
  tour.on = !tour.on;
  tourBtn.classList.toggle('active', tour.on);
  tourBtn.textContent = tour.on ? 'Stop tour' : 'Auto tour';
  if (tour.on) {
    if (UI.isScrollOpen()) UI.closeScroll();
    tour.i = 0; tour.next = 0;
  } else {
    goHome();
  }
});

/* ---------------- intro ---------------- */
const intro = document.getElementById('intro');
document.getElementById('enter-btn').addEventListener('click', () => {
  intro.classList.add('gone');
  document.getElementById('topbar').classList.remove('ui-hidden');
  document.getElementById('dock').classList.remove('ui-hidden');
  entered = true;
  flying = { pos: HOME.pos.clone(), target: HOME.target.clone() };
  setTimeout(() => {
    if (!flying && !UI.isScrollOpen() && !reduceMotion) controls.autoRotate = true;
    const hash = location.hash.replace('#', '');
    if (hash && PLACES.some((p) => p.id === hash)) focusPlace(hash, true);
  }, 1400);
});

/* ---------------- resize ---------------- */
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 800 ? 1.6 : 2));
});

/* ---------------- loop ---------------- */
const clock = new THREE.Clock();

function tick() {
  requestAnimationFrame(tick);
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;

  // pre-entry: slow cinematic drift
  if (!entered) {
    const a = t * 0.07;
    camera.position.set(Math.sin(a) * 58, 30 + Math.sin(t * 0.3) * 2.5, Math.cos(a) * 58);
    controls.target.set(0, 4, 0);
  }

  // camera flight
  if (flying) {
    const k = 1 - Math.pow(0.0016, dt);
    camera.position.lerp(flying.pos, k);
    controls.target.lerp(flying.target, k);
    if (camera.position.distanceTo(flying.pos) < 0.35) flying = null;
  }

  // auto tour
  if (tour.on && entered && t > tour.next) {
    const place = PLACES[tour.i % PLACES.length];
    focusPlace(place.id, false);
    tour.i++;
    tour.next = t + 6.5;
  }

  // after a quiet moment the town starts turning on its own again
  if (entered && !flying && !tour.on && !UI.isScrollOpen() && !reduceMotion && t - lastInteract > 11) {
    controls.autoRotate = true;
  }

  world.update(dt, t);
  controls.update();
  updateLabels();
  renderer.render(scene, camera);
}
tick();
