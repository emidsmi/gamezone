"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, type Points, type SpotLight } from "three";
import { expState } from "../state";
import { Hero, SceneShell, seeded } from "./shared";

const IDX = 3;

/** Moldura oval dourada + vidro espelhado. O reflexo vem do ambiente procedural (Environment) e do spot que segue o mouse. */
function Mirror() {
  return (
    <group>
      <mesh scale={[0.85, 1.2, 0.35]}><torusGeometry args={[1, 0.16, 28, 96]} /><meshStandardMaterial color="#b08a3e" metalness={1} roughness={0.32} envMapIntensity={1.4} /></mesh>
      <mesh scale={[0.84, 1.19, 1]} position={[0, 0, -0.02]}><circleGeometry args={[1, 96]} /><meshPhysicalMaterial color="#c9d6dd" emissive="#3b4f60" emissiveIntensity={0.9} metalness={0.9} roughness={0.05} clearcoat={1} envMapIntensity={2.2} /></mesh>
      <mesh position={[0, -1.55, -0.1]} scale={[0.5, 0.35, 0.2]}><cylinderGeometry args={[1, 1.3, 1, 24]} /><meshStandardMaterial color="#6e5226" metalness={0.9} roughness={0.4} /></mesh>
    </group>
  );
}

/** Poeira flutuando no feixe de luz. */
function Dust({ count }: { count: number }) {
  const pts = useRef<Points>(null);
  const base = useMemo(() => {
    const r = seeded(31);
    return Array.from({ length: count }, () => ({ x: (r() - 0.5) * 8, y: r() * 5 - 1.5, z: (r() - 0.5) * 6, s: 0.1 + r() * 0.2, p: r() * 6.28 }));
  }, [count]);
  const positions = useMemo(() => new Float32Array(count * 3), [count]);
  useFrame((state) => {
    const p = pts.current;
    if (!p) return;
    const t = state.clock.elapsedTime;
    base.forEach((b, i) => {
      positions[i * 3] = b.x + Math.sin(t * b.s + b.p) * 0.3;
      positions[i * 3 + 1] = b.y + ((t * b.s * 0.6) % 5) - 0;
      positions[i * 3 + 2] = b.z;
      if (positions[i * 3 + 1] > 3.5) positions[i * 3 + 1] -= 5;
    });
    p.geometry.attributes.position.needsUpdate = true;
  });
  return (
    <points ref={pts} frustumCulled={false}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial color="#e8d9b0" size={0.03} sizeAttenuation transparent opacity={0.7} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
    </points>
  );
}

/** Cena 4 — Casa dos Espelhos Cegos: espelho oval num salão escuro; um spot persegue o cursor. */
export function EspelhosScene({ high }: { high: boolean }) {
  const spot = useRef<SpotLight>(null);
  useFrame(() => {
    const s = spot.current;
    if (!s) return;
    s.position.x += (expState.px * 3.2 - s.position.x) * 0.08;
    s.position.y += (2.6 + expState.py * 1.6 - s.position.y) * 0.08;
    s.target.position.set(0, 0, 0);
    s.target.updateMatrixWorld();
  });
  return (
    <SceneShell index={IDX}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.7, -1]}><planeGeometry args={[30, 30]} /><meshStandardMaterial color="#1a1620" metalness={0.5} roughness={0.28} envMapIntensity={0.6} /></mesh>
      <mesh position={[0, 1, -5]}><planeGeometry args={[30, 14]} /><meshStandardMaterial color="#17131c" roughness={0.9} /></mesh>
      <spotLight ref={spot} position={[0, 2.6, 5]} angle={0.42} penumbra={0.85} intensity={high ? 120 : 80} distance={16} color="#f0e6d0" />
      <Hero index={IDX}><Mirror /></Hero>
      <Dust count={high ? 160 : 70} />
    </SceneShell>
  );
}
