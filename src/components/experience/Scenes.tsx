"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, MathUtils, type DirectionalLight, type Fog, type Group } from "three";
import { FEATURED, type SceneKey } from "@/config/featured";
import { expState } from "./state";

/* ---------- objetos-herói (Fase 2: versões simples; as cenas finais substituem uma a uma) ---------- */
const Ufo = () => (
  <group>
    <mesh scale={[1.7, 0.4, 1.7]}><sphereGeometry args={[1, 48, 32]} /><meshPhysicalMaterial color="#7c3aed" metalness={0.9} roughness={0.28} clearcoat={1} /></mesh>
    <mesh position={[0, 0.25, 0]}><sphereGeometry args={[0.6, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshPhysicalMaterial color="#a5f3fc" roughness={0.05} metalness={0} transparent opacity={0.7} /></mesh>
    {[-0.9, 0.9].map((x) => (<mesh key={x} position={[x, -0.1, -0.9]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.16, 0.2, 0.5, 20]} /><meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={3} /></mesh>))}
  </group>
);
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

const HEROES: Record<SceneKey, () => React.JSX.Element> = { ufo: Ufo, barn: Barn, boat: Boat, mirror: Mirror, moon: Moon, car: Car };

const smooth = (t: number) => t * t * (3 - 2 * t);

/** Palco: troca de objeto, fundo, névoa e luz conforme `expState.pos`, com reação suave ao mouse. */
export function SceneRig({ quality }: { quality: "high" | "low" }) {
  const groups = useRef<(Group | null)[]>([]);
  const light = useRef<DirectionalLight>(null);
  const themes = useMemo(() => FEATURED.map((f) => ({ bg: new Color(f.theme.bg), fog: new Color(f.theme.fog), accent: new Color(f.theme.accent) })), []);
  const tmp = useMemo(() => new Color(), []);

  useFrame((state, dt) => {
    const pos = expState.pos;
    const i0 = MathUtils.clamp(Math.floor(pos), 0, FEATURED.length - 1);
    const i1 = Math.min(i0 + 1, FEATURED.length - 1);
    const f = i0 === i1 ? 0 : smooth(MathUtils.clamp((pos - i0 - 0.5) / 0.5, 0, 1));

    (state.scene.background as Color).copy(tmp.copy(themes[i0].bg).lerp(themes[i1].bg, f));
    (state.scene.fog as Fog).color.copy(tmp.copy(themes[i0].fog).lerp(themes[i1].fog, f));
    light.current?.color.copy(tmp.copy(themes[i0].accent).lerp(themes[i1].accent, f));

    groups.current.forEach((g, i) => {
      if (!g) return;
      const d = Math.abs(pos - (i + 0.5));
      const w = smooth(MathUtils.clamp((0.7 - d) / 0.5, 0, 1));
      g.visible = w > 0.01;
      g.scale.setScalar(0.35 + 0.65 * w);
      g.position.y = (pos - (i + 0.5)) * 2.6 - 0.15;
      g.rotation.y = state.clock.elapsedTime * 0.3 + expState.px * 0.6;
      g.rotation.x = MathUtils.lerp(g.rotation.x, -expState.py * 0.18, 0.08);
    });

    state.camera.position.x = MathUtils.lerp(state.camera.position.x, expState.px * 0.45, 0.06);
    state.camera.position.y = MathUtils.lerp(state.camera.position.y, 0.3 + expState.py * 0.25, 0.06);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={quality === "high" ? 0.25 : 0.5} />
      <directionalLight ref={light} position={[3, 4, 5]} intensity={2.2} />
      {FEATURED.map((cfg, i) => {
        const Hero = HEROES[cfg.scene];
        return (
          <group key={cfg.slug} ref={(el) => { groups.current[i] = el; }} visible={i === 0}>
            <Hero />
          </group>
        );
      })}
    </>
  );
}
