// Draws the identity card faces onto 2D canvases. The same drawing is used
// as the WebGL texture and as the static/CSS fallback, so both look identical.
import { profile, socials } from '../data/portfolio.js';

export const CARD = { w: 2.0, h: 3.17, radius: 0.14 }; // world units, CR80-like portrait ratio
export const TEX = { w: 1024, h: Math.round(1024 * (CARD.h / CARD.w)) }; // 1024 x 1623
// Slot hole, in texture pixels (centre x, top y, width, height)
export const SLOT = { cx: TEX.w / 2, y: 64, w: 176, h: 38 };
// Photo window, in texture pixels
export const PHOTO = { x: 64, y: 196, w: 896, h: 780, r: 26 };

const C = {
  base: '#161e31',
  baseHi: '#1b253d',
  ink: '#dadde5',
  ink2: '#a1a9bc',
  muted: '#6e7a97',
  line: 'rgba(214,224,240,0.14)',
  accent: '#4d8dff',
};

const SERIF = '"Instrument Serif", Georgia, serif';
const SANS = '"Geist Variable", system-ui, sans-serif';
const MONO = '"Geist Mono Variable", ui-monospace, monospace';

export async function loadCardFonts() {
  if (!document.fonts) return;
  try {
    await Promise.all([
      document.fonts.load(`120px ${SERIF}`),
      document.fonts.load(`italic 120px ${SERIF}`),
      document.fonts.load(`500 34px ${SANS}`),
      document.fonts.load(`500 22px ${MONO}`),
    ]);
  } catch {
    /* fall back to system fonts */
  }
}

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Small deterministic PRNG so the decorative pattern never changes between renders.
function prng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function surface(ctx, w, h, tone = C.base, seed = 7) {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, C.baseHi);
  g.addColorStop(0.55, tone);
  g.addColorStop(1, '#131a29');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  // brushed satin: very faint horizontal strokes
  const rand = prng(seed);
  ctx.globalAlpha = 0.035;
  for (let i = 0; i < 900; i++) {
    const y = rand() * h;
    ctx.strokeStyle = rand() > 0.5 ? '#ffffff' : '#000000';
    ctx.lineWidth = rand() * 1.2 + 0.2;
    ctx.beginPath();
    const x = rand() * w;
    ctx.moveTo(x, y);
    ctx.lineTo(x + 80 + rand() * 260, y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function slotRing(ctx) {
  const { cx, y, w, h } = SLOT;
  ctx.save();
  rr(ctx, cx - w / 2 - 10, y - 10, w + 20, h + 20, (h + 20) / 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.10)';
  ctx.lineWidth = 2;
  ctx.stroke();
  rr(ctx, cx - w / 2, y, w, h, h / 2);
  ctx.fillStyle = '#0c111c';
  ctx.fill();
  ctx.restore();
}

function mono(ctx, text, x, y, { size = 20, color = C.muted, align = 'left', spacing = 3, weight = 500 } = {}) {
  ctx.save();
  ctx.font = `${weight} ${size}px ${MONO}`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = 'alphabetic';
  if ('letterSpacing' in ctx) ctx.letterSpacing = `${spacing}px`;
  ctx.fillText(text.toUpperCase(), x, y);
  ctx.restore();
}

function corners(ctx, x, y, w, h, len = 22, color = 'rgba(214,224,240,0.55)') {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  const pts = [
    [x, y, 1, 1],
    [x + w, y, -1, 1],
    [x, y + h, 1, -1],
    [x + w, y + h, -1, -1],
  ];
  for (const [px, py, sx, sy] of pts) {
    ctx.beginPath();
    ctx.moveTo(px + sx * len, py);
    ctx.lineTo(px, py);
    ctx.lineTo(px, py + sy * len);
    ctx.stroke();
  }
  ctx.restore();
}

function dotMatrix(ctx, x, y, cols, rows, cell, seed) {
  const rand = prng(seed);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const on = rand() > 0.42;
      ctx.fillStyle = on ? 'rgba(214,224,240,0.62)' : 'rgba(214,224,240,0.10)';
      ctx.beginPath();
      ctx.arc(x + c * cell + cell / 2, y + r * cell + cell / 2, cell * 0.28, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/**
 * Front face. When `includePhoto` is false the photo window is left as a dark recess,
 * because the 3D scene renders the photo on its own raised, glossier laminate layer.
 */
export function drawFront(canvas, photo, { includePhoto = true } = {}) {
  const { w, h } = TEX;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  surface(ctx, w, h, C.base, 11);
  slotRing(ctx);

  // header micro-labels
  mono(ctx, 'Developer Identity', 64, 152, { size: 25, color: C.ink2 });
  mono(ctx, 'PB · Series 01', w - 64, 152, { size: 25, align: 'right' });

  // photo window
  ctx.save();
  rr(ctx, PHOTO.x, PHOTO.y, PHOTO.w, PHOTO.h, PHOTO.r);
  ctx.fillStyle = '#0f1421';
  ctx.fill();
  if (includePhoto && photo) {
    ctx.clip();
    drawPhoto(ctx, photo, PHOTO.x, PHOTO.y, PHOTO.w, PHOTO.h);
  }
  ctx.restore();
  ctx.save();
  rr(ctx, PHOTO.x - 1, PHOTO.y - 1, PHOTO.w + 2, PHOTO.h + 2, PHOTO.r + 1);
  ctx.strokeStyle = 'rgba(255,255,255,0.10)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  // name
  const nameY = PHOTO.y + PHOTO.h + 128;
  ctx.save();
  ctx.fillStyle = C.ink;
  ctx.textBaseline = 'alphabetic';
  ctx.font = `128px ${SERIF}`;
  ctx.fillText(profile.firstName, 58, nameY);
  ctx.font = `italic 128px ${SERIF}`;
  ctx.fillText(profile.lastName, 58, nameY + 112);
  ctx.restore();

  // role
  ctx.save();
  ctx.fillStyle = C.ink2;
  ctx.font = `500 32px ${SANS}`;
  ctx.fillText('Full Stack MERN Developer &', 64, nameY + 182);
  ctx.fillText('Generative AI Developer', 64, nameY + 224);
  ctx.restore();

  // tagline
  ctx.save();
  ctx.fillStyle = C.muted;
  ctx.font = `400 28px ${SANS}`;
  ctx.fillText('Scalable web apps · AI-powered platforms', 64, nameY + 280);
  ctx.restore();

  // right column: tech identifiers stacked
  const tx = w - 64;
  let ty = nameY - 84;
  mono(ctx, 'Stack', tx, ty, { size: 22, align: 'right', color: C.muted });
  ty += 44;
  for (const t of profile.cardTech) {
    ctx.save();
    ctx.font = `500 25px ${MONO}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '2px';
    const tw = ctx.measureText(t.toUpperCase()).width + 30;
    rr(ctx, tx - tw, ty - 33, tw, 46, 10);
    ctx.strokeStyle = C.line;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = C.ink;
    ctx.textAlign = 'right';
    ctx.fillText(t.toUpperCase(), tx - 14, ty - 1);
    ctx.restore();
    ty += 56;
  }

  // footer strip
  const fy = h - 150;
  ctx.fillStyle = C.line;
  ctx.fillRect(64, fy - 34, w - 128, 2);
  dotMatrix(ctx, 64, fy, 12, 4, 18, 20230627);
  mono(ctx, 'B.Tech IT · KPRIET', w - 64, fy + 28, { size: 24, align: 'right', color: C.ink2 });
  mono(ctx, 'Coimbatore · IN', w - 64, fy + 66, { size: 24, align: 'right' });
  return canvas;
}

export function drawPhoto(ctx, photo, x, y, w, h) {
  const ir = photo.width / photo.height;
  const r = w / h;
  let sw = photo.width;
  let sh = photo.height;
  let sx = 0;
  let sy = 0;
  if (ir > r) {
    sw = photo.height * r;
    sx = (photo.width - sw) / 2;
  } else {
    sh = photo.width / r;
    sy = 0;
  }
  ctx.drawImage(photo, sx, sy, sw, sh, x, y, w, h);
  // gentle grade to sit the bright studio backdrop into the dark card
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, 'rgba(15,20,33,0.30)');
  g.addColorStop(0.45, 'rgba(15,20,33,0.0)');
  g.addColorStop(1, 'rgba(15,20,33,0.42)');
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
  corners(ctx, x + 22, y + 22, w - 44, h - 44);
  // availability indicator
  ctx.save();
  ctx.font = `500 23px ${MONO}`;
  if ('letterSpacing' in ctx) ctx.letterSpacing = '2px';
  const label = profile.availability.toUpperCase();
  const lw = ctx.measureText(label).width;
  const px = x + 46;
  const py = y + h - 52;
  rr(ctx, px - 16, py - 34, lw + 70, 50, 25);
  ctx.fillStyle = 'rgba(15,20,33,0.72)';
  ctx.fill();
  ctx.fillStyle = C.accent;
  ctx.beginPath();
  ctx.arc(px + 8, py - 8, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = C.ink;
  ctx.fillText(label, px + 28, py - 1);
  ctx.restore();
}

/** Back face: signature panel, contact details and a plain disclaimer. */
export function drawBack(canvas) {
  const { w, h } = TEX;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  surface(ctx, w, h, '#131b2d', 23);
  // the back is seen mirrored through the slot, so the slot sits at the same place
  slotRing(ctx);

  // stripe
  ctx.fillStyle = '#0d121d';
  ctx.fillRect(0, 170, w, 120);
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  ctx.fillRect(0, 170, w, 2);

  mono(ctx, 'Holder information', 64, 380, { size: 25, color: C.ink2 });
  ctx.fillStyle = C.ink;
  ctx.font = `86px ${SERIF}`;
  ctx.fillText('If found,', 60, 480);
  ctx.font = `italic 86px ${SERIF}`;
  ctx.fillText('start a conversation.', 60, 566);

  const rows = [
    ['Email', profile.email],
    ['Phone', profile.phone],
    ['GitHub', socials[0].handle],
    ['LinkedIn', socials[1].handle],
    ['Based in', profile.locationShort],
  ];
  let y = 680;
  for (const [k, v] of rows) {
    ctx.fillStyle = C.line;
    ctx.fillRect(64, y - 44, w - 128, 2);
    mono(ctx, k, 64, y, { size: 23 });
    ctx.save();
    ctx.fillStyle = C.ink;
    ctx.font = `500 30px ${SANS}`;
    ctx.textAlign = 'right';
    ctx.fillText(v, w - 64, y + 2);
    ctx.restore();
    y += 82;
  }

  mono(ctx, 'Focus', 64, y + 24, { size: 23 });
  ctx.save();
  ctx.fillStyle = C.ink2;
  ctx.font = `400 28px ${SANS}`;
  ctx.fillText('MERN Stack · LangChain · LLMs · RAG', 64, y + 72);
  ctx.fillText('AWS Cloud · Data Science', 64, y + 112);
  ctx.restore();

  // signature panel
  const sy = h - 330;
  ctx.save();
  rr(ctx, 64, sy, w - 128, 120, 12);
  ctx.fillStyle = '#c4c9d5';
  ctx.fill();
  ctx.clip();
  ctx.globalAlpha = 0.18;
  ctx.strokeStyle = '#5a6888';
  for (let i = -20; i < 60; i++) {
    ctx.beginPath();
    ctx.moveTo(64 + i * 22, sy);
    ctx.lineTo(64 + i * 22 + 120, sy + 120);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#192339';
  ctx.font = `italic 72px ${SERIF}`;
  ctx.fillText(profile.name, 96, sy + 86);
  ctx.restore();
  mono(ctx, 'Signature of holder', 64, sy + 156, { size: 21 });

  ctx.save();
  ctx.fillStyle = C.muted;
  ctx.font = `400 24px ${SANS}`;
  ctx.fillText('A portfolio object. It grants no access and certifies', 64, h - 96);
  ctx.fillText('nothing — it introduces the person who made it.', 64, h - 62);
  ctx.restore();
  return canvas;
}
