import { useMemo, useState } from 'react';
import { certifications } from '../data/portfolio.js';
import { Dialog, Reveal, SectionHead } from './Common.jsx';
import { ArrowUpRight } from './Icons.jsx';

const providers = ['All', ...Array.from(new Set(certifications.map((c) => c.provider)))];

export default function Certifications() {
  const [provider, setProvider] = useState('All');
  const [viewing, setViewing] = useState(null);
  const list = useMemo(() => certifications.filter((c) => provider === 'All' || c.provider === provider), [provider]);

  return (
    <section className="section certs" id="certifications" aria-labelledby="certs-title">
      <div className="container">
        <SectionHead
          index="06"
          label="Certifications"
          title="Certifications &"
          italic="courses"
          desc="Industry-recognised certifications that validate my technical expertise."
          id="certs-title"
        />
        <Reveal className="filters" role="group" aria-label="Filter certifications by provider">
          {providers.map((p) => (
            <button key={p} type="button" className="filter" aria-pressed={provider === p} onClick={() => setProvider(p)}>
              {p}
              <span className="filter__count">{p === 'All' ? certifications.length : certifications.filter((c) => c.provider === p).length}</span>
            </button>
          ))}
        </Reveal>
        <ul className="cred-grid">
          {list.map((c) => (
            <li key={`${c.provider}-${c.title}`} className={`cred${c.image ? ' cred--image' : ''}`}>
              {c.image ? (
                <button type="button" className="cred__mount" onClick={() => setViewing(c)} aria-label={`View certificate: ${c.title}`} aria-haspopup="dialog">
                  <img src={c.image} alt="" loading="lazy" decoding="async" />
                </button>
              ) : (
                <div className="cred__mount cred__mount--type" aria-hidden="true">
                  <span>{c.provider}</span>
                </div>
              )}
              <div className="cred__text">
                <h3>{c.title}</h3>
                <p>{c.issuer}</p>
                {c.verify && (
                  <a href={c.verify} target="_blank" rel="noopener noreferrer" className="cred__verify">
                    Verify on Credly <ArrowUpRight width={14} height={14} />
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Dialog open={!!viewing} onClose={() => setViewing(null)} labelledBy="cert-dialog-title" className="dialog--cert">
        {viewing && (
          <figure className="cert-view">
            <img src={viewing.image} alt={`Certificate: ${viewing.title}, issued by ${viewing.issuer}`} />
            <figcaption>
              <h3 id="cert-dialog-title">{viewing.title}</h3>
              <p>{viewing.issuer}</p>
              {viewing.verify && (
                <a href={viewing.verify} target="_blank" rel="noopener noreferrer" className="cred__verify">
                  Verify on Credly <ArrowUpRight width={14} height={14} />
                </a>
              )}
            </figcaption>
          </figure>
        )}
      </Dialog>
    </section>
  );
}
