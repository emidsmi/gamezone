"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, MathUtils, Vector3, type DirectionalLight, type Fog, type Group, type PerspectiveCamera } from "three";
import { FEATURED, type SceneKey } from "@/config/featured";
import { GravitronScene } from "./scenes/Gravitron";
import { expState } from "./state";
import type { Quality } from "./types";

/* ---------- objetos-herói provisórios (Fase 3: só o Gravitron é final; os demais serão substituídos na Fase 4) ---------- */
const Barn = () => (
  <group>
    <mesh position={[0, 0.8, 0]}><boxGeometry args={[2.4, 1.6, 2]} /><meshStandardMaterial color="#b4443a" roughness={0.85} /></mesh>
    {[-1, 1].map((s) => (<mesh key={s} position={[s * 0.62, 1.95, 0]} rotation={[0, 0, -s * 0.66]}><boxGeometry args={[1.7, 0.12, 2.2]} /><meshStandardMaterial color="#7a2e2a" roughness={0.8} /></mesh>))}
    <mesh position={[0, 0.55, 1.01]}><boxGeometry args={[0.9, 1.1, 0.05]} /><meshStandardMaterial color="#5a1d1a" roughness={0.9} /></mesh>
    <mesh position={[2.2, 2.4, -2]}><sphereGeometry args={[1.1, 48, 32]} /><meshStandardMaterial color="#fff3c4" emissive="#fff3c4" emissiveIntensity={1.2} /></mesh>
  </group>
);
const Boat = () => (
  <group>
    <mesh position={[0, 0.1, 0]} scale={[2.4, 0.5, 0.9]}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="#6b4226" roughness={0.7} /></mesh>
    <mesh position={[1.3, 0.1, 0]} rotation={[0, 0, -Math.PI / 2]}><coneGeometry args={[0.45, 0.6, 4]} /><meshStandardMaterial color="#6b4226" roughness={0.7} /></mesh>
    <mesh position={[0, 1.4, 0]}><cylinderGeometry args={[0.05, 0.05, 2.6, 12]} /><meshStandardMaterial color="#4a2d18" roughness={0.8} /></mesh>
    <mesh position={[0.2, 1.4, 0]}><planeGeometry args={[1.6, 1.9]} /><meshStandardMaterial color="#f4ead2" side={2} roughness={0.9} /></mesh>
  </group>
);
const Mirror = () => (
  <group>
    <mesh scale={[0.8, 1.15, 0.3]}><torusGeometry args={[1, 0.14, 24, 64]} /><meshStandardMaterial color="#8a6a2f" metalness={1} roughness={0.4} /></mesh>
    <mesh scale={[0.78, 1.12, 1]} position={[0, 0, -0.02]}><circleGeometry args={[1, 64]} /><meshStandardMaterial color="#a8c7d8" metalness={1} roughness={0.04} /></mesh>
  </group>
);
const Moon = () => (
  <group>
    <mesh><sphereGeometry args={[1.2, 48, 32]} /><meshStandardMaterial color="#fef9c3" emissive="#fef9c3" emissiveIntensity={1.1} roughness={0.9} /></mesh>
    {[[1.6, 0.8, 0.5], [-1.5, -0.6, 0.8], [0.4, -1.5, 0.6], [-0.8, 1.5, 0.4]].map((p, i) => (<mesh key={i} position={p as [number, number, number]}><sphereGeometry args={[0.07, 12, 12]} /><meshStandardMaterial color="#bef264" emissive="#bef264" emissiveIntensity={4} /></mesh>))}
  </group>
);
const Car = () => (
  <group>
    <mesh position={[0, 0.45, 0]} scale={[2.2, 0.55, 1.05]}><boxGeometry args={[1, 1, 1]} /><meshPhysicalMaterial color="#e11d48" metalness={0.6} roughness={0.35} clearcoat={1} clearcoatRoughness={0.15} /></mesh>
    <mesh position={[-0.1, 0.95, 0]} scale={[1.2, 0.45, 0.9]}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} /></mesh>
    {[[-0.75, 0.2, 0.55], [0.75, 0.2, 0.55], [-0.75, 0.2, -0.55], [0.75, 0.2, -0.55]].map((p, i) => (<mesh key={i} position={p as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.28, 0.28, 0.25, 24]} /><meshStandardMaterial color="#111" roughness={0.95} /></mesh>))}
  </group>
);

const PLACEHOLDERS: Partial<Record<SceneKey, () => React.JSX.Element>> = { barn: Barn, boat: Boat, mirror: Mirror, moon: Moon, car: Car };

/** Cena provisória: objeto simples que entra/sai conforme o peso da cena. */
function PlaceholderScene({ index, scene }: { index: number; scene: SceneKey }) {
  const g = useRef<Group>(null);
  const Hero = PLACEHOLDERS[scene]!;
  useFrame((state) => {
    const o = g.current;
    if (!o) return;
    const w = expState.w[index];
    o.visible = w > 0.01;
    o.scale.setScalar(0.35 + 0.65 * w);
    o.position.y = (expState.pos - (index + 0.5)) * 2.6 - 0.15;
    o.rotation.y = state.clock.elapsedTime * 0.3 + expState.px * 0.6;
    o.rotation.x = MathUtils.lerp(o.rotation.x, -expState.py * 0.18, 0.08);
  });
  return (
    <group ref={g} visible={false}>
      <Hero />
    </group>
  );
}

/* ---------- câmera: posição/fov/alvo na entrada e na saída de cada jogo ---------- */
type CamKey = { pos: [number, number, number]; fov: number; look: [number, number, number] };
const DEFAULT_IN: CamKey = { pos: [0, 0.3, 6.2], fov: 42, look: [0, 0, 0] };
const DEFAULT_OUT: CamKey = { pos: [0.3, 0.3, 5.6], fov: 42, look: [0, 0, 0] };
const CAMS: { in: CamKey; out: CamKey }[] = [
  // Gravitron GP: entra de trás e de cima, mergulha para o lado e se aproxima (FOV 55 -> 40)
  { in: { pos: [0, 1.6, 6], fov: 55, look: [0, 0, 0] }, out: { pos: [-1.2, 0.8, 4.2], fov: 40, look: [0, -0.1, -0.5] } },
  ...FEATURED.slice(1).map(() => ({ in: DEFAULT_IN, out: DEFAULT_OUT })),
];

const smooth = (t: number) => t * t * (3 - 2 * t);
const V = { a: new Vector3(), b: new Vector3(), look: new Vector3() };

/** Palco: calcula o peso de cada cena, mistura fundo/névoa/luz/câmera conforme `expState.pos` e reage ao mouse. */
export function SceneRig({ quality }: { quality: Quality }) {
  const light = useRef<DirectionalLight>(null);
  const themes = useMemo(() => FEATURED.map((f) => ({ bg: new Color(f.theme.bg), fog: new Color(f.theme.fog), accent: new Color(f.theme.accent) })), []);
  const tmp = useMemo(() => new Color(), []);

  useFrame((state) => {
    const pos = expState.pos;
    const last = FEATURED.length - 1;
    const i0 = MathUtils.clamp(Math.floor(pos), 0, last);
    const i1 = Math.min(i0 + 1, last);
    const p = pos - i0;
    const f = i0 === i1 ? 0 : smooth(MathUtils.clamp((p - 0.5) / 0.5, 0, 1));

    // peso de cada cena (1 = visível; as vizinhas se sobrepõem na transição)
    for (let i = 0; i <= last; i++) expState.w[i] = smooth(MathUtils.clamp((0.7 - Math.abs(pos - (i + 0.5))) / 0.5, 0, 1));

    (state.scene.background as Color).copy(tmp.copy(themes[i0].bg).lerp(themes[i1].bg, f));
    (state.scene.fog as Fog).color.copy(tmp.copy(themes[i0].fog).lerp(themes[i1].fog, f));
    light.current?.color.copy(tmp.copy(themes[i0].accent).lerp(themes[i1].accent, f));

    // flash de luz branco-azulado na transição Gravitron -> Fazenda (cobre a troca de cena)
    const flash = smooth(MathUtils.clamp(1 - Math.abs(pos - 1) / 0.14, 0, 1));
    state.gl.toneMappingExposure = 1 + 0.9 * flash;

    // câmera: entrada -> saída durante o jogo; nos últimos 30% caminha até a entrada do próximo
    const camIn = CAMS[i0].in, camOut = CAMS[i0].out;
    let t: number, from = camIn, to = camOut;
    if (p < 0.7) t = smooth(p / 0.7);
    else { from = camOut; to = CAMS[i1].in; t = i0 === i1 ? 0 : smooth((p - 0.7) / 0.3); }
    V.a.set(...from.pos).lerp(V.b.set(...to.pos), t);
    V.look.set(...from.look).lerp(V.b.set(...to.look), t);
    const cam = state.camera as PerspectiveCamera;
    cam.position.x = MathUtils.lerp(cam.position.x, V.a.x + expState.px * 0.45, 0.08);
    cam.position.y = MathUtils.lerp(cam.position.y, V.a.y + expState.py * 0.25, 0.08);
    cam.position.z = MathUtils.lerp(cam.position.z, V.a.z, 0.08);
    const fov = MathUtils.lerp(cam.fov, MathUtils.lerp(from.fov, to.fov, t), 0.08);
    if (Math.abs(fov - cam.fov) > 0.001) { cam.fov = fov; cam.updateProjectionMatrix(); }
    cam.lookAt(V.look);
  });

  return (
    <>
      <ambientLight intensity={quality === "high" ? 0.25 : 0.5} />
      <directionalLight ref={light} position={[3, 4, 5]} intensity={2.2} />
      <GravitronScene quality={quality} />
      {FEATURED.slice(1).map((cfg, k) => (
        <PlaceholderScene key={cfg.slug} index={k + 1} scene={cfg.scene} />
      ))}
    </>
  );
}
