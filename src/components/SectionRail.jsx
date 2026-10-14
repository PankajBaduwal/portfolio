import { useEffect, useRef, useState } from 'react';

// Fixed index of the page's chapters, matching the numbers on each section head.
const chapters = [
  { id: 'about', label: 'About' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' },
];

export default function SectionRail() {
  const [active, setActive] = useState(null);
  const [shown, setShown] = useState(false);
  const railRef = useRef(null);

  useEffect(() => {
    const hero = document.getElementById('home');
    const els = chapters.map((c) => document.getElementById(c.id)).filter(Boolean);
    if (!('IntersectionObserver' in window)) return undefined;
    const heroIo = new IntersectionObserver(([e]) => setShown(!e.isIntersecting), { rootMargin: '-40% 0px 0px 0px' });
    if (hero) heroIo.observe(hero);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      railRef.current?.style.setProperty('--sp', max > 0 ? (window.scrollY / max).toFixed(4) : '0');
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      heroIo.disconnect();
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <nav className={`rail-index${shown ? ' is-shown' : ''}`} aria-label="Sections" ref={railRef}>
      <span className="rail-index__track" aria-hidden="true">
        <span className="rail-index__fill" />
      </span>
      <ol>
        {chapters.map((c, i) => (
          <li key={c.id}>
            <a href={`#${c.id}`} aria-current={active === c.id ? 'true' : undefined} tabIndex={shown ? undefined : -1}>
              <span className="rail-index__num">{String(i + 1).padStart(2, '0')}</span>
              <span className="rail-index__label">{c.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
