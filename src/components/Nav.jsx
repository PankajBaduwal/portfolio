import { useEffect, useState } from 'react';
import { navItems, profile } from '../data/portfolio.js';

export default function Nav({ cardThumb }) {
  const [active, setActive] = useState('home');
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [docked, setDocked] = useState(false);

  // Once the hero card leaves the screen it docks into the logo as a badge.
  useEffect(() => {
    const hero = document.getElementById('home');
    if (!hero || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(([e]) => setDocked(!e.isIntersecting), { threshold: 0, rootMargin: '-35% 0px 0px 0px' });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll('main section[id]'));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="nav__inner container">
        <a className={`nav__logo${docked && cardThumb ? ' is-docked' : ''}`} href="#home" aria-label={`${profile.name} — home`}>
          <span className="nav__flip" aria-hidden="true">
            <span className="nav__mono">PB</span>
            {cardThumb && (
              <span className="nav__badge">
                <img src={cardThumb} alt="" width="22" height="35" draggable="false" />
              </span>
            )}
          </span>
          <span className="nav__name">{profile.name}</span>
        </a>
        <nav aria-label="Primary">
          <ul className="nav__links" id="nav-links">
            {navItems.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} aria-current={active === n.id ? 'true' : undefined} onClick={() => setOpen(false)}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a className="nav__cta" href={profile.resume} download={profile.resumeFileName}>
          Resume
        </a>
        <button
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="nav-links"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
