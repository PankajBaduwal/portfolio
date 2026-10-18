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

// Reading progress along the top edge: one passive scroll listener, one rAF per frame at most.
export function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return () => {};
  let raf = 0;
  const update = () => {
    raf = 0;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.setProperty('--progress', max > 0 ? Math.min(1, window.scrollY / max).toFixed(4) : '0');
  };
  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(update);
  };
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
  };
}

// Gentle parallax for decorative pieces marked data-parallax="speed". Only elements on screen are
// updated, once per frame, through the `translate` property so existing transforms stay intact.
// Skipped on touch screens, narrow layouts and when reduced motion is preferred.
export function initParallax() {
  const ok = window.matchMedia('(hover: hover) and (min-width: 900px) and (prefers-reduced-motion: no-preference)').matches;
  const els = [...document.querySelectorAll('[data-parallax]')];
  if (!ok || !els.length || !('IntersectionObserver' in window)) return () => {};
  const visible = new Set();
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target))),
    { rootMargin: '10% 0px' },
  );
  els.forEach((el) => io.observe(el));
  let raf = 0;
  const update = () => {
    raf = 0;
    const mid = window.innerHeight / 2;
    visible.forEach((el) => {
      const r = el.getBoundingClientRect();
      const offset = (r.top + r.height / 2 - mid) * parseFloat(el.dataset.parallax || 0);
      el.style.translate = `0 ${Math.max(-40, Math.min(40, offset)).toFixed(1)}px`;
    });
  };
  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(update);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
  return () => {
    io.disconnect();
    cancelAnimationFrame(raf);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    els.forEach((el) => (el.style.translate = ''));
  };
}
