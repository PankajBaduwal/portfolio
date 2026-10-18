import { useEffect, useMemo, useRef, useState } from 'react';
import { featuredProjects, githubReposUrl, otherProjects, projectFilters } from '../data/portfolio.js';
import { useInView, useTilt } from '../lib/hooks.js';
import { Dialog, Reveal, SectionHead } from './Common.jsx';
import { ArrowUpRight, Github } from './Icons.jsx';
import ProjectCover from './ProjectCover.jsx';

function ProjectCard({ p, index, order, onOpen }) {
  const tilt = useTilt(7);
  // touch screens have no hover, so covers play while they sit mid-screen
  const [liveRef, centred] = useInView({ rootMargin: '-30% 0px -30% 0px', threshold: 0 }, false);
  const noHover = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;
  return (
    <li className="project" ref={tilt} style={{ '--i': order }}>
      <div className="project__body" ref={liveRef}>
        <ProjectCover motif={p.motif} label={p.title} live={noHover && centred} />
        <div className="project__meta">
          <span className="project__index">{String(index + 1).padStart(2, '0')}</span>
          <span>{p.categoryLabel}</span>
        </div>
        <h3 className="project__title">
          {p.title}
          <span>{p.subtitle}</span>
        </h3>
        <p className="project__summary">{p.summary}</p>
        <ul className="tags" aria-label="Technologies">
          {p.tags.slice(0, 4).map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <div className="project__actions">
          <button type="button" className="btn btn--small btn--primary" onClick={() => onOpen(p.id)} aria-haspopup="dialog">
            View details
          </button>
          <a className="btn btn--small btn--ghost" href={p.github} target="_blank" rel="noopener noreferrer" aria-label={`${p.title} on GitHub (opens in a new tab)`}>
            <Github width={15} height={15} /> GitHub
          </a>
        </div>
      </div>
    </li>
  );
}

// Floating repository card that trails the pointer over the archive list.
function useArchivePreview() {
  const [repo, setRepo] = useState(null);
  const ref = useRef(null);
  const enabled = typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  useEffect(() => {
    if (!enabled) return undefined;
    const pos = { x: 0, y: 0, tx: 0, ty: 0 };
    let raf = 0;
    const tick = () => {
      pos.x += (pos.tx - pos.x) * 0.18;
      pos.y += (pos.ty - pos.y) * 0.18;
      if (ref.current) ref.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${((pos.tx - pos.x) * 0.04).toFixed(2)}deg)`;
      raf = Math.abs(pos.tx - pos.x) + Math.abs(pos.ty - pos.y) > 0.2 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e) => {
      pos.tx = e.clientX + 24;
      pos.ty = e.clientY - 60;
      if (!pos.x) {
        pos.x = pos.tx;
        pos.y = pos.ty;
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);
  return { repo, setRepo: enabled ? setRepo : () => {}, ref };
}

export default function Projects() {
  const preview = useArchivePreview();
  const [lastRepo, setLastRepo] = useState(null);
  useEffect(() => {
    if (preview.repo) setLastRepo(preview.repo);
  }, [preview.repo]);
  const [filter, setFilter] = useState('all');
  const [gridRef, gridIn] = useInView({ rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  const [openId, setOpenId] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const archive = showAll ? otherProjects : otherProjects.slice(0, 10);
  const list = useMemo(() => featuredProjects.filter((p) => filter === 'all' || p.category === filter), [filter]);
  const open = featuredProjects.find((p) => p.id === openId);

  return (
    <section className="section projects" id="projects" aria-labelledby="projects-title">
      <div className="container">
        <SectionHead
          index="05"
          label="Projects"
          title="Featured"
          italic="projects"
          desc="A collection of real-world projects — web apps, full-stack platforms, and AI solutions."
          id="projects-title"
        />
        <Reveal className="filters" role="group" aria-label="Filter projects by category">
          {projectFilters.map((f) => (
            <button key={f.id} type="button" className="filter" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
              {f.label}
            </button>
          ))}
        </Reveal>
        <p className="sr-only" aria-live="polite">
          {list.length} projects shown.
        </p>
        <ul className={`project-grid${gridIn ? ' is-in' : ''}`} ref={gridRef}>
          {list.map((p, i) => (
            <ProjectCard key={`${filter}-${p.id}`} p={p} index={featuredProjects.indexOf(p)} order={i % 3} onOpen={setOpenId} />
          ))}
        </ul>

        <Reveal className="archive" variant="blur" aria-labelledby="archive-title">
          <div className="archive__head">
            <h3 id="archive-title">
              Other projects <span>{otherProjects.length} repositories</span>
            </h3>
            <p>All remaining repositories from my GitHub profile.</p>
          </div>
          <ul className="archive__list" onPointerLeave={() => preview.setRepo(null)}>
            {archive.map((r) => (
              <li key={r.name}>
                <a href={r.url} target="_blank" rel="noopener noreferrer" onPointerEnter={() => preview.setRepo(r)}>
                  <span className="archive__name">{r.name}</span>
                  <span className="archive__desc">{r.desc}</span>
                  <span className="archive__lang">{r.lang}</span>
                  <ArrowUpRight className="archive__arrow" />
                </a>
              </li>
            ))}
          </ul>
          <div className={`repo-peek${preview.repo ? ' is-on' : ''}`} ref={preview.ref} aria-hidden="true">
            {lastRepo && (
              <>
                <p className="repo-peek__path">github.com/PankajBaduwal/</p>
                <p className="repo-peek__name">{lastRepo.name}</p>
                <p className="repo-peek__desc">{lastRepo.desc}</p>
                <p className="repo-peek__lang">
                  <span className={`repo-peek__dot repo-peek__dot--${lastRepo.lang.toLowerCase()}`} />
                  {lastRepo.lang}
                </p>
              </>
            )}
          </div>
          <div className="archive__more">
            {!showAll && (
              <button type="button" className="btn btn--ghost" onClick={() => setShowAll(true)}>
                Show all {otherProjects.length} repositories
              </button>
            )}
            <a className="btn btn--link" href={githubReposUrl} target="_blank" rel="noopener noreferrer">
              View all on GitHub <ArrowUpRight />
            </a>
          </div>
        </Reveal>
      </div>

      <Dialog open={!!open} onClose={() => setOpenId(null)} labelledBy="project-dialog-title" className="dialog--project">
        {open && (
          <article className="pdetail">
            <ProjectCover motif={open.motif} label={open.title} />
            <p className="pdetail__cat">{open.categoryLabel}</p>
            <h3 id="project-dialog-title" className="pdetail__title">
              {open.title} <em>— {open.subtitle}</em>
            </h3>
            <ul className="tags">
              {open.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <h4>Overview</h4>
            <p>{open.desc}</p>
            <h4>Key features</h4>
            <ul className="pdetail__features">
              {open.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <a className="btn btn--primary" href={open.github} target="_blank" rel="noopener noreferrer">
              <Github width={16} height={16} /> View source on GitHub
            </a>
          </article>
        )}
      </Dialog>
    </section>
  );
}
