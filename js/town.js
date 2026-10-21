/* ============================================================
   town.js — procedurally builds the whole floating pastel town.
   No external 3D models: every house, tree and cloud is geometry,
   so the site stays a few hundred KB and loads instantly.
   ============================================================ */

import * as THREE from 'three';

/* ---------- tiny helpers ---------- */
const DEG = Math.PI / 180;
const rnd = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const C = {
  rock:      0xd9cdf2,
  rockDark:  0xbfb0e4,
  grass:     0xcdeeda,
  grassDark: 0xaedcc0,
  water:     0xa9cdf4,
  wood:      0xd9ab8c,
  woodDark:  0xb98368,
  white:     0xfffdf8,
  cream:     0xfff2d9,
  blossom:   0xffc3dd,
  blossom2:  0xf7a8c9,
  lilac:     0xd8c4f5,
  sky:       0xbdd6fb,
  mint:      0xbfe8d4,
  gold:      0xffe2a8,
  glow:      0xfff0b8,
};

function mat(color, opts = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    flatShading: opts.flat !== false,
    roughness: opts.roughness ?? 0.85,
    metalness: opts.metalness ?? 0.02,
    transparent: opts.transparent ?? false,
    opacity: opts.opacity ?? 1,
    emissive: opts.emissive ?? 0x000000,
    emissiveIntensity: opts.emissiveIntensity ?? 1,
    side: opts.side ?? THREE.FrontSide,
  });
}

function mesh(geo, material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geo, material);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

const box = (w, h, d, color, x, y, z, o) => mesh(new THREE.BoxGeometry(w, h, d), mat(color, o), x, y, z);
const cyl = (rt, rb, h, seg, color, x, y, z, o) =>
  mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat(color, o), x, y, z);
const cone = (r, h, seg, color, x, y, z, o) =>
  mesh(new THREE.ConeGeometry(r, h, seg), mat(color, o), x, y, z);
const ball = (r, detail, color, x, y, z, o) =>
  mesh(new THREE.IcosahedronGeometry(r, detail), mat(color, o), x, y, z);

/* ============================================================
   Sky
   ============================================================ */
export function makeSkyTexture() {
  const c = document.createElement('canvas');
  c.width = 8; c.height = 512;
  const g = c.getContext('2d');
  const grad = g.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0.00, '#b9cdff');
  grad.addColorStop(0.32, '#d2ccfb');
  grad.addColorStop(0.62, '#edd6f8');
  grad.addColorStop(1.00, '#ffdcec');
  g.fillStyle = grad;
  g.fillRect(0, 0, 8, 512);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function sparkleTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.35, 'rgba(255,236,250,0.75)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function waterfallTexture() {
  const c = document.createElement('canvas');
  c.width = 64; c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = '#d3e8ff';
  g.fillRect(0, 0, 64, 256);
  for (let i = 0; i < 70; i++) {
    g.fillStyle = `rgba(255,255,255,${rnd(0.25, 0.85).toFixed(2)})`;
    g.fillRect(rnd(0, 60), rnd(0, 250), rnd(1.5, 5), rnd(12, 60));
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(1, 2);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ============================================================
   Nature props
   ============================================================ */
function blossomTree(scale = 1, tone) {
  const g = new THREE.Group();
  const trunkH = rnd(1.1, 1.7);
  const trunk = cyl(0.13, 0.22, trunkH, 6, C.wood, 0, trunkH / 2, 0);
  g.add(trunk);

  const crownColor = tone ?? pick([C.blossom, C.blossom2, C.lilac, C.mint, 0xffd9ea, 0xd6e6ff]);
  const puffs = 3 + Math.floor(Math.random() * 2);
  for (let i = 0; i < puffs; i++) {
    const r = rnd(0.5, 0.82);
    const p = ball(r, 0, crownColor,
      rnd(-0.45, 0.45), trunkH + rnd(0.25, 0.85), rnd(-0.45, 0.45));
    p.rotation.set(rnd(0, 3), rnd(0, 3), rnd(0, 3));
    g.add(p);
  }
  g.scale.setScalar(scale);
  g.userData.sway = rnd(0, Math.PI * 2);
  return g;
}

function pineTree(scale = 1) {
  const g = new THREE.Group();
  g.add(cyl(0.11, 0.16, 0.7, 6, C.wood, 0, 0.35, 0));
  const tones = [0xbfe3cf, 0xa9d8c0, 0xd2e9dc];
  for (let i = 0; i < 3; i++) {
    g.add(cone(0.78 - i * 0.18, 0.85, 6, tones[i], 0, 0.95 + i * 0.52, 0));
  }
  g.scale.setScalar(scale);
  g.userData.sway = rnd(0, Math.PI * 2);
  return g;
}

function bush(scale = 1) {
  const g = new THREE.Group();
  const tone = pick([0xc6e9d6, 0xd9e8ff, 0xffd8e9]);
  for (let i = 0; i < 3; i++) {
    g.add(ball(rnd(0.22, 0.38), 0, tone, rnd(-0.25, 0.25), rnd(0.15, 0.3), rnd(-0.25, 0.25)));
  }
  g.scale.setScalar(scale);
  return g;
}

function flowerPatch() {
  const g = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const h = rnd(0.18, 0.32);
    const x = rnd(-0.5, 0.5), z = rnd(-0.5, 0.5);
    g.add(cyl(0.02, 0.02, h, 4, 0xaad7bb, x, h / 2, z));
    g.add(ball(0.08, 0, pick([0xffd1e5, 0xfff3c6, 0xd9c8f7, 0xffffff]), x, h + 0.05, z));
  }
  return g;
}

function rock(scale = 1) {
  const r = mesh(new THREE.DodecahedronGeometry(rnd(0.3, 0.6), 0), mat(pick([C.rockDark, 0xd3d9ef, 0xe2dcf5])));
  r.rotation.set(rnd(0, 3), rnd(0, 3), rnd(0, 3));
  r.scale.set(scale, rnd(0.6, 0.95) * scale, scale);
  r.position.y = 0.15 * scale;
  return r;
}

function lamp() {
  const g = new THREE.Group();
  g.add(cyl(0.06, 0.09, 1.9, 6, 0xb9a8d6, 0, 0.95, 0));
  const head = ball(0.26, 0, C.glow, 0, 2.05, 0, { emissive: 0xffe9a8, emissiveIntensity: 1.1, roughness: 0.4 });
  g.add(head);
  const halo = new THREE.PointLight(0xffdfa0, 2.2, 6, 2);
  halo.position.set(0, 2.05, 0);
  g.add(halo);
  g.userData.glowBall = head;
  g.userData.phase = rnd(0, 6.28);
  return g;
}

function cloud(scale = 1, tint = 0xfffdfb) {
  const g = new THREE.Group();
  const n = 4 + Math.floor(Math.random() * 3);
  for (let i = 0; i < n; i++) {
    const r = rnd(1.0, 2.0);
    const p = ball(r, 1, tint, rnd(-2.2, 2.2), rnd(-0.35, 0.45), rnd(-1.0, 1.0),
      { flat: false, roughness: 1, transparent: true, opacity: 0.95,
        emissive: 0xfff4fb, emissiveIntensity: 0.35 });
    p.castShadow = false; p.receiveShadow = false;
    p.rotation.set(rnd(0, 3), rnd(0, 3), rnd(0, 3));
    g.add(p);
  }
  g.scale.setScalar(scale);
  return g;
}

/* ============================================================
   Building blueprints — one per `kind` in data.js
   Each returns { group, height } with its base sitting on y = 0.
   ============================================================ */
function windows(g, { w, h, d, rows = 1, cols = 2, y0 = 0.9, color = 0xfff6d8 }) {
  const m = mat(color, { emissive: 0xffe9b5, emissiveIntensity: 0.45, roughness: 0.4 });
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = (c - (cols - 1) / 2) * (w / (cols + 0.4));
      const y = y0 + r * (h * 0.5);
      const win = mesh(new THREE.BoxGeometry(w * 0.16, h * 0.2, 0.08), m, x, y, d / 2 + 0.01);
      g.add(win);
    }
  }
}

const BLUEPRINTS = {
  /* --- the wishing tree in the middle of town --- */
  wishtree([a, b]) {
    const g = new THREE.Group();
    const trunk = cyl(0.6, 1.25, 3.4, 8, C.wood, 0, 1.7, 0);
    g.add(trunk);
    for (let i = 0; i < 4; i++) {
      const br = cyl(0.12, 0.22, 1.6, 5, C.woodDark, 0, 3.4, 0);
      br.rotation.z = (i % 2 ? 1 : -1) * rnd(0.5, 0.8);
      br.rotation.y = i * 1.57;
      br.position.set(Math.cos(i * 1.57) * 0.7, 3.1, Math.sin(i * 1.57) * 0.7);
      g.add(br);
    }
    const crown = new THREE.Group();
    crown.add(ball(2.5, 1, a, 0, 5.0, 0));
    for (let i = 0; i < 12; i++) {
      const ang = (i / 12) * Math.PI * 2;
      const r = rnd(1.5, 2.3);
      crown.add(ball(r, 0, i % 2 ? a : b,
        Math.cos(ang) * rnd(1.4, 3.0), 4.4 + rnd(-0.5, 1.6), Math.sin(ang) * rnd(1.4, 3.0)));
    }
    g.add(crown);

    // hanging lanterns of wishes
    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2 + 0.4;
      const x = Math.cos(ang) * 2.1, z = Math.sin(ang) * 2.1;
      const y = rnd(3.2, 4.1);
      g.add(cyl(0.012, 0.012, 0.5, 4, 0xe8dcc8, x, y + 0.3, z));
      const l = ball(0.17, 0, C.glow, x, y, z,
        { emissive: 0xffd98a, emissiveIntensity: 1.2, roughness: 0.4 });
      g.add(l);
    }

    // signpost with the name
    const sign = new THREE.Group();
    sign.add(cyl(0.07, 0.07, 1.5, 6, C.woodDark, 0, 0.75, 0));
    const plank = box(2.2, 0.62, 0.12, C.cream, 0, 1.4, 0);
    plank.rotation.z = -0.05;
    sign.add(plank);
    sign.position.set(2.6, 0, 1.9);
    sign.rotation.y = -0.5;
    g.add(sign);

    // roots / mound
    g.add(cyl(2.6, 3.2, 0.5, 10, C.grassDark, 0, 0.2, 0));
    return { group: g, height: 7.6 };
  },

  /* --- Education: academy with a clock tower --- */
  academy([a, b]) {
    const g = new THREE.Group();
    g.add(box(5, 2.8, 3.6, a, 0, 1.4, 0));
    windows(g, { w: 5, h: 2.8, d: 3.6, cols: 3, y0: 1.5 });
    const roof = cone(3.9, 1.5, 4, b, 0, 3.55, 0);
    roof.rotation.y = Math.PI / 4;
    g.add(roof);

    // tower
    g.add(box(1.6, 5.2, 1.6, C.white, -2.0, 2.6, 0.9));
    const t = cone(1.5, 1.8, 4, b, -2.0, 6.1, 0.9);
    t.rotation.y = Math.PI / 4;
    g.add(t);
    const clock = cyl(0.42, 0.42, 0.12, 12, C.cream, -2.0, 4.4, 1.75,
      { emissive: 0xffeec4, emissiveIntensity: 0.4 });
    clock.rotation.x = Math.PI / 2;
    g.add(clock);
    g.add(box(0.03, 0.3, 0.03, 0x6d5f8f, -2.0, 4.52, 1.82));
    g.add(ball(0.16, 0, C.gold, -2.0, 7.2, 0.9, { emissive: 0xffd98a, emissiveIntensity: 0.9 }));

    // door + steps
    g.add(box(0.9, 1.5, 0.12, C.woodDark, 0.6, 0.75, 1.82));
    g.add(box(1.8, 0.18, 0.7, C.cream, 0.6, 0.09, 2.2));

    // flag
    g.add(cyl(0.04, 0.04, 1.2, 4, C.white, 2.1, 3.9, 0));
    const flag = box(0.8, 0.45, 0.04, C.blossom, 2.5, 4.3, 0);
    g.add(flag);
    return { group: g, height: 7.8 };
  },

  /* --- Publications: observatory --- */
  observatory([a, b]) {
    const g = new THREE.Group();
    g.add(cyl(1.9, 2.4, 4.6, 10, a, 0, 2.3, 0));
    g.add(cyl(2.55, 2.55, 0.3, 10, b, 0, 4.7, 0));
    const dome = mesh(new THREE.SphereGeometry(2.1, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), mat(b), 0, 4.8, 0);
    g.add(dome);
    // telescope poking out
    const tele = cyl(0.26, 0.34, 2.3, 8, C.white, 0, 5.9, 0.7);
    tele.rotation.x = -0.75;
    g.add(tele);
    g.add(ball(0.3, 0, C.sky, 0.0, 6.75, 1.65, { roughness: 0.2, metalness: 0.3 }));
    // star ring
    const ring = mesh(new THREE.TorusGeometry(2.9, 0.06, 6, 36), mat(C.gold, { emissive: 0xffe6ab, emissiveIntensity: 0.8 }), 0, 5.2, 0);
    ring.rotation.x = Math.PI / 2.4;
    g.add(ring);
    g.userData.spin = ring;
    windows(g, { w: 3.4, h: 3, d: 4.1, cols: 2, y0: 1.6 });
    g.add(box(0.9, 1.5, 0.12, C.woodDark, 0, 0.75, 2.3));
    // book stack outside
    for (let i = 0; i < 3; i++) {
      g.add(box(0.9, 0.18, 0.65, pick([C.blossom, C.mint, C.cream]), 2.6, 0.1 + i * 0.19, 1.4, { flat: true }));
    }
    return { group: g, height: 7.6 };
  },

  /* --- Research lab: greenhouse --- */
  greenhouse([a, b]) {
    const g = new THREE.Group();
    g.add(box(5.2, 1.4, 3.4, b, 0, 0.7, 0));
    const glass = mesh(
      new THREE.CylinderGeometry(1.9, 1.9, 5.2, 14, 1, false, 0, Math.PI),
      mat(0xdff1ff, { transparent: true, opacity: 0.45, roughness: 0.1, metalness: 0.2, flat: false, side: THREE.DoubleSide }),
      0, 1.4, 0
    );
    glass.rotation.z = Math.PI / 2;
    glass.rotation.y = Math.PI / 2;
    g.add(glass);
    // frame ribs
    for (let i = -2; i <= 2; i++) {
      const rib = mesh(new THREE.TorusGeometry(1.9, 0.05, 5, 16, Math.PI), mat(C.white), 0, 1.4, i * 0.85);
      g.add(rib);
    }
    // plants & flasks inside
    for (let i = 0; i < 4; i++) {
      const p = bush(0.75);
      p.position.set(rnd(-2, 2), 1.4, rnd(-1, 1));
      g.add(p);
    }
    const flask = cyl(0.12, 0.35, 0.6, 8, 0xd6f5e6,
      1.9, 1.7, 1.2, { transparent: true, opacity: 0.8, roughness: 0.15 });
    g.add(flask);
    g.add(box(1.0, 1.3, 0.12, C.white, 0, 0.65, 1.75));
    // raised beds
    g.add(box(1.6, 0.4, 0.9, C.wood, 3.4, 0.2, 0.6));
    g.add(ball(0.3, 0, C.mint, 3.4, 0.5, 0.6));
    return { group: g, height: 4.2 };
  },

  /* --- Industry: workshop with chimney + gear --- */
  workshop([a, b]) {
    const g = new THREE.Group();
    g.add(box(4.4, 2.6, 3.4, a, 0, 1.3, 0));
    windows(g, { w: 4.4, h: 2.6, d: 3.4, cols: 3, y0: 1.4 });
    const roof = box(4.9, 0.35, 3.9, b, 0, 2.95, 0);
    roof.rotation.z = 0.12;
    g.add(roof);
    // saw-tooth factory roof
    for (let i = -1; i <= 1; i++) {
      const s = box(1.3, 0.9, 3.5, C.white, i * 1.5, 3.4, 0);
      s.rotation.z = 0.35;
      g.add(s);
    }
    // chimney + smoke
    g.add(cyl(0.42, 0.5, 2.6, 8, b, -1.9, 3.6, -0.9));
    const smoke = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const s = ball(0.3 + i * 0.1, 0, 0xfff5fb,
        -1.9 + i * 0.25, 5.1 + i * 0.7, -0.9, { transparent: true, opacity: 0.55 - i * 0.1 });
      s.castShadow = false;
      smoke.add(s);
    }
    g.add(smoke);
    g.userData.smoke = smoke;
    // gear
    const gear = new THREE.Group();
    const hub = mesh(new THREE.TorusGeometry(0.8, 0.22, 6, 10), mat(C.gold), 0, 0, 0);
    gear.add(hub);
    for (let i = 0; i < 8; i++) {
      const a2 = (i / 8) * Math.PI * 2;
      gear.add(box(0.3, 0.3, 0.22, C.gold, Math.cos(a2) * 0.95, Math.sin(a2) * 0.95, 0));
    }
    gear.position.set(2.7, 1.6, 0.4);
    g.add(gear);
    g.userData.gear = gear;
    g.add(box(1.0, 1.5, 0.12, C.woodDark, 0.8, 0.75, 1.73));
    return { group: g, height: 6.4 };
  },

  /* --- Projects: atelier / library --- */
  library([a, b]) {
    const g = new THREE.Group();
    g.add(box(4.6, 3.0, 3.4, a, 0, 1.5, 0));
    windows(g, { w: 4.6, h: 3.0, d: 3.4, cols: 3, y0: 1.6 });
    const roof = cone(3.6, 1.7, 4, b, 0, 3.85, 0);
    roof.rotation.y = Math.PI / 4;
    g.add(roof);
    g.add(ball(0.22, 0, C.gold, 0, 4.85, 0, { emissive: 0xffd98a, emissiveIntensity: 0.8 }));
    // arched doorway
    const arch = mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.14, 12, 1, false, 0, Math.PI), mat(C.woodDark), 0, 1.5, 1.74);
    arch.rotation.z = Math.PI / 2;
    arch.rotation.y = Math.PI / 2;
    g.add(arch);
    g.add(box(1.1, 1.5, 0.14, C.woodDark, 0, 0.75, 1.74));
    // awning
    const awn = box(3.0, 0.12, 1.0, C.blossom, 0, 2.5, 2.1);
    awn.rotation.x = -0.25;
    g.add(awn);
    // blueprint rolls leaning on the wall
    for (let i = 0; i < 3; i++) {
      const r = cyl(0.12, 0.12, 1.3, 8, C.cream, 2.1 + i * 0.3, 0.65, 1.5);
      r.rotation.z = 0.2;
      g.add(r);
    }
    return { group: g, height: 5.4 };
  },

  /* --- Skills: windmill --- */
  windmill([a, b]) {
    const g = new THREE.Group();
    g.add(cyl(1.25, 1.9, 5.0, 10, a, 0, 2.5, 0));
    const cap = cone(1.6, 1.3, 10, b, 0, 5.6, 0);
    g.add(cap);
    windows(g, { w: 2.4, h: 3, d: 2.9, cols: 1, y0: 2.0 });
    g.add(box(0.9, 1.4, 0.12, C.woodDark, 0, 0.7, 1.72));
    // blades
    const blades = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const arm = new THREE.Group();
      arm.add(box(0.18, 2.9, 0.1, C.white, 0, 1.5, 0));
      const sail = box(0.72, 2.2, 0.06, pick([C.blossom, C.cream, C.mint, 0xd9e6ff]), 0.42, 1.6, 0.06);
      arm.add(sail);
      arm.rotation.z = i * (Math.PI / 2);
      blades.add(arm);
    }
    blades.position.set(0, 5.3, 1.5);
    g.add(blades);
    g.add(cyl(0.2, 0.2, 0.7, 8, C.woodDark, 0, 5.3, 1.25).rotateX(Math.PI / 2));
    g.userData.blades = blades;
    return { group: g, height: 7.6 };
  },

  /* --- Awards: pavilion with a floating trophy crystal --- */
  pavilion([a, b]) {
    const g = new THREE.Group();
    g.add(cyl(3.0, 3.3, 0.6, 8, C.white, 0, 0.3, 0));
    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2;
      g.add(cyl(0.17, 0.2, 2.8, 8, C.white, Math.cos(ang) * 2.3, 2.0, Math.sin(ang) * 2.3));
    }
    const r1 = cone(2.95, 1.7, 8, b, 0, 4.2, 0);
    const r2 = cone(1.95, 1.4, 8, b, 0, 5.35, 0);
    g.add(r1, r2);
    g.add(ball(0.25, 0, C.gold, 0, 6.2, 0, { emissive: 0xffd98a, emissiveIntensity: 1 }));
    // trophy crystal
    const crystal = mesh(new THREE.OctahedronGeometry(0.75, 0),
      mat(0xfff0c2, { emissive: 0xffd98a, emissiveIntensity: 0.75, roughness: 0.25, metalness: 0.3 }), 0, 2.0, 0);
    g.add(crystal);
    g.userData.crystal = crystal;
    const pedestal = cyl(0.55, 0.75, 0.9, 8, C.cream, 0, 0.75, 0);
    g.add(pedestal);
    // medals hanging between pillars
    for (let i = 0; i < 3; i++) {
      const ang = (i / 3) * Math.PI * 2 + 0.5;
      g.add(ball(0.2, 0, C.gold, Math.cos(ang) * 2.3, 2.9, Math.sin(ang) * 2.3, { emissive: 0xffd98a, emissiveIntensity: 0.6 }));
    }
    return { group: g, height: 6.2 };
  },

  /* --- Community: festival tent --- */
  hall([a, b]) {
    const g = new THREE.Group();
    g.add(cyl(3.1, 3.3, 0.35, 12, C.grassDark, 0, 0.17, 0));
    const tent = cone(3.0, 3.4, 12, a, 0, 2.05, 0);
    g.add(tent);
    // stripes
    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2;
      const panel = box(0.55, 3.3, 0.06, b, Math.cos(ang) * 1.45, 1.9, Math.sin(ang) * 1.45);
      panel.rotation.y = -ang;
      panel.position.y = 1.75;
      g.add(panel);
    }
    g.add(cyl(0.09, 0.09, 1.3, 6, C.white, 0, 4.2, 0));
    const flag = box(0.9, 0.5, 0.05, C.blossom, 0.5, 4.6, 0);
    g.add(flag);
    g.userData.flag = flag;
    // entrance
    g.add(box(1.3, 1.6, 0.1, C.cream, 0, 0.8, 2.55));
    // bunting
    for (let i = 0; i < 10; i++) {
      const ang = (i / 10) * Math.PI * 2;
      const t = mesh(new THREE.ConeGeometry(0.16, 0.34, 3),
        mat(pick([C.blossom, C.cream, C.mint, C.lilac])),
        Math.cos(ang) * 3.5, 1.6 + Math.sin(i * 1.3) * 0.15, Math.sin(ang) * 3.5);
      t.rotation.x = Math.PI;
      g.add(t);
    }
    return { group: g, height: 5.4 };
  },
};

/* ============================================================
   One plot of land per place: building + garden + hover ring
   ============================================================ */
function buildPlace(place) {
  const g = new THREE.Group();
  const bp = BLUEPRINTS[place.kind] ?? BLUEPRINTS.library;
  const palette = (place.palette ?? ['#d9cdf2', '#bfb0e4']).map((c) => new THREE.Color(c).getHex());
  const { group: building, height } = bp(palette);
  g.add(building);

  const isCentre = place.radius === 0;

  // soft plot of grass
  const plotR = isCentre ? 5.4 : 4.6;
  const plot = mesh(new THREE.CylinderGeometry(plotR, plotR + 0.25, 0.3, 20), mat(C.grassDark), 0, -0.1, 0);
  plot.castShadow = false;
  g.add(plot);

  // hover ring
  const ring = mesh(new THREE.TorusGeometry(plotR + 0.45, 0.1, 6, 40),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 }), 0, 0.22, 0);
  ring.rotation.x = Math.PI / 2;
  ring.castShadow = ring.receiveShadow = false;
  g.add(ring);

  // garden props around the building
  const props = [];
  const n = isCentre ? 7 : 5;
  for (let i = 0; i < n; i++) {
    const ang = (i / n) * Math.PI * 2 + rnd(-0.3, 0.3);
    const r = rnd(plotR * 0.62, plotR * 0.92);
    const x = Math.cos(ang) * r, z = Math.sin(ang) * r;
    let p;
    const roll = Math.random();
    if (roll < 0.42) p = blossomTree(rnd(0.75, 1.05));
    else if (roll < 0.62) p = pineTree(rnd(0.7, 1.0));
    else if (roll < 0.8) p = bush(rnd(0.8, 1.2));
    else if (roll < 0.92) p = flowerPatch();
    else p = rock(rnd(0.7, 1.1));
    p.position.set(x, 0.1, z);
    p.rotation.y = rnd(0, 6.28);
    g.add(p);
    if (p.userData.sway !== undefined) props.push(p);
  }

  // a lamp by the entrance
  const lp = lamp();
  lp.position.set(plotR * 0.55, 0.1, plotR * 0.72);
  g.add(lp);

  g.userData = {
    id: place.id,
    place,
    building,
    ring,
    labelY: height * 0.78 + 0.9,
    hover: 0,
    swayProps: props,
    lamp: lp,
  };
  return g;
}

/* ============================================================
   The island itself
   ============================================================ */
function buildIsland() {
  const g = new THREE.Group();
  const R = 23;

  const profile = [
    new THREE.Vector2(0.02, -17.0),
    new THREE.Vector2(3.2, -13.0),
    new THREE.Vector2(7.5, -9.0),
    new THREE.Vector2(12.0, -5.6),
    new THREE.Vector2(16.5, -3.2),
    new THREE.Vector2(20.0, -1.5),
    new THREE.Vector2(R - 0.6, -0.5),
    new THREE.Vector2(R, 0),
  ];
  const rockMesh = mesh(new THREE.LatheGeometry(profile, 20), mat(C.rock));
  rockMesh.receiveShadow = true;
  g.add(rockMesh);

  // grass cap
  const cap = mesh(new THREE.CircleGeometry(R + 0.05, 20), mat(C.grass, { roughness: 0.95 }), 0, 0.01, 0);
  cap.rotation.x = -Math.PI / 2;
  cap.receiveShadow = true;
  cap.castShadow = false;
  g.add(cap);

  // gentle hills so the ground is not flat
  for (let i = 0; i < 9; i++) {
    const ang = rnd(0, Math.PI * 2);
    const r = rnd(7, 20);
    const h = mesh(new THREE.SphereGeometry(rnd(2.2, 4.2), 10, 6), mat(i % 2 ? C.grass : 0xd7f1e4),
      Math.cos(ang) * r, rnd(-1.6, -0.9), Math.sin(ang) * r);
    h.scale.y = rnd(0.35, 0.6);
    h.receiveShadow = true;
    g.add(h);
  }

  // ring path
  const path = mesh(new THREE.RingGeometry(10.6, 12.4, 48), mat(0xf6ead6, { roughness: 1 }), 0, 0.06, 0);
  path.rotation.x = -Math.PI / 2;
  path.receiveShadow = true;
  path.castShadow = false;
  g.add(path);

  // stepping stones along the path
  for (let i = 0; i < 26; i++) {
    const ang = (i / 26) * Math.PI * 2;
    const r = 11.5 + Math.sin(i * 2.1) * 0.5;
    const s = mesh(new THREE.CylinderGeometry(rnd(0.3, 0.45), rnd(0.3, 0.45), 0.1, 6), mat(0xe9dcc4),
      Math.cos(ang) * r, 0.1, Math.sin(ang) * r);
    s.castShadow = false;
    g.add(s);
  }

  return { group: g, radius: R };
}

function buildRiver(R) {
  const g = new THREE.Group();
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2.0, 0.08, -8.0),
    new THREE.Vector3(-5.0, 0.08, -3.0),
    new THREE.Vector3(-6.4, 0.08, 2.5),
    new THREE.Vector3(-9.5, 0.08, 7.5),
    new THREE.Vector3(-13.0, 0.08, 12.0),
    new THREE.Vector3(-15.5, 0.06, 16.8),
  ]);
  const tube = mesh(new THREE.TubeGeometry(curve, 60, 1.25, 8, false),
    mat(C.water, { transparent: true, opacity: 0.92, roughness: 0.12, metalness: 0.15, flat: true }));
  tube.scale.y = 0.14;
  tube.position.y = 0.06;
  tube.castShadow = false;
  g.add(tube);

  // pebbles along the bank
  for (let i = 0; i < 18; i++) {
    const t = i / 18;
    const p = curve.getPoint(t);
    const side = i % 2 ? 1.6 : -1.6;
    const st = rock(rnd(0.4, 0.75));
    st.position.set(p.x + side + rnd(-0.3, 0.3), 0.05, p.z + rnd(-0.6, 0.6));
    g.add(st);
  }

  // little bridge where the ring path crosses the stream
  const bridge = new THREE.Group();
  const deck = box(3.6, 0.22, 1.9, C.wood, 0, 0.55, 0);
  bridge.add(deck);
  for (let i = -1; i <= 1; i += 2) {
    for (let j = -1; j <= 1; j += 2) {
      bridge.add(cyl(0.07, 0.07, 0.7, 5, C.woodDark, i * 1.5, 0.9, j * 0.8));
    }
    bridge.add(box(3.4, 0.1, 0.1, C.woodDark, 0, 1.2, i * 0.8));
  }
  const bp = curve.getPoint(0.52);
  bridge.position.set(bp.x, 0, bp.z);
  bridge.rotation.y = 0.9;
  g.add(bridge);

  // waterfall off the rim
  const end = curve.getPoint(1);
  const wfTex = waterfallTexture();
  const falls = mesh(new THREE.PlaneGeometry(2.8, 13, 1, 6),
    new THREE.MeshStandardMaterial({
      map: wfTex, color: 0xffffff, transparent: true, opacity: 0.8,
      roughness: 0.2, side: THREE.DoubleSide, emissive: 0xbcd8f7, emissiveIntensity: 0.25,
    }),
    end.x * 1.03, -6.2, end.z * 1.03);
  falls.lookAt(end.x * 4, -6.2, end.z * 4);
  falls.castShadow = false;
  g.add(falls);

  // mist at the lip
  const mist = new THREE.Group();
  for (let i = 0; i < 7; i++) {
    const m = ball(rnd(0.6, 1.3), 0, 0xffffff,
      end.x * 1.05 + rnd(-1.2, 1.2), rnd(-1.6, -0.2), end.z * 1.05 + rnd(-1.2, 1.2),
      { transparent: true, opacity: 0.4, roughness: 1 });
    m.castShadow = false;
    mist.add(m);
  }
  g.add(mist);

  return { group: g, waterTex: wfTex, mist, curve };
}

/* ============================================================
   Public: assemble the world
   ============================================================ */
export function createWorld(places) {
  const world = new THREE.Group();
  const updaters = [];
  const pickables = [];
  const anchors = [];

  const { group: island, radius: R } = buildIsland();
  world.add(island);

  const river = buildRiver(R);
  world.add(river.group);

  // ---- places ----
  for (const place of places) {
    const g = buildPlace(place);
    if (place.radius === 0) {
      g.position.set(0, 0, 0);
    } else {
      const a = (place.angle ?? 0) * DEG;
      g.position.set(Math.cos(a) * place.radius, 0, Math.sin(a) * place.radius);
      g.rotation.y = -a + Math.PI / 2 + rnd(-0.12, 0.12);
      // spur path from the ring road to the door
      const spur = mesh(new THREE.PlaneGeometry(1.5, place.radius - 11.6), mat(0xf6ead6, { roughness: 1 }));
      spur.rotation.x = -Math.PI / 2;
      spur.rotation.z = -a;
      const mid = (place.radius + 11.6) / 2;
      spur.position.set(Math.cos(a) * mid, 0.05, Math.sin(a) * mid);
      spur.castShadow = false; spur.receiveShadow = true;
      island.add(spur);
    }
    world.add(g);
    pickables.push(g);
    anchors.push(g);
  }

  // ---- scattered wilderness between the plots ----
  const forest = [];
  for (let i = 0; i < 46; i++) {
    const ang = rnd(0, Math.PI * 2);
    const r = rnd(4, R - 1.2);
    const x = Math.cos(ang) * r, z = Math.sin(ang) * r;
    // keep clear of plots and the ring road
    if (Math.abs(r - 11.5) < 1.6) continue;
    let tooClose = false;
    for (const p of pickables) {
      if (p.position.distanceTo(new THREE.Vector3(x, 0, z)) < 5.6) { tooClose = true; break; }
    }
    if (tooClose) continue;
    const roll = Math.random();
    const prop = roll < 0.5 ? blossomTree(rnd(0.8, 1.35))
      : roll < 0.75 ? pineTree(rnd(0.8, 1.3))
        : roll < 0.9 ? bush(rnd(0.9, 1.4)) : rock(rnd(0.8, 1.4));
    prop.position.set(x, 0.05, z);
    prop.rotation.y = rnd(0, 6.28);
    world.add(prop);
    if (prop.userData.sway !== undefined) forest.push(prop);
  }

  // flowers hugging the rim
  for (let i = 0; i < 22; i++) {
    const ang = (i / 22) * Math.PI * 2 + rnd(-0.1, 0.1);
    const f = flowerPatch();
    f.position.set(Math.cos(ang) * rnd(R - 2.4, R - 0.9), 0.05, Math.sin(ang) * rnd(R - 2.4, R - 0.9));
    world.add(f);
  }

  // lamps along the ring road
  for (let i = 0; i < 8; i++) {
    const ang = (i / 8) * Math.PI * 2 + 0.4;
    const lp = lamp();
    lp.position.set(Math.cos(ang) * 10.0, 0.05, Math.sin(ang) * 10.0);
    world.add(lp);
    updaters.push((t) => {
      const b = lp.userData.glowBall;
      b.material.emissiveIntensity = 0.85 + Math.sin(t * 1.6 + lp.userData.phase) * 0.3;
    });
  }

  // ---- floating islets in the sky ----
  const islets = [];
  for (let i = 0; i < 7; i++) {
    const g = new THREE.Group();
    const r = rnd(1.6, 3.4);
    const prof = [
      new THREE.Vector2(0.02, -r * 2.1),
      new THREE.Vector2(r * 0.45, -r * 1.2),
      new THREE.Vector2(r * 0.85, -r * 0.5),
      new THREE.Vector2(r, 0),
    ];
    g.add(mesh(new THREE.LatheGeometry(prof, 9), mat(C.rock)));
    const cap = mesh(new THREE.CircleGeometry(r + 0.03, 9), mat(C.grass), 0, 0.02, 0);
    cap.rotation.x = -Math.PI / 2;
    g.add(cap);
    const t = Math.random() < 0.6 ? blossomTree(rnd(0.7, 1.1)) : pineTree(rnd(0.7, 1.0));
    t.position.y = 0.05;
    g.add(t);
    const ang = rnd(0, Math.PI * 2);
    const dist = rnd(44, 70);
    g.position.set(Math.cos(ang) * dist, rnd(7, 20), Math.sin(ang) * dist);
    g.userData.phase = rnd(0, 6.28);
    g.userData.baseY = g.position.y;
    world.add(g);
    islets.push(g);
  }

  // ---- clouds ----
  const clouds = [];
  for (let i = 0; i < 18; i++) {
    const c = cloud(rnd(0.8, 1.7), pick([0xfffdfb, 0xfff2f8, 0xf3f1ff]));
    const ang = rnd(0, Math.PI * 2);
    // far and high, or near but below the rim — never at eye level
    const high = Math.random() < 0.5;
    const dist = high ? rnd(58, 90) : rnd(26, 44);
    const y = high ? rnd(6, 24) : rnd(-21, -13);
    c.position.set(Math.cos(ang) * dist, y, Math.sin(ang) * dist);
    c.userData.speed = rnd(0.012, 0.035) * (Math.random() < 0.5 ? -1 : 1);
    c.userData.ang = ang;
    c.userData.dist = dist;
    c.userData.phase = rnd(0, 6.28);
    c.userData.baseY = c.position.y;
    world.add(c);
    clouds.push(c);
  }
  // a soft cloud bed under the island
  for (let i = 0; i < 9; i++) {
    const c = cloud(rnd(1.8, 3.0), 0xfff7fb);
    const ang = rnd(0, Math.PI * 2);
    c.position.set(Math.cos(ang) * rnd(4, 18), rnd(-34, -26), Math.sin(ang) * rnd(4, 18));
    c.userData.speed = rnd(0.004, 0.012);
    c.userData.ang = ang;
    c.userData.dist = Math.hypot(c.position.x, c.position.z);
    c.userData.phase = rnd(0, 6.28);
    c.userData.baseY = c.position.y;
    world.add(c);
    clouds.push(c);
  }

  // ---- magic sparkles ----
  const COUNT = 420;
  const pos = new Float32Array(COUNT * 3);
  const spd = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    const ang = rnd(0, Math.PI * 2), r = rnd(2, R + 6);
    pos[i * 3] = Math.cos(ang) * r;
    pos[i * 3 + 1] = rnd(-6, 18);
    pos[i * 3 + 2] = Math.sin(ang) * r;
    spd[i] = rnd(0.25, 0.9);
  }
  const sparkGeo = new THREE.BufferGeometry();
  sparkGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const sparkles = new THREE.Points(sparkGeo, new THREE.PointsMaterial({
    size: 0.32, map: sparkleTexture(), transparent: true, opacity: 0.85,
    depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true,
  }));
  world.add(sparkles);

  /* ---------- per-frame updates ---------- */
  function update(dt, t) {
    // trees sway
    for (const p of forest) p.rotation.z = Math.sin(t * 1.1 + p.userData.sway) * 0.035;
    for (const g of pickables) {
      for (const p of g.userData.swayProps) p.rotation.z = Math.sin(t * 1.2 + p.userData.sway) * 0.04;

      const b = g.userData.building;
      if (b.userData.blades) b.userData.blades.rotation.z += dt * 0.7;
      if (b.userData.gear) b.userData.gear.rotation.z -= dt * 1.1;
      if (b.userData.spin) b.userData.spin.rotation.z += dt * 0.25;
      if (b.userData.crystal) {
        b.userData.crystal.rotation.y += dt * 0.8;
        b.userData.crystal.position.y = 2.0 + Math.sin(t * 1.6) * 0.18;
      }
      if (b.userData.flag) b.userData.flag.rotation.y = Math.sin(t * 2.2) * 0.22;
      if (b.userData.smoke) {
        b.userData.smoke.children.forEach((s, i) => {
          s.position.y += dt * (0.25 + i * 0.05);
          s.material.opacity -= dt * 0.1;
          if (s.material.opacity <= 0.02) {
            s.position.y = 5.1;
            s.material.opacity = 0.5;
          }
        });
      }
      // hover lift
      const target = g.userData.hover;
      g.userData.lift = THREE.MathUtils.lerp(g.userData.lift ?? 0, target, dt * 7);
      g.position.y = g.userData.lift * 0.45 + Math.sin(t * 0.9 + g.position.x) * 0.03;
      const s = 1 + g.userData.lift * 0.05;
      g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, s, dt * 8));
      g.userData.ring.material.opacity = THREE.MathUtils.lerp(g.userData.ring.material.opacity, target * 0.75, dt * 8);
      g.userData.ring.rotation.z += dt * 0.5 * target;
    }

    // clouds drift
    for (const c of clouds) {
      c.userData.ang += c.userData.speed * dt;
      c.position.x = Math.cos(c.userData.ang) * c.userData.dist;
      c.position.z = Math.sin(c.userData.ang) * c.userData.dist;
      c.position.y = c.userData.baseY + Math.sin(t * 0.4 + c.userData.phase) * 0.5;
    }

    // islets bob
    for (const g of islets) {
      g.position.y = g.userData.baseY + Math.sin(t * 0.6 + g.userData.phase) * 0.6;
      g.rotation.y += dt * 0.05;
    }

    // waterfall + mist
    river.waterTex.offset.y -= dt * 0.55;
    river.mist.children.forEach((m, i) => {
      m.position.y = -0.9 + Math.sin(t * 0.9 + i) * 0.5;
      m.material.opacity = 0.28 + Math.sin(t * 1.2 + i) * 0.12;
    });

    // sparkles rise
    const arr = sparkGeo.attributes.position.array;
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3 + 1] += spd[i] * dt;
      if (arr[i * 3 + 1] > 20) arr[i * 3 + 1] = -8;
    }
    sparkGeo.attributes.position.needsUpdate = true;

    for (const fn of updaters) fn(t, dt);
  }

  return { group: world, pickables, anchors, update, radius: R };
}
