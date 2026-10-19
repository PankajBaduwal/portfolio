import { useState } from 'react';
import { education } from '../data/portfolio.js';
import { Reveal, SectionHead } from './Common.jsx';

const MIN = 2019;
const MAX = 2027;
const years = Array.from({ length: MAX - MIN + 1 }, (_, i) => MIN + i);
const pos = (y) => ((y - MIN) / (MAX - MIN)) * 100;
const chrono = [...education].sort((a, b) => a.start - b.start);

export default function Education() {
  const [sel, setSel] = useState(education[0].id);
  const current = education.find((e) => e.id === sel);

  const onKey = (e) => {
    const i = chrono.findIndex((x) => x.id === sel);
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const n = chrono[(i + 1) % chrono.length];
      setSel(n.id);
      document.getElementById(`edu-tab-${n.id}`)?.focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const n = chrono[(i - 1 + chrono.length) % chrono.length];
      setSel(n.id);
      document.getElementById(`edu-tab-${n.id}`)?.focus();
    }
  };

  return (
    <section className="section education" id="education" aria-labelledby="edu-title">
      <div className="container">
        <SectionHead index="02" label="Education" title="Academic" italic="background" desc="A strong academic foundation in Information Technology and AI/ML." id="edu-title" />

        {/* Spatial rail (landscape tablet & desktop) */}
        <Reveal className="rail" variant="blur" aria-label="Education timeline">
          <div className="rail__plane">
            <div className="rail__track">
              {years.map((y) => (
                <span key={y} className="rail__tick" style={{ left: `${pos(y)}%` }} />
              ))}
              {chrono.map((e, i) => (
                <span
                  key={e.id}
                  className={`rail__span${sel === e.id ? ' is-active' : ''}`}
                  style={{ left: `${pos(e.start)}%`, width: `${pos(e.end) - pos(e.start)}%`, '--lane': i }}
                />
              ))}
            </div>
          </div>
          <div className="rail__years" aria-hidden="true">
            {years.map((y) => (
              <span key={y} style={{ left: `${pos(y)}%` }}>
                {y}
              </span>
            ))}
          </div>
          <div className="rail__nodes" role="tablist" aria-label="Choose an education entry" onKeyDown={onKey}>
            {chrono.map((e) => (
              <button
                key={e.id}
                id={`edu-tab-${e.id}`}
                role="tab"
                type="button"
                aria-selected={sel === e.id}
                aria-controls="edu-panel"
                tabIndex={sel === e.id ? 0 : -1}
                className={`rail__node${sel === e.id ? ' is-active' : ''}`}
                style={{ left: `${pos(e.start)}%`, '--lane': chrono.indexOf(e) }}
                onClick={() => setSel(e.id)}
                onMouseEnter={() => setSel(e.id)}
              >
                <span className="rail__pillar" aria-hidden="true" />
                <span className="rail__node-label">{e.period}</span>
              </button>
            ))}
          </div>
          <div className="rail__panel" id="edu-panel" role="tabpanel" aria-labelledby={`edu-tab-${current.id}`} key={current.id}>
            <p className="rail__panel-period">
              {current.period} · {current.status}
            </p>
            <h3>{current.degree}</h3>
            <p className="rail__panel-school">
              {current.school}, {current.place}
            </p>
            <p className="rail__panel-score">{current.score}</p>
          </div>
        </Reveal>

        {/* Linear timeline (phones & portrait tablets) */}
        <ol className="edu-list">
          {education.map((e) => (
            <li key={e.id} className="edu-list__item">
              <p className="edu-list__period">
                {e.period} · {e.status}
              </p>
              <h3>{e.degree}</h3>
              <p>
                {e.school}, {e.place}
              </p>
              <p className="edu-list__score">{e.score}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
