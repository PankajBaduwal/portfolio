import { useState } from 'react';
import { skillCategories } from '../data/portfolio.js';
import { Reveal, SectionHead } from './Common.jsx';

const norm = (item) => (typeof item === 'string' ? { name: item } : item);

export default function Skills() {
  const [filter, setFilter] = useState('all');
  return (
    <section className="section skills" id="skills" aria-labelledby="skills-title">
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
          <button type="button" className="filter" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>
            All
          </button>
          {skillCategories.map((c) => (
            <button key={c.id} type="button" className="filter" aria-pressed={filter === c.id} onClick={() => setFilter(c.id)}>
              {c.label}
            </button>
          ))}
        </Reveal>

        <Reveal className="keyboard" delay={100}>
          <div className="keyboard__deck">
            {skillCategories.map((c) => {
              const lit = filter === 'all' || filter === c.id;
              return (
                <div key={c.id} className={`keyrow${lit ? ' is-lit' : ' is-dim'}`}>
                  <h3 className="keyrow__label">{c.label}</h3>
                  <ul className="keyrow__keys">
                    {c.items.map(norm).map((s) => (
                      <li key={s.name} className="key">
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
        </Reveal>
        <p className="sr-only" aria-live="polite">
          {filter === 'all' ? 'Showing all skill categories.' : `Highlighting ${skillCategories.find((c) => c.id === filter)?.label}.`}
        </p>
      </div>
    </section>
  );
}
