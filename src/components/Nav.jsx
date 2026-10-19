import { useEffect, useRef, useState } from 'react';
import { navItems, profile } from '../data/portfolio.js';

export default function Nav({ cardThumb }) {
  const [active, setActive] = useState('home');
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [docked, setDocked] = useState(false);
  const headerRef = useRef(null);
  const toggleRef = useRef(null);

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

  // Open menu: the page behind is locked and inert (focus stays in the header), Escape or a tap
  // outside closes it, and widening past the menu breakpoint closes it too.
  useEffect(() => {
    if (!open) return undefined;
    const root = document.documentElement;
    const behind = [document.getElementById('main'), document.querySelector('.footer')].filter(Boolean);
    root.classList.add('has-menu');
    behind.forEach((el) => (el.inert = true));
    const close = (refocus) => {
      setOpen(false);
      if (refocus) toggleRef.current?.focus();
    };
    const onKey = (e) => e.key === 'Escape' && close(true);
    const onDown = (e) => !headerRef.current?.contains(e.target) && close(false);
    const wide = window.matchMedia('(min-width: 961px)');
    const onWide = () => wide.matches && close(false);
    window.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    wide.addEventListener('change', onWide);
    return () => {
      root.classList.remove('has-menu');
      behind.forEach((el) => (el.inert = false));
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
      wide.removeEventListener('change', onWide);
    };
  }, [open]);

  return (
    <header ref={headerRef} className={`nav${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
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
          <ul className="nav__links" id="nav-links" data-lenis-prevent="">
            {navItems.map((n, i) => (
              <li key={n.id} className={n.menuOnly ? 'nav__menu-only' : undefined} style={{ '--i': i }}>
                <a href={`#${n.id}`} aria-current={active === n.id ? 'true' : undefined} onClick={() => setOpen(false)}>
                  {n.label}
                </a>
              </li>
            ))}
            <li className="nav__menu-only nav__menu-cta" style={{ '--i': navItems.length }}>
              <a className="btn btn--ghost" href={profile.resume} download={profile.resumeFileName} onClick={() => setOpen(false)}>
                Download resume
              </a>
            </li>
          </ul>
        </nav>
        <a className="nav__cta" href={profile.resume} download={profile.resumeFileName}>
          Resume
        </a>
        <button
          type="button"
          className="nav__toggle"
          ref={toggleRef}
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
