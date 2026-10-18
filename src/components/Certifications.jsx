import { certifications } from '../data/portfolio.js';
import { Reveal, SectionHead } from './Common.jsx';
import { ArrowUpRight } from './Icons.jsx';

// Only the certifications that matter most for the roles I'm applying to.
const list = certifications.filter((c) => c.key);

export default function Certifications() {
  return (
    <section className="section certs" id="certifications" aria-labelledby="certs-title">
      <div className="container">
        <SectionHead
          index="07"
          label="Certifications"
          title="Key"
          italic="certifications"
          desc="The certifications most relevant to my work in networking, cloud, databases and full-stack development."
          id="certs-title"
        />
        <ul className="cred-grid">
          {list.map((c, i) => (
            <Reveal as="li" key={`${c.provider}-${c.title}`} className="cred" delay={(i % 4) * 90}>
              <div className="cred__top">
                <span className="cred__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="cred__provider">{c.provider}</span>
              </div>
              <div className="cred__text">
                <h3>{c.title}</h3>
                <p>{c.issuer}</p>
                {c.verify && (
                  <a href={c.verify} target="_blank" rel="noopener noreferrer" className="cred__verify">
                    Verify on Credly <ArrowUpRight width={14} height={14} />
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
