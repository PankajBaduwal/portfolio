// Scroll engine for the effects CSS scroll timelines can't do on their own, and a stand-in for
// those timelines in browsers that lack animation-timeline (Firefox, older Safari):
//  - inertia smooth scrolling for mouse and trackpad (Lenis, driven by GSAP's ticker)
//  - the services row pinned and slid sideways as the page scrolls (wide screens)
//  - About copy lighting up word by word with scroll
//  - a slight skew on grids that follows scroll speed and settles when scrolling stops
//  - sections and project cards rising from depth where CSS timelines don't run
// Nothing runs when reduced motion is preferred; the page is complete and static without it.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

export function initScrollFx() {
  const mq = (q) => window.matchMedia(q).matches;
  if (mq('(prefers-reduced-motion: reduce)')) return () => {};
  gsap.registerPlugin(ScrollTrigger);
  const root = document.documentElement;
  const offs = [];

  // smooth wheel scrolling; touch keeps native scrolling, which already has momentum
  let lenis = null;
  if (mq('(hover: hover) and (pointer: fine)')) {
    const navH = parseFloat(getComputedStyle(root).getPropertyValue('--nav-h')) || 68;
    lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 0.95,
      anchors: { offset: -(navH + 12) },
      prevent: (node) => !!node.closest?.('dialog'),
    });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // an open dialog or menu locks the page, so the smooth scroller pauses with it
    const lock = new MutationObserver(() => (root.classList.contains('has-dialog') || root.classList.contains('has-menu') ? lenis.stop() : lenis.start()));
    lock.observe(root, { attributes: true, attributeFilter: ['class'] });
    offs.push(() => {
      lock.disconnect();
      gsap.ticker.remove(tick);
      lenis.destroy();
    });
  }

  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia();

    // About: each word brightens as the reading line passes it
    gsap.utils.toArray('.about__body').forEach((body) => {
      const words = body.querySelectorAll('.sw');
      if (!words.length) return;
      gsap.fromTo(
        words,
        { opacity: 0.16 },
        { opacity: 1, ease: 'none', stagger: 0.04, scrollTrigger: { trigger: body, start: 'top 82%', end: 'bottom 48%', scrub: 0.6 } },
      );
    });

    // services: the row pins and slides sideways, one card into view after another
    mm.add('(min-width: 1024px) and (hover: hover)', () => {
      const section = document.querySelector('.section.services');
      const track = section?.querySelector('.service-grid');
      if (!track) return undefined;
      section.classList.add('is-track');
      const travel = () => Math.max(0, track.scrollWidth - track.parentElement.clientWidth);
      const tween = gsap.to(track, {
        x: () => -travel(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${travel()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => section.style.setProperty('--track', self.progress.toFixed(4)),
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(track, { clearProps: 'transform' });
        section.classList.remove('is-track');
      };
    });

    // speed skew: grids lean into fast scrolling and ease back upright
    const leaners = gsap.utils.toArray('.project-grid, .cred-grid');
    if (leaners.length && mq('(min-width: 900px) and (hover: hover)')) {
      const skew = gsap.quickTo(leaners, 'skewY', { duration: 0.5, ease: 'power3' });
      ScrollTrigger.create({
        onUpdate: (self) => skew(gsap.utils.clamp(-3.5, 3.5, self.getVelocity() / -420)),
      });
      // settle once scrolling stops
      const settle = () => skew(0);
      ScrollTrigger.addEventListener('scrollEnd', settle);
      offs.push(() => ScrollTrigger.removeEventListener('scrollEnd', settle));
    }

    // browsers without CSS scroll timelines get the scene and card motion from GSAP instead
    if (!CSS.supports('animation-timeline: view()')) {
      gsap.utils.toArray('.section:not(.hero):not(.services) > .container').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 110, scale: 0.94, rotateX: 7, transformPerspective: 1400, transformOrigin: '50% 0%', opacity: 0.35 },
          { y: 0, scale: 1, rotateX: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 40%', scrub: 0.5 } },
        );
      });
      mm.add('(min-width: 641px)', () => {
        gsap.utils.toArray('.project').forEach((card, i) => {
          gsap.fromTo(
            card,
            { y: 90, z: -160, rotateX: 16, rotateY: ((i % 3) - 1) * 12, transformPerspective: 1100 },
            { y: 0, z: 0, rotateX: 0, rotateY: 0, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'top 55%', scrub: 0.5 } },
          );
        });
      });
    }
  });

  // content that loads late (fonts, images, the 3D card) shifts layout; re-measure once it settles
  const refresh = () => ScrollTrigger.refresh();
  // a link straight to a section (#projects) lands there once pins have added their height
  const target = location.hash.length > 1 && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (target) {
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      if (lenis) lenis.scrollTo(target, { immediate: true, force: true });
      else target.scrollIntoView();
    });
  }
  window.addEventListener('load', refresh);
  document.fonts?.ready.then(refresh);

  return () => {
    window.removeEventListener('load', refresh);
    ctx.revert();
    offs.forEach((f) => f());
  };
}
