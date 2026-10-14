import { useEffect, useRef } from 'react';

// A trailing ring that grows over anything clickable and reads "Drag" over the
// card. Desktop pointers only; the system cursor stays visible underneath.
const CLICKABLE = 'a, button, [role="button"], label, select, summary, input, textarea, .filter';

export default function Cursor() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const ok =
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!el || !ok) return undefined;
    const pos = { x: -100, y: -100 };
    const target = { x: -100, y: -100 };
    let raf = 0;
    let shown = false;
    const tick = () => {
      pos.x += (target.x - pos.x) * 0.22;
      pos.y += (target.y - pos.y) * 0.22;
      el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      raf = Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) > 0.1 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!shown) {
        shown = true;
        pos.x = target.x;
        pos.y = target.y;
        el.classList.add('is-on');
      }
      const t = e.target instanceof Element ? e.target : null;
      const stage = t?.closest('.hero__stage');
      const field = t?.closest('input, textarea, select');
      el.dataset.mode = field ? 'text' : stage ? 'drag' : t?.closest(CLICKABLE) ? 'link' : '';
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onDown = () => el.classList.add('is-down');
    const onUp = () => el.classList.remove('is-down');
    const onOut = (e) => {
      if (!e.relatedTarget) {
        el.classList.remove('is-on');
        shown = false;
      }
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('pointerup', onUp);
    document.addEventListener('pointerout', onOut);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointerout', onOut);
    };
  }, []);
  return (
    <div className="cursor" ref={ref} aria-hidden="true">
      <span className="cursor__ring" />
      <span className="cursor__label">Drag</span>
    </div>
  );
}
