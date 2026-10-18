import { about, profile } from '../data/portfolio.js';
import { useScrollProgress } from '../lib/hooks.js';
import { Reveal, SectionHead } from './Common.jsx';

export default function About() {
  const stageRef = useScrollProgress('--p');
  return (
    <section className="section about" id="about" aria-labelledby="about-title">
      <div className="container about__grid">
        <div className="about__stage" ref={stageRef} aria-hidden="false">
          <Reveal className="about__layers-wrap" variant="scale">
          <div className="about__layers">
            <div className="about__plate about__plate--back" aria-hidden="true">
              <span>Holder</span>
              <span>P. Baduwal</span>
            </div>
            <picture className="about__portrait">
              <source srcSet={profile.photo.portrait} type="image/webp" />
              <img src={profile.photo.portraitJpg} alt="Portrait of Pankaj Baduwal in a dark blazer" width="900" height="1170" loading="lazy" decoding="async" />
            </picture>
            <div className="about__tag" aria-hidden="true" data-parallax="0.06">
              <span className="about__tag-k">Spec</span>
              <span>B.Tech IT · 2023 – 2027</span>
              <span>Honors · AI &amp; ML</span>
            </div>
            <div className="about__tag about__tag--b" aria-hidden="true" data-parallax="-0.05">
              <span className="about__tag-k">Loc</span>
              <span>{profile.coords}</span>
            </div>
          </div>
          </Reveal>
        </div>
        <div className="about__copy">
          <SectionHead index="01" label="About" title={about.heading[0]} italic={about.heading[1]} id="about-title" />
          <div className="about__body">
            {about.paragraphs.map((p, i) => (
              <Reveal as="p" key={i} delay={i * 100} variant="right">
                {p}
              </Reveal>
            ))}
          </div>
          <Reveal as="ul" className="spec-list" delay={240} variant="fade" aria-label="Highlights">
            {about.badges.map((b, i) => (
              <li key={b} style={{ '--li': i }}>
                {b}
              </li>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
