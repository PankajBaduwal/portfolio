// Pointer-driven details shared across the page: spotlight surfaces and
// magnetic buttons. One set of delegated listeners, desktop pointers only.
const SPOT = '.project__body, .cred, .service, .terminal, .journey__plate';
const MAGNET = '.btn:not(.btn--link), .nav__cta, .chip-btn, .to-top';

export function initPointerFx() {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine) return () => {};
  let magnet = null;

  const onMove = (e) => {
    const t = e.target instanceof Element ? e.target : null;
    if (!t) return;
    const spot = t.closest(SPOT);
    if (spot) {
      const r = spot.getBoundingClientRect();
      spot.style.setProperty('--sx', `${e.clientX - r.left}px`);
      spot.style.setProperty('--sy', `${e.clientY - r.top}px`);
    }
    if (reduced) return;
    const m = t.closest(MAGNET);
    if (magnet && magnet !== m) release();
    if (m && !m.disabled) {
      magnet = m;
      const r = m.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      m.style.setProperty('--mx', `${(dx * 6).toFixed(2)}px`);
      m.style.setProperty('--my', `${(dy * 5).toFixed(2)}px`);
      m.classList.add('is-magnet');
    }
  };
  const release = () => {
    if (!magnet) return;
    magnet.style.setProperty('--mx', '0px');
    magnet.style.setProperty('--my', '0px');
    magnet.classList.remove('is-magnet');
    magnet = null;
  };
  const onLeave = (e) => {
    if (!e.relatedTarget) release();
  };
  document.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerout', onLeave);
  return () => {
    document.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerout', onLeave);
  };
}
