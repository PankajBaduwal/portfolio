import { services } from '../data/portfolio.js';
import { useTilt } from '../lib/hooks.js';
import { Reveal, SectionHead } from './Common.jsx';
import { serviceIcons } from './Icons.jsx';

function Service({ s, i }) {
  const tilt = useTilt(10);
  return (
    <Reveal as="li" className="service" delay={(i % 3) * 110} variant="blur">
      <div className="service__tile" ref={tilt}>
        <svg className="service__glyph" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {serviceIcons[s.id]}
        </svg>
        <svg className="service__glyph service__glyph--shadow" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {serviceIcons[s.id]}
        </svg>
      </div>
      <h3>{s.title}</h3>
      <p>{s.desc}</p>
    </Reveal>
  );
}

export default function Services() {
  return (
    <section className="section services" id="services" aria-labelledby="services-title">
      <div className="container">
        <SectionHead
          index="04"
          label="Services"
          title="Services I"
          italic="offer"
          desc="From frontend design to backend APIs, Gen AI, and ML models — I deliver end-to-end solutions."
          id="services-title"
        />
        <ul className="service-grid">
          {services.map((s, i) => (
            <Service key={s.id} s={s} i={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
