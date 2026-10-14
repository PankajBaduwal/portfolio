import { useCallback, useEffect, useState } from 'react';
import About from './components/About.jsx';
import Achievements from './components/Achievements.jsx';
import Certifications from './components/Certifications.jsx';
import Contact from './components/Contact.jsx';
import Education from './components/Education.jsx';
import Experience from './components/Experience.jsx';
import Footer from './components/Footer.jsx';
import Hero from './components/Hero.jsx';
import Nav from './components/Nav.jsx';
import Projects from './components/Projects.jsx';
import Services from './components/Services.jsx';
import Skills from './components/Skills.jsx';

const INTRO_MS = 1900;

export default function App() {
  const [intro, setIntro] = useState(() => {
    try {
      return !sessionStorage.getItem('pb-intro-seen') && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && !location.hash;
    } catch {
      return false;
    }
  });
  const skip = useCallback(() => setIntro(false), []);

  useEffect(() => {
    if (!intro) return undefined;
    try {
      sessionStorage.setItem('pb-intro-seen', '1');
    } catch {
      /* private mode */
    }
    const t = setTimeout(skip, INTRO_MS);
    const onKey = () => skip();
    window.addEventListener('keydown', onKey, { once: true });
    window.addEventListener('wheel', onKey, { once: true, passive: true });
    window.addEventListener('touchstart', onKey, { once: true, passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('wheel', onKey);
      window.removeEventListener('touchstart', onKey);
    };
  }, [intro, skip]);

  return (
    <div className={`app${intro ? ' app--intro' : ''}`}>
      <Nav />
      <main id="main">
        <Hero introActive={intro} onSkipIntro={skip} />
        <About />
        <Education />
        <Skills />
        <Projects />
        <Experience />
        <Certifications />
        <Achievements />
        <Services />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
