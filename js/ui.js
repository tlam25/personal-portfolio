/* ============================================================
   ui.js — the treasure scroll that unrolls, plus the bottom dock.
   ============================================================ */

const overlay = document.getElementById('scroll-overlay');
const paper = document.getElementById('paper');
const inner = document.getElementById('paper-inner');
const titleEl = document.getElementById('scroll-title');
const subEl = document.getElementById('scroll-sub');
const emojiEl = document.getElementById('scroll-emoji');
const bodyEl = document.getElementById('scroll-body');
const closeBtn = document.getElementById('scroll-close');
const bottomRod = document.querySelector('.rod-bottom');
const tooltip = document.getElementById('tooltip');

let current = null;
let onCloseCb = null;

/* ---------- content rendering ---------- */
function renderBlock(b) {
  switch (b.type) {
    case 'quote':
      return `<p class="quote">${b.text}</p>`;

    case 'entry': {
      const when = b.when ? `<span class="when">${b.when}</span>` : '';
      const role = b.role ? `<p class="role">${b.role}</p>` : '';
      const items = (b.body ?? []).map((li) => `<li>${li}</li>`).join('');
      return `<section class="entry">
        <div class="entry-top"><h3>${b.title}</h3>${when}</div>
        ${role}
        ${items ? `<ul>${items}</ul>` : ''}
      </section>`;
    }

    case 'tags':
      return `<div class="tagwrap">${b.items.map((t) => `<span class="tag">${t}</span>`).join('')}</div>`;

    case 'skills':
      return `<div class="skill-group">
        <h4>${b.group}</h4>
        <div class="tagwrap">${b.items.map((t) => `<span class="tag ${b.tone ?? ''}">${t}</span>`).join('')}</div>
      </div>`;

    default:
      return '';
  }
}

/* ---------- open / close ---------- */
export function openScroll(place, { onClose } = {}) {
  onCloseCb = onClose ?? null;
  current = place.id;

  emojiEl.textContent = place.emoji ?? '✦';
  titleEl.textContent = place.title;
  subEl.textContent = place.subtitle ?? '';
  bodyEl.innerHTML = (place.body ?? []).map(renderBlock).join('');
  inner.scrollTop = 0;

  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  paper.style.height = '0px';
  bottomRod.style.transform = 'translateY(0)';

  // let the browser lay the content out, then unroll to its natural height
  requestAnimationFrame(() => {
    const h = Math.min(inner.offsetHeight, window.innerHeight * 0.74);
    requestAnimationFrame(() => {
      paper.style.height = `${h}px`;
      paper.classList.toggle('has-more', inner.scrollHeight > h + 8);
      overlay.classList.add('revealed');
    });
  });

  if (history.replaceState) history.replaceState(null, '', `#${place.id}`);
  document.body.classList.add('scroll-open');
  closeBtn.focus({ preventScroll: true });
}

export function closeScroll() {
  if (!current) return;
  current = null;
  overlay.classList.remove('revealed');
  paper.style.height = '0px';
  document.body.classList.remove('scroll-open');
  if (history.replaceState) history.replaceState(null, '', ' ');
  const done = () => {
    if (!current) {
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
    }
    paper.removeEventListener('transitionend', done);
  };
  paper.addEventListener('transitionend', done);
  setTimeout(done, 1000);
  if (onCloseCb) onCloseCb();
}

export function isScrollOpen() { return current !== null; }
export function currentScroll() { return current; }

// the fade at the foot of the scroll disappears once you reach the end
inner.addEventListener('scroll', () => {
  const atEnd = inner.scrollTop + inner.clientHeight >= inner.scrollHeight - 12;
  paper.classList.toggle('has-more', !atEnd && inner.scrollHeight > inner.clientHeight + 8);
});

closeBtn.addEventListener('click', closeScroll);
overlay.querySelector('.scroll-backdrop').addEventListener('click', closeScroll);
window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeScroll(); });

/* ---------- dock ---------- */
export function buildDock(places, onPick) {
  const dock = document.getElementById('dock');
  dock.innerHTML = '';
  for (const p of places) {
    const b = document.createElement('button');
    b.className = 'dock-btn';
    b.type = 'button';
    b.dataset.id = p.id;
    b.title = p.title;
    b.innerHTML = `<span class="ico">${p.icon ?? '•'}</span><span>${p.label}</span>`;
    b.addEventListener('click', () => onPick(p.id));
    dock.appendChild(b);
  }
}

export function markDock(id) {
  document.querySelectorAll('.dock-btn').forEach((b) => {
    b.classList.toggle('active', b.dataset.id === id);
  });
}

/* ---------- hover tooltip ---------- */
export function showTip(text, x, y) {
  tooltip.textContent = text;
  tooltip.style.left = `${x}px`;
  tooltip.style.top = `${y}px`;
  tooltip.classList.add('on');
}
export function hideTip() { tooltip.classList.remove('on'); }
