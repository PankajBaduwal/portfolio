import { useState } from 'react';
import { certifications } from '../data/portfolio.js';
import { Dialog, SectionHead } from './Common.jsx';
import { ArrowUpRight } from './Icons.jsx';

// Only the certifications that matter most for the roles I'm applying to.
const list = certifications.filter((c) => c.key);

export default function Certifications() {
  const [viewing, setViewing] = useState(null);

  return (
    <section className="section certs" id="certifications" aria-labelledby="certs-title">
      <div className="container">
        <SectionHead
          index="06"
          label="Certifications"
          title="Key"
          italic="certifications"
          desc="The certifications most relevant to my work in networking, cloud, databases and full-stack development."
          id="certs-title"
        />
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
