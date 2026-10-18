import { Component, Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { achievements, profile } from '../data/portfolio.js';
import { PHOTO, TEX, drawBack, drawFront, drawPhoto, loadCardFonts, loadImage } from '../lib/cardFace.js';
import { hasWebGL, usePrefersReducedMotion } from '../lib/hooks.js';
import { ArrowDown, Download, Mail } from './Icons.jsx';

const latestWin = achievements.find((a) => a.featured);

const IdCardCanvas = lazy(() => import('../three/IdCardCanvas.jsx'));

class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err) {
    console.warn('3D card unavailable, showing static card.', err);
    this.props.onFail?.();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const TILT_X = 0.22;
const TILT_Y = 0.34;
// resting pose: turned slightly so the card's edge and thickness read at a glance
const REST = { rx: 0.05, ry: -0.2 };

export default function Hero({ introActive, onSkipIntro, onCardFace }) {
  const reducedMotion = usePrefersReducedMotion();
  const [faces, setFaces] = useState(null);
  const [urls, setUrls] = useState(null);
  const [use3d, setUse3d] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [active, setActive] = useState(true);
  const [flipped, setFlipped] = useState(false);
  // repeat visits skip the curtain but still get a quick staggered entrance
  const [enter] = useState(() => !introActive && typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const cssCardRef = useRef(null);
  const introRef = useRef({ t: 0, done: false });
  const control = useRef({
    base: { ...REST },
    tilt: { rx: 0, ry: 0 },
    pointer: { x: 0, y: 0 },
    hovering: false,
    dragging: false,
    grab: null,
    scroll: 0,
  });

  // Draw card faces once fonts and the photo are available.
  useEffect(() => {
    let cancelled = false;
    const made = [];
    (async () => {
      const [photo] = await Promise.all([loadImage(profile.photo.card).catch(() => loadImage(profile.photo.cardJpg)), loadCardFonts()]);
      if (cancelled) return;
      const front = drawFront(document.createElement('canvas'), photo, { includePhoto: false });
      const frontFull = drawFront(document.createElement('canvas'), photo, { includePhoto: true });
      const back = drawBack(document.createElement('canvas'));
      const pc = document.createElement('canvas');
      pc.width = PHOTO.w;
      pc.height = PHOTO.h;
      drawPhoto(pc.getContext('2d'), photo, 0, 0, PHOTO.w, PHOTO.h);
      const toUrl = (c) =>
        new Promise((res) => c.toBlob((b) => res(b ? URL.createObjectURL(b) : c.toDataURL()), 'image/jpeg', 0.9));
      const [fu, bu] = await Promise.all([toUrl(frontFull), toUrl(back)]);
      made.push(fu, bu);
      if (cancelled) return;
      setFaces({ front, back, photo: pc });
      setUrls({ front: fu, back: bu });
      onCardFace?.(fu);
    })();
    return () => {
      cancelled = true;
      made.forEach((u) => u.startsWith('blob:') && URL.revokeObjectURL(u));
    };
  }, []);

  useEffect(() => {
    const save = navigator.connection?.saveData;
    setUse3d(hasWebGL() && !save);
  }, []);

  // Only render the scene while the hero is on screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0.02 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion) introRef.current = { t: 1, done: true };
  }, [reducedMotion]);

  // As the hero scrolls away the card recedes towards the nav, where it docks.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reducedMotion) return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      const hp = Math.min(1, Math.max(0, window.scrollY / (el.offsetHeight * 0.85)));
      el.style.setProperty('--hp', hp.toFixed(3));
      // the WebGL card reads the same progress and turns away in 3D as the hero leaves
      control.current.scroll = hp;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (!introActive) introRef.current.t = 1;
  }, [introActive]);

  // CSS fallback card follows the same control state.
  const syncCss = useCallback(() => {
    const el = cssCardRef.current;
    if (!el) return;
    const c = control.current;
    el.style.setProperty('--rx', `${((c.base.rx + c.tilt.rx) * 57.3).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${((c.base.ry + c.tilt.ry) * 57.3).toFixed(2)}deg`);
    el.style.setProperty('--gx', `${((c.pointer.x + 1) * 50).toFixed(1)}%`);
    el.style.setProperty('--gy', `${((1 - c.pointer.y) * 50).toFixed(1)}%`);
    el.dataset.dragging = c.dragging ? 'true' : 'false';
  }, []);

  // Pointer: hover tilt over the hero, drag to turn on the card stage.
  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return undefined;
    const c = control.current;
    let drag = null;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const readPointer = (e) => {
      const r = stage.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = -(((e.clientY - r.top) / r.height) * 2 - 1);
      c.pointer.x = Math.max(-1.5, Math.min(1.5, nx));
      c.pointer.y = Math.max(-1.5, Math.min(1.5, ny));
      return { nx, ny };
    };
    const onMove = (e) => {
      const { nx, ny } = readPointer(e);
      if (drag) {
        const dx = e.clientX - drag.x;
        const dy = e.clientY - drag.y;
        c.base.ry = drag.ry + dx * 0.009;
        c.base.rx = Math.max(-0.5, Math.min(0.5, drag.rx + dy * 0.006));
        c.tilt.rx = 0;
        c.tilt.ry = 0;
      } else if (e.pointerType !== 'touch' && finePointer && !reducedMotion) {
        c.hovering = true;
        c.tilt.ry = Math.max(-1, Math.min(1, nx)) * TILT_Y;
        c.tilt.rx = -Math.max(-1, Math.min(1, ny)) * TILT_X;
      }
      syncCss();
    };
    const onLeave = () => {
      c.hovering = false;
      c.tilt.rx = 0;
      c.tilt.ry = 0;
      syncCss();
    };
    const onDown = (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      drag = { x: e.clientX, y: e.clientY, ry: c.base.ry + c.tilt.ry, rx: c.base.rx + c.tilt.rx, moved: false };
      readPointer(e);
      // where the card was grabbed, so the lanyard clip follows the pointer from there
      c.grab = { x: c.pointer.x, y: c.pointer.y };
      c.dragging = true;
      stage.setPointerCapture?.(e.pointerId);
      onSkipIntro?.();
      syncCss();
    };
    const onUp = () => {
      if (!drag) return;
      drag = null;
      c.dragging = false;
      c.grab = null;
      // settle on the nearest face so the card always rests readable
      const k = Math.round((c.base.ry - REST.ry) / Math.PI);
      c.base.ry = k * Math.PI + REST.ry;
      c.base.rx = REST.rx;
      setFlipped(Math.abs(k) % 2 === 1);
      syncCss();
    };
    section.addEventListener('pointermove', onMove);
    section.addEventListener('pointerleave', onLeave);
    stage.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    stage.addEventListener('pointercancel', onUp);
    return () => {
      section.removeEventListener('pointermove', onMove);
      section.removeEventListener('pointerleave', onLeave);
      stage.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      stage.removeEventListener('pointercancel', onUp);
    };
  }, [onSkipIntro, reducedMotion, syncCss]);

  useEffect(() => {
    syncCss();
  }, [urls, syncCss]);

  const flip = useCallback(() => {
    const c = control.current;
    c.base.ry += Math.PI;
    setFlipped((f) => !f);
    syncCss();
  }, [syncCss]);

  const reset = useCallback(() => {
    const c = control.current;
    c.base = { ...REST };
    c.tilt = { rx: 0, ry: 0 };
    setFlipped(false);
    syncCss();
  }, [syncCss]);

  const onKeyDown = (e) => {
    const c = control.current;
    const step = 0.12;
    let handled = true;
    switch (e.key) {
      case 'ArrowLeft':
        c.tilt.ry = Math.max(-TILT_Y * 1.6, c.tilt.ry - step);
        break;
      case 'ArrowRight':
        c.tilt.ry = Math.min(TILT_Y * 1.6, c.tilt.ry + step);
        break;
      case 'ArrowUp':
        c.tilt.rx = Math.max(-TILT_X * 1.6, c.tilt.rx - step);
        break;
      case 'ArrowDown':
        c.tilt.rx = Math.min(TILT_X * 1.6, c.tilt.rx + step);
        break;
      case 'Enter':
      case ' ':
        flip();
        break;
      case 'Escape':
      case 'r':
      case 'R':
        reset();
        break;
      default:
        handled = false;
    }
    if (handled) {
      e.preventDefault();
      syncCss();
    }
  };

  const showCanvas = use3d && faces;
  const narrow = typeof window !== 'undefined' && window.matchMedia('(max-width: 760px)').matches;
  const cssVisible = !sceneReady;

  return (
    <section className={`hero${introActive ? ' is-intro' : ''}${enter ? ' is-enter' : ''}`} id="home" ref={sectionRef} aria-labelledby="hero-title">
      <div className="hero__grid container">
        <div className="hero__lead">
          <p className="eyebrow hero__in" style={{ '--d': '0.55s' }}>
            <span className="eyebrow__dot" aria-hidden="true" />
            {profile.availability}
          </p>
          <h1 id="hero-title" className="hero__name hero__in" style={{ '--d': '0.6s' }}>
            {profile.name}
            <span className="hero__role">{profile.title}</span>
          </h1>
          <p className="display hero__headline hero__in" style={{ '--d': '0.7s' }}>
            Building intelligent products<span className="hero__headline-dot">.</span>
          </p>
        </div>

        <div className="hero__stage-wrap">
          <div
            ref={stageRef}
            className={`hero__stage${sceneReady ? ' is-3d' : ''}`}
            tabIndex={0}
            role="group"
            aria-roledescription="interactive 3D identity card"
            aria-label={`Identity card of ${profile.name}, ${profile.title}. ${flipped ? 'Showing back.' : 'Showing front.'} Drag or use arrow keys to tilt, Enter to flip, Escape to reset.`}
            onKeyDown={onKeyDown}
            onFocus={() => {
              control.current.hovering = true;
            }}
            onBlur={() => {
              control.current.hovering = false;
            }}
          >
            {!faces && <div className="card-skeleton" aria-hidden="true" />}
            {urls && (
              <div className={`card-css${cssVisible ? '' : ' is-hidden'}${introActive && !reducedMotion ? ' is-entering' : ''}`} ref={cssCardRef} aria-hidden="true">
                <div className="card-css__body">
                  <img className="card-css__face card-css__front" src={urls.front} alt="" width={TEX.w} height={TEX.h} draggable="false" />
                  <img className="card-css__face card-css__back" src={urls.back} alt="" width={TEX.w} height={TEX.h} draggable="false" />
                  <span className="card-css__glint" />
                </div>
                <span className="card-css__shadow" />
              </div>
            )}
            {showCanvas && (
              <SceneBoundary onFail={() => setUse3d(false)}>
                <Suspense fallback={null}>
                  <div className={`card-gl${sceneReady ? ' is-ready' : ''}`} aria-hidden="true">
                    <IdCardCanvas
                      faces={faces}
                      control={control}
                      introRef={introRef}
                      reducedMotion={reducedMotion}
                      active={active}
                      lowPower={narrow}
                      bleedTop={narrow ? 0.16 : 0.45}
                      onReady={() => requestAnimationFrame(() => setSceneReady(true))}
                    />
                  </div>
                </Suspense>
              </SceneBoundary>
            )}
          </div>
          <div className="hero__card-controls hero__in" style={{ '--d': '1.1s' }}>
            <span className="hint">
              <span className="hint--pointer">Drag to turn the card</span>
              <span className="hint--touch">Swipe sideways to turn</span>
            </span>
            <button type="button" className="chip-btn" onClick={flip} aria-pressed={flipped}>
              {flipped ? 'Show front' : 'Flip card'}
            </button>
            <button type="button" className="chip-btn" onClick={reset}>
              Reset
            </button>
          </div>
        </div>

        <div className="hero__aside">
          <dl className="meta-list hero__in" style={{ '--d': '0.9s' }}>
            <div>
              <dt>Based in</dt>
              <dd>
                {profile.locationShort}
                <span className="meta-list__sub">{profile.coords}</span>
              </dd>
            </div>
            <div>
              <dt>Studying</dt>
              <dd>
                B.Tech IT, {profile.institutionShort}
                <span className="meta-list__sub">2023 – 2027 · Honors in AI &amp; ML</span>
              </dd>
            </div>
            {latestWin && (
              <div>
                <dt>Latest win</dt>
                <dd>
                  <a className="meta-list__link" href="#achievements">
                    {latestWin.result}, {latestWin.short}
                  </a>
                  <span className="meta-list__sub">{latestWin.level.split(' · ').pop()}</span>
                </dd>
              </div>
            )}
            <div>
              <dt>Focus</dt>
              <dd>MERN · LangChain · LLMs · RAG</dd>
            </div>
          </dl>
          <p className="display display--italic hero__headline-2 hero__in" style={{ '--d': '0.8s' }}>
            Designing experiences that matter.
          </p>
        </div>

        <div className="hero__foot">
          <p className="hero__intro hero__in" style={{ '--d': '0.95s' }}>
            {profile.intro}
          </p>
          <div className="hero__actions hero__in" style={{ '--d': '1.05s' }}>
            <a className="btn btn--primary" href="#projects">
              Explore My Work
            </a>
            <a className="btn btn--ghost" href={profile.resume} download={profile.resumeFileName}>
              <Download /> Download Resume
            </a>
            <a className="btn btn--link" href="#contact">
              <Mail /> Contact
            </a>
          </div>
        </div>
      </div>

      <a className="scroll-cue hero__in" style={{ '--d': '1.3s' }} href="#about" aria-label="Scroll to About">
        <span>Scroll</span>
        <ArrowDown />
      </a>
      {introActive && !reducedMotion && (
        <button type="button" className="skip-intro" onClick={onSkipIntro}>
          Skip intro
        </button>
      )}
    </section>
  );
}
