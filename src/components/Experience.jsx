import { experience } from '../data/portfolio.js';
import { useScrollProgress } from '../lib/hooks.js';
import { Reveal, SectionHead } from './Common.jsx';

export default function Experience() {
  const ref = useScrollProgress('--p');
  return (
    <section className="section experience" id="experience" aria-labelledby="exp-title">
      <div className="container">
        <SectionHead index="05" label="Experience" title="Professional" italic="experience" desc="My professional journey in technology and software development." id="exp-title" />
        <ol className="journey" ref={ref}>
          <span className="journey__spine" aria-hidden="true">
            <span className="journey__fill" />
          </span>
          {experience.map((x, i) => (
            <Reveal as="li" key={x.org} className="journey__item" delay={i * 60} style={{ '--i': i }}>
              <span className="journey__node" aria-hidden="true" />
              <div className="journey__plate">
                <p className="journey__period">{x.period}</p>
                <h3>{x.role}</h3>
                <p className="journey__org">
                  {x.org} <span>— {x.where}</span>
                </p>
                <p className="journey__desc">{x.desc}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
