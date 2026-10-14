// The signature WebGL scene: a modelled identity card with real thickness,
// a raised photo laminate, controlled key/rim lighting and contact shadows.
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

function Card({ faces, control, introRef, reducedMotion }) {
  const group = useRef();
  const sweep = useRef();
  const key = useRef();
  const glint = useRef();
  const { gl, viewport } = useThree();
  const aniso = Math.min(8, gl.capabilities.getMaxAnisotropy());
  const front = useCanvasTexture(faces.front, aniso);
  const back = useCanvasTexture(faces.back, aniso);
  const photo = useCanvasTexture(faces.photo, aniso);

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
    return { body, face, photoGeo };
  }, []);
  useEffect(() => () => Object.values(geos).forEach((g) => g.dispose()), [geos]);

  const faceZ = DEPTH / 2 + BEVEL + 0.0006;
  const springs = useRef({ rx: { x: 0, v: 0 }, ry: { x: 0, v: 0 }, y: { x: 0, v: 0 } }).current;
  // the canvas bleeds 40% past the stage on each side, so fit the card to the stage's share of it
  const scale = Math.min(1, viewport.height / 4.8, viewport.width / 1.8 / 2.2);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const t = state.clock.elapsedTime;
    const c = control.current;
    // intro progress 0..1
    let p = 1;
    if (!reducedMotion && !introRef.current.done) {
      introRef.current.t += dt / 1.7;
      p = Math.min(1, introRef.current.t);
      if (p >= 1) introRef.current.done = true;
    }
    const e = 1 - Math.pow(1 - p, 3);
    const idle = reducedMotion || c.dragging || c.hovering ? 0 : 1;
    const tx = c.base.rx + c.tilt.rx + (1 - e) * 0.32;
    const ty = c.base.ry + c.tilt.ry + (1 - e) * -1.15 + idle * Math.sin(t * 0.35) * 0.05;
    const tyPos = (1 - e) * -0.55 + idle * Math.sin(t * 0.6) * 0.025;
    if (c.dragging) {
      springs.ry.x = ty;
      springs.ry.v = 0;
    } else spring(springs.ry, ty, dt);
    spring(springs.rx, tx, dt);
    spring(springs.y, tyPos, dt, 60, 13);
    const g = group.current;
    g.rotation.set(springs.rx.x, springs.ry.x, 0);
    g.position.y = springs.y.x;
    g.scale.setScalar(scale * (0.94 + 0.06 * e));
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
      <directionalLight position={[4, 2, -4]} intensity={2.2} color="#9fb4ff" />
      <spotLight ref={sweep} position={[-5, 0.5, 3]} angle={0.12} penumbra={0.6} intensity={0} color="#ffffff" distance={12} />
      <pointLight ref={glint} position={[0, 0, 2]} intensity={0} distance={6} decay={2} color="#dfe6ff" />
      <group ref={group}>
        <mesh geometry={geos.body}>
          <meshPhysicalMaterial color="#20232b" metalness={0.75} roughness={0.32} clearcoat={0.4} clearcoatRoughness={0.3} />
        </mesh>
        <mesh geometry={geos.face} position-z={faceZ}>
          <meshPhysicalMaterial map={front} roughness={0.55} metalness={0.05} clearcoat={0.35} clearcoatRoughness={0.4} />
        </mesh>
        <mesh geometry={geos.photoGeo} position-z={faceZ + 0.0035}>
          <meshPhysicalMaterial map={photo} roughness={0.28} metalness={0} clearcoat={1} clearcoatRoughness={0.12} />
        </mesh>
        <mesh geometry={geos.face} position-z={-faceZ} rotation-y={Math.PI}>
          <meshPhysicalMaterial map={back} roughness={0.6} metalness={0.05} clearcoat={0.25} clearcoatRoughness={0.45} />
        </mesh>
      </group>
      <ContactShadows position={[0, -1.75, 0]} opacity={0.6} scale={7} blur={2.6} far={3.2} resolution={512} color="#000000" />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2.2} color="#ffffff" position={[-3, 3, 4]} scale={[4, 1.4, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1.4} color="#8ea6ff" position={[4, -1, -3]} scale={[1, 5, 1]} target={[0, 0, 0]} />
        <Lightformer form="ring" intensity={0.6} color="#ffffff" position={[0, 5, -2]} scale={2} target={[0, 0, 0]} />
      </Environment>
    </>
  );
}

export default function IdCardCanvas({ faces, control, introRef, reducedMotion, active, onReady, lowPower }) {
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
      <Card faces={faces} control={control} introRef={introRef} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
