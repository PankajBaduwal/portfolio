import { useEffect, useRef, useState } from 'react';
import { skillCategories } from '../data/portfolio.js';
import { useInView } from '../lib/hooks.js';
import { Reveal, SectionHead } from './Common.jsx';

const norm = (item) => (typeof item === 'string' ? { name: item } : item);

export default function Skills() {
  const [filter, setFilter] = useState('all');
  // bumping `wave` remounts the lit rows so the press ripple replays
  const [wave, setWave] = useState(0);
  const deckRef = useRef(null);
  const [sectionRef, inView] = useInView({ threshold: 0.25 }, false);

  const choose = (id) => {
    setFilter(id);
    setWave((w) => w + 1);
  };

  // Typing a letter while the keyboard is on screen presses the matching keys.
  useEffect(() => {
    if (!inView) return undefined;
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      const t = e.target;
      if (t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      const ch = e.key.length === 1 ? e.key.toLowerCase() : '';
      if (!/^[a-z0-9]$/.test(ch) || !deckRef.current) return;
      deckRef.current.querySelectorAll('.keyrow.is-lit .key').forEach((k) => {
        if (k.dataset.name.toLowerCase().startsWith(ch)) {
          k.classList.remove('is-pressed');
          void k.offsetWidth;
          k.classList.add('is-pressed');
        }
      });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [inView]);

  let k = 0;
  return (
    <section className="section skills" id="skills" aria-labelledby="skills-title" ref={sectionRef}>
      <div className="container">
        <SectionHead
          index="03"
          label="Skills"
          title="Skills &"
          italic="technologies"
          desc="Technologies I work with to build modern, scalable products — laid out as the keyboard they are typed on."
          id="skills-title"
        />
        <Reveal className="filters" role="group" aria-label="Filter skills by category">
          <button type="button" className="filter" aria-pressed={filter === 'all'} onClick={() => choose('all')}>
            All
          </button>
          {skillCategories.map((c) => (
            <button key={c.id} type="button" className="filter" aria-pressed={filter === c.id} onClick={() => choose(c.id)}>
              {c.label}
            </button>
          ))}
        </Reveal>

        <Reveal className="keyboard" delay={100} variant="scale">
          <div className={`keyboard__deck${wave ? ' is-wave' : ''}`} ref={deckRef}>
            {skillCategories.map((c) => {
              const lit = filter === 'all' || filter === c.id;
              return (
                <div key={c.id} className={`keyrow${lit ? ' is-lit' : ' is-dim'}`}>
                  <h3 className="keyrow__label">{c.label}</h3>
                  <ul className="keyrow__keys" key={lit ? `w${wave}` : 'dim'}>
                    {c.items.map(norm).map((s) => (
                      <li key={s.name} className="key" data-name={s.name} style={lit ? { '--k': k++ } : undefined} onAnimationEnd={(e) => e.currentTarget.classList.remove('is-pressed')}>
                        <span className="key__cap">
                          <span className="key__legend">{s.name}</span>
                          {s.note && <span className="key__note">{s.note}</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <p className="keyboard__hint" aria-hidden="true">
            Type a letter to press its keys
          </p>
        </Reveal>
        <p className="sr-only" aria-live="polite">
          {filter === 'all' ? 'Showing all skill categories.' : `Highlighting ${skillCategories.find((c) => c.id === filter)?.label}.`}
        </p>
      </div>
    </section>
  );
}
