import { useEffect, useState } from 'react';
import { navItems, profile, socials } from '../data/portfolio.js';
import { ArrowUp, socialIcon } from './Icons.jsx';

export default function Footer() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 700);
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <p className="footer__name">
            Pankaj <em>Baduwal</em>
          </p>
          <p>Full Stack MERN Developer &amp; Generative AI Developer building elegant solutions one commit at a time.</p>
        </div>
        <nav aria-label="Footer">
          <h2 className="footer__h">Sections</h2>
          <ul>
            {navItems.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`}>{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="footer__h">Connect</h2>
          <ul>
            {socials.map((s) => {
              const Icon = socialIcon[s.label];
              return (
                <li key={s.label}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    <Icon width={15} height={15} /> {s.label}
                  </a>
                </li>
              );
            })}
            <li>
              <a href={`mailto:${profile.email}`}>Email</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container footer__bottom">
        <p>© {new Date().getFullYear()} {profile.name}</p>
        <p>Designed &amp; built by Pankaj — React, Three.js</p>
      </div>
      <a href="#home" className={`to-top${show ? ' is-visible' : ''}`} aria-label="Back to top">
        <ArrowUp />
      </a>
    </footer>
  );
}
