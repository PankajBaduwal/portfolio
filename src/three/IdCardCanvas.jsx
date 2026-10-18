// The signature WebGL scene: a modelled identity card with real thickness,
// a raised photo laminate, hung from a simulated lanyard, with controlled
// key/rim lighting and contact shadows.
import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import { CARD, PHOTO, SLOT, TEX } from '../lib/cardFace.js';

const DEPTH = 0.03;
const BEVEL = 0.012;

function roundedRectShape(w, h, r, withSlot) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  if (withSlot) {
    const k = w / TEX.w; // texture px -> world
    const sw = SLOT.w * k;
    const sh = SLOT.h * k;
    const cy = h / 2 - (SLOT.y + SLOT.h / 2) * k;
    const hole = new THREE.Path();
    const rr = sh / 2;
    hole.moveTo(-sw / 2 + rr, cy - rr);
    hole.lineTo(sw / 2 - rr, cy - rr);
    hole.absarc(sw / 2 - rr, cy, rr, -Math.PI / 2, Math.PI / 2, false);
    hole.lineTo(-sw / 2 + rr, cy + rr);
    hole.absarc(-sw / 2 + rr, cy, rr, Math.PI / 2, (3 * Math.PI) / 2, false);
    s.holes.push(hole);
  }
  return s;
}

function planarUV(geo, w, h, ox = 0, oy = 0) {
  const pos = geo.attributes.position;
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = (pos.getX(i) - ox + w / 2) / w;
    uv[i * 2 + 1] = (pos.getY(i) - oy + h / 2) / h;
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return geo;
}

function useCanvasTexture(canvas, anisotropy) {
  const tex = useMemo(() => {
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = anisotropy;
    return t;
  }, [canvas, anisotropy]);
  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
}

// Critically-damped-ish spring, framerate independent.
function spring(state, target, dt, stiffness = 90, damping = 14) {
  const a = (target - state.x) * stiffness - state.v * damping;
  state.v += a * dt;
  state.x += state.v * dt;
}

// --- Lanyard -------------------------------------------------------------
// A small position-based rope: fixed anchor above the frame, a heavy end where
// the clip meets the card. Cheap enough to run every frame on phones.
const ROPE_N = 18;
const STEP = 1 / 120;
const GRAVITY = 11;
const DAMP = 0.992;
const STRAP_W = 0.3; // card-local units, matches the clamp
// card-local layout below the rope end (rope end = top of the clamp)
const CLAMP_H = 0.14;
const RING_R = 0.085;
const SLOT_FROM_TOP = ((SLOT.y + SLOT.h / 2) * CARD.w) / TEX.w;
const HOLE_Y = -0.32;
const CARD_Y = HOLE_Y + SLOT_FROM_TOP - CARD.h / 2; // card centre relative to the rope end

function makeRope(anchor, end) {
  const pts = [];
  for (let i = 0; i < ROPE_N; i++) {
    const t = i / (ROPE_N - 1);
    pts.push({
      p: new THREE.Vector3().lerpVectors(anchor, end, t),
      q: new THREE.Vector3().lerpVectors(anchor, end, t),
      w: i === 0 ? 0 : i === ROPE_N - 1 ? 0.06 : 1,
    });
  }
  return { pts, seg: anchor.distanceTo(end) / (ROPE_N - 1), acc: 0 };
}

const tmp = new THREE.Vector3();

function stepRope(rope, dragTarget, wind) {
  const { pts, seg } = rope;
  const last = pts[ROPE_N - 1];
  for (let i = 1; i < ROPE_N; i++) {
    const pt = pts[i];
    if (i === ROPE_N - 1 && dragTarget) {
      // pinned to the pointer; keep the motion so release carries momentum
      pt.q.copy(pt.p);
      pt.p.lerp(dragTarget, 0.25);
      continue;
    }
    tmp.copy(pt.p).sub(pt.q).multiplyScalar(DAMP);
    pt.q.copy(pt.p);
    pt.p.add(tmp);
    pt.p.y -= GRAVITY * STEP * STEP;
    pt.p.x += wind.x * STEP * STEP;
    pt.p.z += wind.z * STEP * STEP;
  }
  for (let k = 0; k < 14; k++) {
    for (let i = 0; i < ROPE_N - 1; i++) {
      const a = pts[i];
      const b = pts[i + 1];
      const wa = a.w;
      const wb = i + 1 === ROPE_N - 1 && dragTarget ? 0 : b.w;
      const sum = wa + wb;
      if (!sum) continue;
      tmp.copy(b.p).sub(a.p);
      const d = tmp.length() || 1e-6;
      // inextensible, but allowed to go slack
      if (d <= seg) continue;
      tmp.multiplyScalar((d - seg) / d / sum);
      a.p.addScaledVector(tmp, wa);
      b.p.addScaledVector(tmp, -wb);
    }
  }
  return last;
}

function makeStrapTexture(anisotropy) {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 96;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#32271e';
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = '#403730';
  ctx.fillRect(0, 6, c.width, 3);
  ctx.fillRect(0, c.height - 9, c.width, 3);
  ctx.fillStyle = '#e69864';
  ctx.font = '500 34px "Geist Mono Variable", ui-monospace, monospace';
  ctx.textBaseline = 'middle';
  const label = 'PANKAJ BADUWAL  ·  ';
  const w = ctx.measureText(label).width;
  for (let x = 24; x < c.width; x += w) ctx.fillText(label, x, c.height / 2 + 1);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = THREE.RepeatWrapping;
  t.anisotropy = anisotropy;
  return t;
}

function Card({ faces, control, introRef, reducedMotion, bleedTop, lowPower }) {
  const outer = useRef();
  const photoRef = useRef();
  const inner = useRef();
  const strap = useRef();
  const sweep = useRef();
  const key = useRef();
  const glint = useRef();
  const { gl, viewport } = useThree();
  const aniso = Math.min(8, gl.capabilities.getMaxAnisotropy());
  const front = useCanvasTexture(faces.front, aniso);
  const back = useCanvasTexture(faces.back, aniso);
  const photo = useCanvasTexture(faces.photo, aniso);
  const strapTex = useMemo(() => makeStrapTexture(aniso), [aniso]);
  useEffect(() => () => strapTex.dispose(), [strapTex]);

  const geos = useMemo(() => {
    const { w, h, radius } = CARD;
    const outline = roundedRectShape(w, h, radius, true);
    const body = new THREE.ExtrudeGeometry(outline, {
      depth: DEPTH,
      bevelEnabled: true,
      bevelThickness: BEVEL,
      bevelSize: BEVEL,
      bevelSegments: 5,
      curveSegments: 28,
    });
    body.translate(0, 0, -DEPTH / 2);
    const face = planarUV(new THREE.ShapeGeometry(outline, 28), w, h);
    const k = w / TEX.w;
    const pw = PHOTO.w * k;
    const ph = PHOTO.h * k;
    const pcx = -w / 2 + (PHOTO.x + PHOTO.w / 2) * k;
    const pcy = h / 2 - (PHOTO.y + PHOTO.h / 2) * k;
    const photoShape = roundedRectShape(pw, ph, PHOTO.r * k, false);
    const photoGeo = planarUV(new THREE.ShapeGeometry(photoShape, 16), pw, ph);
    photoGeo.translate(pcx, pcy, 0);
    const clamp = new THREE.BoxGeometry(STRAP_W + 0.03, CLAMP_H, 0.05);
    clamp.translate(0, -CLAMP_H / 2, 0);
    const ring = new THREE.TorusGeometry(RING_R, 0.012, 10, 40);
    const ribbon = new THREE.BufferGeometry();
    ribbon.setAttribute('position', new THREE.BufferAttribute(new Float32Array(ROPE_N * 2 * 3), 3));
    ribbon.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(ROPE_N * 2 * 2), 2));
    ribbon.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(ROPE_N * 2 * 3), 3));
    const idx = [];
    for (let i = 0; i < ROPE_N - 1; i++) {
      const a = i * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
    ribbon.setIndex(idx);
    return { body, face, photoGeo, clamp, ring, ribbon };
  }, []);
  useEffect(() => () => Object.values(geos).forEach((g) => g.dispose()), [geos]);

  const faceZ = DEPTH / 2 + BEVEL + 0.0006;
  const springs = useRef({ rx: { x: 0, v: 0 }, ry: { x: 0, v: 0 }, rz: { x: 0, v: 0 }, tx: { x: 0, v: 0 }, sc: { x: 0, v: 0 } }).current;

  // Frame layout. The canvas bleeds `bleedTop` of the stage height above it,
  // 10% below and 40% to each side; fit the card to the stage's share of it.
  const layout = useMemo(() => {
    const vh = viewport.height;
    const vw = viewport.width;
    const span = 1.1 + bleedTop; // canvas height in stage heights
    const stageH = vh / span;
    const scale = Math.min(1, (0.74 * stageH) / CARD.h, vw / 3.96);
    const centerY = -((bleedTop / 2 - 0.05) / span) * vh;
    const end = new THREE.Vector3(0, centerY - CARD_Y * scale, 0);
    const anchor = new THREE.Vector3(0, vh / 2 + 0.4, -0.35);
    return { vw, stageH, scale, centerY, end, anchor, shadowY: centerY - (CARD.h / 2) * scale - 0.14 };
  }, [viewport.height, viewport.width, bleedTop]);

  const ropeRef = useRef(null);
  const grabRef = useRef(null);
  if (!ropeRef.current || ropeRef.current.layout !== layout) {
    const rope = makeRope(layout.anchor, layout.end);
    rope.layout = layout;
    // first appearance: let the card swing in from the side
    if (!reducedMotion && !introRef.current.done && introRef.current.t < 0.5) {
      rope.pts.forEach((pt, i) => {
        const f = i / (ROPE_N - 1);
        pt.p.x += 0.75 * layout.scale * f * f;
        pt.q.copy(pt.p);
      });
    }
    ropeRef.current = rope;
  }

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const t = state.clock.elapsedTime;
    const c = control.current;
    const rope = ropeRef.current;
    const { scale } = layout;
    // intro progress 0..1
    let p = 1;
    if (!reducedMotion && !introRef.current.done) {
      introRef.current.t += dt / 1.7;
      p = Math.min(1, introRef.current.t);
      if (p >= 1) introRef.current.done = true;
    }
    const e = 1 - Math.pow(1 - p, 3);
    const idle = reducedMotion || c.dragging || c.hovering ? 0 : 1;

    // drag: the clip follows the pointer (in world units of the stage)
    let dragTarget = null;
    const toWorld = (pt) => ({ x: (pt.x * layout.vw) / 3.6, y: layout.centerY + (pt.y * layout.stageH) / 2 });
    if (c.dragging && c.grab) {
      const last = rope.pts[ROPE_N - 1].p;
      if (!grabRef.current) grabRef.current = { from: last.clone(), at: toWorld(c.grab) };
      const now = toWorld(c.pointer);
      dragTarget = tmp.set(now.x - grabRef.current.at.x, now.y - grabRef.current.at.y, 0);
      const lim = 0.9 * scale;
      if (dragTarget.length() > lim) dragTarget.setLength(lim);
      dragTarget = dragTarget.add(grabRef.current.from).clone();
      // never lift the clip above the anchor's reach
      const reach = rope.seg * (ROPE_N - 1);
      const off = dragTarget.clone().sub(layout.anchor);
      if (off.length() > reach) dragTarget.copy(layout.anchor).add(off.setLength(reach));
    } else grabRef.current = null;

    const wind = {
      x: idle * Math.sin(t * 0.7) * 0.35 + idle * Math.sin(t * 1.9) * 0.12,
      z: idle * Math.sin(t * 0.45) * 0.4,
    };
    rope.acc += dt;
    let steps = 0;
    while (rope.acc >= STEP && steps < 6) {
      stepRope(rope, dragTarget, wind);
      rope.acc -= STEP;
      steps++;
    }
    if (steps === 6) rope.acc = 0;
    const pts = rope.pts;
    const endP = pts[ROPE_N - 1].p;
    const prevP = pts[ROPE_N - 2].p;
    const d = tmp.copy(endP).sub(prevP).normalize();
    // the card hangs off the clip and lags the strap a little
    spring(springs.rz, Math.atan2(d.x, -d.y), dt, 55, 7);
    spring(springs.tx, -Math.asin(THREE.MathUtils.clamp(d.z, -1, 1)), dt, 55, 7);

    // scroll: as the hero leaves, the card tips back, turns and recedes to the side.
    // A stiff spring keeps it glued to the scrollbar while smoothing wheel steps.
    spring(springs.sc, reducedMotion ? 0 : c.scroll || 0, dt, 160, 24);
    // eased so the turn reads early in the scroll
    const raw = Math.min(1, Math.max(0, springs.sc.x));
    const sc = (1 - (1 - raw) * (1 - raw)) * (lowPower ? 0.7 : 1);
    const tx = c.base.rx + c.tilt.rx + (1 - e) * 0.32 - sc * 1.05;
    const ty = c.base.ry + c.tilt.ry + (1 - e) * -1.15 + idle * Math.sin(t * 0.35) * 0.05 - sc * 0.95;
    if (c.dragging) {
      springs.ry.x = ty;
      springs.ry.v = 0;
    } else spring(springs.ry, ty, dt);
    spring(springs.rx, tx, dt);

    const o = outer.current;
    o.position.copy(endP);
    o.position.x += sc * layout.vw * 0.2;
    o.position.z -= sc * 2.4;
    o.position.y -= sc * layout.stageH * 0.3;
    o.rotation.set(springs.tx.x, 0, springs.rz.x + sc * 0.12, 'ZXY');
    o.scale.setScalar(scale * (0.94 + 0.06 * e) * (1 - sc * 0.12));
    // the photo laminate lifts off the card as it turns, so its layers separate in depth
    if (photoRef.current) photoRef.current.position.z = faceZ + 0.0035 + sc * 0.03;
    // the camera rises a little and looks down onto the tipped card, like moving past it
    state.camera.position.y = sc * 0.6;
    state.camera.lookAt(0, 0, 0);
    inner.current.rotation.set(springs.rx.x, springs.ry.x, 0);

    // strap: a camera-facing ribbon along the rope, ending at the clamp
    const geo = strap.current?.geometry;
    if (geo) {
      const pos = geo.attributes.position.array;
      const uv = geo.attributes.uv.array;
      const nrm = geo.attributes.normal.array;
      const half = (STRAP_W * o.scale.x) / 2;
      let len = 0;
      for (let i = 0; i < ROPE_N; i++) {
        const a = pts[Math.max(0, i - 1)].p;
        const b = pts[Math.min(ROPE_N - 1, i + 1)].p;
        const tdx = b.x - a.x;
        const tdy = b.y - a.y;
        const tl = Math.hypot(tdx, tdy) || 1;
        const sx = -tdy / tl;
        const sy = tdx / tl;
        const pt = pts[i].p;
        if (i > 0) len += pt.distanceTo(pts[i - 1].p);
        pos.set([pt.x - sx * half, pt.y - sy * half, pt.z, pt.x + sx * half, pt.y + sy * half, pt.z], i * 6);
        const u = len / (half * 2 * 10.6);
        uv.set([u, 0, u, 1], i * 4);
        nrm.set([0, 0, 1, 0, 0, 1], i * 6);
      }
      geo.attributes.position.needsUpdate = true;
      geo.attributes.uv.needsUpdate = true;
      geo.computeBoundingSphere();
    }

    // light sweep reveal: a narrow light crossing the card once
    if (sweep.current) {
      sweep.current.position.x = THREE.MathUtils.lerp(-5, 5, p);
      sweep.current.intensity = p < 1 ? Math.sin(p * Math.PI) * 60 : 0;
    }
    if (key.current) key.current.intensity = 2.3 * e;
    if (glint.current) {
      glint.current.position.set(c.pointer.x * 2.2, c.pointer.y * 2.2, 2.0);
      const target = c.hovering || c.dragging ? 5 : 0;
      glint.current.intensity += (target - glint.current.intensity) * Math.min(1, dt * 6);
    }
  });

  return (
    <>
      <ambientLight intensity={0.18} />
      <directionalLight ref={key} position={[-3, 4, 5]} intensity={0} color="#fff4e8" />
      <directionalLight position={[4, 2, -4]} intensity={2.2} color="#ffc097" />
      <spotLight ref={sweep} position={[-5, 0.5, 3]} angle={0.12} penumbra={0.6} intensity={0} color="#ffffff" distance={12} />
      <pointLight ref={glint} position={[0, 0, 2]} intensity={0} distance={6} decay={2} color="#ffe6d5" />
      <mesh ref={strap} geometry={geos.ribbon} frustumCulled={false}>
        <meshStandardMaterial map={strapTex} roughness={0.78} metalness={0.05} side={THREE.DoubleSide} />
      </mesh>
      <group ref={outer}>
        <group ref={inner}>
          <mesh geometry={geos.clamp}>
            <meshPhysicalMaterial color="#b4a69b" metalness={1} roughness={0.28} clearcoat={0.6} />
          </mesh>
          <mesh geometry={geos.ring} position-y={-CLAMP_H - RING_R} rotation-y={Math.PI / 2}>
            <meshPhysicalMaterial color="#ccc3bc" metalness={1} roughness={0.22} />
          </mesh>
          <group position-y={CARD_Y}>
            <mesh geometry={geos.body}>
              <meshPhysicalMaterial color="#3e2f24" metalness={0.75} roughness={0.32} clearcoat={0.4} clearcoatRoughness={0.3} />
            </mesh>
            <mesh geometry={geos.face} position-z={faceZ}>
              <meshPhysicalMaterial map={front} roughness={0.55} metalness={0.05} clearcoat={0.35} clearcoatRoughness={0.4} />
            </mesh>
            <mesh ref={photoRef} geometry={geos.photoGeo} position-z={faceZ + 0.0035}>
              <meshPhysicalMaterial map={photo} roughness={0.28} metalness={0} clearcoat={1} clearcoatRoughness={0.12} />
            </mesh>
            <mesh geometry={geos.face} position-z={-faceZ} rotation-y={Math.PI}>
              <meshPhysicalMaterial map={back} roughness={0.6} metalness={0.05} clearcoat={0.25} clearcoatRoughness={0.45} />
            </mesh>
          </group>
        </group>
      </group>
      <ContactShadows position={[0, layout.shadowY, 0]} opacity={0.6} scale={7} blur={2.6} far={3.2} resolution={512} color="#000000" />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2.2} color="#ffffff" position={[-3, 3, 4]} scale={[4, 1.4, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1.4} color="#ffb686" position={[4, -1, -3]} scale={[1, 5, 1]} target={[0, 0, 0]} />
        <Lightformer form="ring" intensity={0.6} color="#ffffff" position={[0, 5, -2]} scale={2} target={[0, 0, 0]} />
      </Environment>
    </>
  );
}

export default function IdCardCanvas({ faces, control, introRef, reducedMotion, active, onReady, lowPower, bleedTop = 0.45 }) {
  return (
    <Canvas
      className="card-canvas"
      dpr={lowPower ? [1, 1.25] : [1, 1.75]}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 0, 7], fov: 32, near: 0.1, far: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        onReady?.();
      }}
    >
      <Card faces={faces} control={control} introRef={introRef} reducedMotion={reducedMotion} bleedTop={bleedTop} lowPower={lowPower} />
    </Canvas>
  );
}
