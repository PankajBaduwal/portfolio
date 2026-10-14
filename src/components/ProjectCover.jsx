// Illustrated, layered covers. They depict each project's purpose abstractly
// (no fake screenshots); the three layers sit at different depths for parallax.
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.2, strokeLinecap: 'round', strokeLinejoin: 'round' };

const motifs = {
  recruit: [
    <g key="b" {...S} opacity=".35">
      {Array.from({ length: 7 }, (_, i) => (
        <path key={i} d={`M20 ${30 + i * 22}h280`} strokeDasharray="2 6" />
      ))}
    </g>,
    <g key="m" {...S}>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${46 + i * 22} ${42 + i * 26})`}>
          <rect width="150" height="70" rx="8" fill="var(--cover-fill)" />
          <circle cx="24" cy="26" r="11" />
          <path d="M44 22h70M44 34h46M16 52h118" />
        </g>
      ))}
    </g>,
    <g key="f" {...S} strokeWidth="2">
      <circle cx="250" cy="72" r="30" opacity=".3" />
      <path d="M250 42a30 30 0 1 1-26.6 16.2" className="cover-accent" />
      <text x="250" y="78" textAnchor="middle" className="cover-text">match</text>
    </g>,
  ],
  campus: [
    <g key="b" {...S} opacity=".3">
      {Array.from({ length: 6 }, (_, r) => Array.from({ length: 10 }, (_, c) => <circle key={`${r}-${c}`} cx={22 + c * 31} cy={22 + r * 30} r="1.2" />))}
    </g>,
    <g key="m" {...S}>
      <path d="M70 70 150 110 230 64M150 110l-20 60M150 110l90 50M70 70l-10 80" opacity=".7" />
      {[[70, 70], [150, 110], [230, 64], [130, 170], [240, 160], [60, 150]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 1 ? 14 : 9} fill="var(--cover-fill)" />
      ))}
    </g>,
    <g key="f" {...S}>
      <rect x="182" y="96" width="104" height="40" rx="12" fill="var(--cover-fill)" />
      <path d="M196 110h60M196 122h38" />
      <path d="M200 136l-8 10 18-10" fill="var(--cover-fill)" />
      <circle cx="270" cy="116" r="4" className="cover-accent-fill" />
    </g>,
  ],
  botanical: [
    <g key="b" {...S} opacity=".3">
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d={`M196 ${40 + i * 18}h96`} />
      ))}
    </g>,
    <g key="m" {...S}>
      <path d="M110 190C110 120 120 80 150 40" />
      <path d="M150 40c-40 10-58 40-52 72 30-6 50-36 52-72z" fill="var(--cover-fill)" />
      <path d="M128 104c40-6 66 12 72 46-34 4-62-14-72-46z" fill="var(--cover-fill)" />
      <path d="M116 150c-30-4-52 10-58 36 28 4 50-10 58-36z" fill="var(--cover-fill)" />
      <path d="M150 40 104 110M128 104l70 44M116 150l-56 34" opacity=".6" />
    </g>,
    <g key="f" {...S}>
      <circle cx="250" cy="170" r="16" />
      <path d="M262 182l14 14" strokeWidth="2" className="cover-accent" />
    </g>,
  ],
  interview: [
    <g key="b" {...S} opacity=".3">
      <rect x="24" y="30" width="130" height="150" rx="10" />
      <path d="M40 56h90M40 76h70M40 110h90M40 130h56" />
    </g>,
    <g key="m" {...S}>
      {[50, 34, 18].map((r) => (
        <polygon key={r} points={hex(230, 105, r)} opacity=".45" />
      ))}
      <polygon points="230,63 268,88 262,128 230,140 196,122 204,82" fill="var(--cover-fill)" />
    </g>,
    <g key="f" {...S} strokeWidth="2">
      <polygon points="230,63 268,88 262,128 230,140 196,122 204,82" className="cover-accent" />
      <path d="M40 160h20M68 160h50" className="cover-accent" />
    </g>,
  ],
  chat: [
    <g key="b" {...S} opacity=".3">
      <rect x="30" y="20" width="260" height="180" rx="14" />
    </g>,
    <g key="m" {...S}>
      <rect x="54" y="44" width="150" height="34" rx="12" fill="var(--cover-fill)" />
      <rect x="120" y="92" width="146" height="50" rx="12" fill="var(--cover-fill)" />
      <rect x="54" y="156" width="120" height="28" rx="12" fill="var(--cover-fill)" />
      <path d="M70 61h100M136 108h110M136 124h80M70 170h70" opacity=".7" />
    </g>,
    <g key="f" {...S} strokeWidth="2">
      <path d="M136 108h18" className="cover-accent" />
      <circle cx="252" cy="170" r="3" className="cover-accent-fill" />
      <circle cx="240" cy="170" r="3" className="cover-accent-fill" opacity=".6" />
      <circle cx="228" cy="170" r="3" className="cover-accent-fill" opacity=".3" />
    </g>,
  ],
  documents: [
    <g key="b" {...S} opacity=".35">
      <rect x="70" y="30" width="120" height="156" rx="6" transform="rotate(-10 130 108)" fill="var(--cover-fill)" />
    </g>,
    <g key="m" {...S}>
      <rect x="100" y="30" width="120" height="156" rx="6" transform="rotate(4 160 108)" fill="var(--cover-fill)" />
      <path d="M118 62h80M118 78h64M118 94h80M118 110h50" transform="rotate(4 160 108)" opacity=".7" />
    </g>,
    <g key="f" {...S} strokeWidth="2">
      <path d="M118 126h84" transform="rotate(4 160 108)" className="cover-accent" />
      <rect x="226" y="132" width="64" height="40" rx="8" fill="var(--cover-fill)" />
      <path d="M238 146h40M238 158h24" />
    </g>,
  ],
};

function hex(cx, cy, r) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(' ');
}

export default function ProjectCover({ motif, label }) {
  const layers = motifs[motif] || motifs.documents;
  return (
    <div className="cover" role="img" aria-label={`Illustration for ${label}`}>
      {layers.map((layer, i) => (
        <svg key={i} className={`cover__layer cover__layer--${i}`} viewBox="0 0 320 210" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          {layer}
        </svg>
      ))}
    </div>
  );
}
