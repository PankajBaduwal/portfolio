// Minimal line icon set (1.5px strokes) shared across the site.
const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
};

export const ArrowDown = (p) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </svg>
);
export const ArrowUpRight = (p) => (
  <svg {...base} {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);
export const ArrowUp = (p) => (
  <svg {...base} {...p}>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </svg>
);
export const Download = (p) => (
  <svg {...base} {...p}>
    <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
  </svg>
);
export const Mail = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);
export const Phone = (p) => (
  <svg {...base} {...p}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
  </svg>
);
export const Pin = (p) => (
  <svg {...base} {...p}>
    <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);
export const Close = (p) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const Github = (p) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...p}>
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z" />
  </svg>
);
export const Linkedin = (p) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...p}>
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.37V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM3.56 20.45h3.55V9H3.56v11.45z" />
  </svg>
);
export const Leetcode = (p) => (
  <svg {...base} {...p}>
    <path d="M14 4 7 11a2.5 2.5 0 0 0 0 3.5l3.5 3.5a2.5 2.5 0 0 0 3.5 0L16 16M9 13h11" />
  </svg>
);
export const Instagram = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r=".6" fill="currentColor" />
  </svg>
);

export const socialIcon = { GitHub: Github, LinkedIn: Linkedin, LeetCode: Leetcode, Instagram };

// Service glyphs — each drawn for what the service actually is.
export const serviceIcons = {
  web: (
    <g>
      <rect x="4" y="7" width="40" height="30" rx="3" />
      <path d="M4 14h40M9 10.5h.01M13 10.5h.01M17 10.5h.01" />
      <path d="M12 22h14M12 27h22M12 32h10" />
    </g>
  ),
  software: (
    <g>
      <path d="M17 14 8 24l9 10M31 14l9 10-9 10M27 10l-6 28" />
    </g>
  ),
  mern: (
    <g>
      <ellipse cx="24" cy="24" rx="18" ry="7" />
      <ellipse cx="24" cy="24" rx="18" ry="7" transform="rotate(60 24 24)" />
      <ellipse cx="24" cy="24" rx="18" ry="7" transform="rotate(120 24 24)" />
      <circle cx="24" cy="24" r="2.5" />
    </g>
  ),
  uiux: (
    <g>
      <rect x="6" y="6" width="22" height="22" rx="3" />
      <rect x="20" y="20" width="22" height="22" rx="3" />
      <path d="M11 12h12M11 17h8" />
    </g>
  ),
  ecommerce: (
    <g>
      <path d="M6 8h5l4 22h22l4-15H14" />
      <circle cx="18" cy="38" r="2.5" />
      <circle cx="34" cy="38" r="2.5" />
    </g>
  ),
  agentic: (
    <g>
      <circle cx="24" cy="24" r="5" />
      <circle cx="10" cy="10" r="3" />
      <circle cx="38" cy="10" r="3" />
      <circle cx="10" cy="38" r="3" />
      <circle cx="38" cy="38" r="3" />
      <path d="M12.5 12.5l7.5 7.5M35.5 12.5 28 20M12.5 35.5 20 28M35.5 35.5 28 28" />
    </g>
  ),
  chatbot: (
    <g>
      <path d="M6 10a4 4 0 0 1 4-4h20a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H16l-7 6v-6a4 4 0 0 1-3-4z" />
      <path d="M22 30v2a4 4 0 0 0 4 4h8l6 5v-5a4 4 0 0 0 2-3.5V22a4 4 0 0 0-4-4" />
      <path d="M13 16h.01M20 16h.01M27 16h.01" />
    </g>
  ),
  dataviz: (
    <g>
      <path d="M6 40h36M10 40V28M18 40V18M26 40V24M34 40V10" />
      <path d="M8 22l10-8 8 6 12-12" />
    </g>
  ),
  api: (
    <g>
      <path d="M14 10c-4 0-4 3-4 6s-2 4-4 4c2 0 4 1 4 4s0 6 4 6M34 10c4 0 4 3 4 6s2 4 4 4c-2 0-4 1-4 4s0 6-4 6" />
      <path d="M19 20h.01M24 20h.01M29 20h.01" />
    </g>
  ),
};
