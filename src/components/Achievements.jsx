import { achievements } from '../data/portfolio.js';
import { Reveal, SectionHead } from './Common.jsx';

const groups = [
  { id: 'tech', label: 'Hackathons & tech' },
  { id: 'sport', label: 'Sports' },
];

export default function Achievements() {
  return (
    <section className="section achievements" id="achievements" aria-labelledby="ach-title">
      <div className="container">
        <SectionHead index="08" label="Recognition" title="Achievements &" italic="activities" desc="Hackathons, competitions, and extracurricular highlights." id="ach-title" />
        {groups.map((g) => (
          <div key={g.id} className="ach-group">
            <h3 className="ach-group__label">{g.label}</h3>
            <ul className={`ach-list ach-list--${g.id}`}>
              {achievements
                .filter((a) => a.kind === g.id)
                .map((a, i) => (
                  <Reveal as="li" key={a.title} className={`ach${a.featured ? ' ach--featured' : ''}`} delay={i * 60}>
                    <span className={`ach__mark${a.mark.length > 4 ? ' ach__mark--long' : ''}`} aria-hidden="true">
                      {a.mark}
                    </span>
                    <div className="ach__text">
                      <p className="ach__result">
                        {a.result}
                        {a.featured && <span className="ach__latest">Latest</span>}
                      </p>
                      <h4>{a.title}</h4>
                      <p className="ach__level">{a.level}</p>
                    </div>
                  </Reveal>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
