# Pankaj Baduwal — Developer Identity

Personal portfolio of **Pankaj Baduwal**, Full Stack MERN Developer & Generative AI Developer.
The site is built around one object: an interactive, genuinely 3D identity card rendered with WebGL.

Live: https://pankajbaduwal.vercel.app

## Stack

- **Vite + React 19**, plain JavaScript
- **Three.js + React Three Fiber + Drei** for the identity card (lazy-loaded, only rendered while on screen)
- Self-hosted fonts via Fontsource: Instrument Serif (display), Geist (text), Geist Mono (labels)
- No CSS framework; one stylesheet with design tokens in `src/styles/main.css`

## Run locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the production build
```

## Where things live

| Path | What |
| --- | --- |
| `src/data/portfolio.js` | **All content** (profile, education, skills, projects, experience, certifications, achievements, services). Edit here only. |
| `src/lib/cardFace.js` | Draws the card's front and back faces. Used as the WebGL texture *and* the static fallback, so both always match. |
| `src/three/IdCardCanvas.jsx` | The 3D scene: extruded card body with bevel and slot, raised photo laminate, key/rim/sweep lights, contact shadow. |
| `src/components/Hero.jsx` | Card interaction (pointer tilt, drag to turn, keyboard, flip/reset), WebGL detection and CSS-3D fallback. |
| `src/components/*` | One component per section. |
| `public/img`, `public/docs` | Optimised photos, certificate images, resume PDF. |

## Card interaction

- Mouse: the card tilts toward the cursor and catches a moving highlight; drag to turn it over.
- Touch: swipe sideways to turn; vertical swipes scroll the page normally.
- Keyboard: focus the card, arrow keys tilt, Enter flips, Escape resets.
- Without WebGL (or with Save-Data on) a CSS-3D version of the same card is shown.
- `prefers-reduced-motion` skips the intro and all travelling animation.

## Contact form

The form validates input, then sends through one of these, configured in Vercel → Settings → Environment Variables:

- `VITE_WEB3FORMS_KEY` — free key from https://web3forms.com (recommended), or
- `VITE_CONTACT_ENDPOINT` — any JSON endpoint such as Formspree (`https://formspree.io/f/xxxx`).

With neither set, submitting opens the visitor's email app with the message pre-filled; it never shows a fake "sent" message.
See `.env.example`. Redeploy after adding a variable.

## Deploy

Vercel picks up `vercel.json` (framework: Vite, output `dist`). No other settings are needed.
