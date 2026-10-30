"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, type Points } from "three";
import { expState } from "../state";
import type { Quality } from "../types";
import { Hero, SceneShell, makeTerrain, seeded } from "./shared";

const IDX = 1;

/** Celeiro: corpo, telhado de duas águas, porta, janela acesa e silo. Materiais PBR rugosos. */
function Barn() {
  return (
    <group>
      <mesh position={[0, 0.8, 0]}><boxGeometry args={[2.4, 1.6, 2]} /><meshStandardMaterial color="#b4443a" roughness={0.85} /></mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.62, 1.95, 0]} rotation={[0, 0, -s * 0.66]}><boxGeometry args={[1.75, 0.12, 2.25]} /><meshStandardMaterial color="#6b2a28" roughness={0.8} /></mesh>
      ))}
      <mesh position={[0, 0.6, 1.01]}><boxGeometry args={[0.95, 1.2, 0.05]} /><meshStandardMaterial color="#4a1816" roughness={0.9} /></mesh>
      <mesh position={[0, 0.6, 1.045]} rotation={[0, 0, Math.PI / 4]}><boxGeometry args={[0.06, 1.35, 0.03]} /><meshStandardMaterial color="#e9d9b8" roughness={0.8} /></mesh>
      <mesh position={[0, 0.6, 1.045]} rotation={[0, 0, -Math.PI / 4]}><boxGeometry args={[0.06, 1.35, 0.03]} /><meshStandardMaterial color="#e9d9b8" roughness={0.8} /></mesh>
      <mesh position={[0, 1.55, 1.02]}><boxGeometry args={[0.4, 0.3, 0.04]} /><meshStandardMaterial color="#ffd27a" emissive="#ffb347" emissiveIntensity={2.5} toneMapped={false} /></mesh>
      <pointLight position={[0, 1.4, 1.6]} color="#ffb347" intensity={6} distance={5} />
      <mesh position={[1.9, 1.1, -0.2]}><cylinderGeometry args={[0.5, 0.5, 2.2, 24]} /><meshStandardMaterial color="#cbd5e1" metalness={0.6} roughness={0.45} /></mesh>
      <mesh position={[1.9, 2.3, -0.2]}><sphereGeometry args={[0.5, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.35} /></mesh>
    </group>
  );
}

/** Vagalumes: pontos aditivos que flutuam em órbitas lentas. CPU, no máximo ~150 pontos. */
function Fireflies({ count, seed, spread, color }: { count: number; seed: number; spread: [number, number, number]; color: string }) {
  const pts = useRef<Points>(null);
  const base = useMemo(() => {
    const rnd = seeded(seed);
    return Array.from({ length: count }, () => ({ x: (rnd() - 0.5) * spread[0], y: rnd() * spread[1], z: (rnd() - 0.5) * spread[2], p: rnd() * 6.28, s: 0.3 + rnd() * 0.7 }));
  }, [count, seed, spread]);
  const positions = useMemo(() => new Float32Array(count * 3), [count]);
  useFrame((state) => {
    const p = pts.current;
    if (!p) return;
    const t = state.clock.elapsedTime;
    base.forEach((b, i) => {
      positions[i * 3] = b.x + Math.sin(t * b.s + b.p) * 0.4;
      positions[i * 3 + 1] = b.y + Math.sin(t * b.s * 1.3 + b.p) * 0.25;
      positions[i * 3 + 2] = b.z + Math.cos(t * b.s + b.p) * 0.4;
    });
    p.geometry.attributes.position.needsUpdate = true;
  });
  return (
    <points ref={pts} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.07} sizeAttenuation transparent opacity={0.95} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
    </points>
  );
}

/** Cena 2 — Fazenda Lua Nova: colinas, celeiro, lua enorme ao fundo, cerca e vagalumes. */
export function FazendaScene({ quality }: { quality: Quality }) {
  const terrain = useMemo(
    () =>
      makeTerrain(46, quality === "high" ? 90 : 48, (x, z) => {
        const d = Math.hypot(x, z + 2);
        const flat = Math.min(1, Math.max(0, (d - 3.5) / 5));
        return (Math.sin(x * 0.35) * Math.cos(z * 0.3) * 1.1 + Math.sin(x * 0.12 + z * 0.2) * 1.6) * flat - 1.5 - (1 - flat) * 0.02;
      }, (h) => {
        const k = Math.min(1, Math.max(0, (h + 1.5) / 3));
        return [0.07 + k * 0.1, 0.18 + k * 0.14, 0.11 + k * 0.05];
      }),
    [quality],
  );
  const fence = useMemo(() => Array.from({ length: 9 }, (_, i) => -4.5 + i * 1.1), []);
  const moon = useRef<import("three").Mesh>(null);
  useFrame(() => {
    // a lua "sobe" devagar conforme a rolagem avança dentro do jogo
    if (moon.current) moon.current.position.y = 3.2 + (expState.pos - IDX) * 1.4;
  });
  return (
    <SceneShell index={IDX}>
      <mesh geometry={terrain} position={[0, -0.2, -3]}><meshStandardMaterial vertexColors roughness={1} flatShading /></mesh>
      <mesh ref={moon} position={[-3, 3.2, -16]}>
        <sphereGeometry args={[4.2, 48, 32]} />
        <meshStandardMaterial color="#fff3c4" emissive="#ffe9a8" emissiveIntensity={1.6} roughness={1} toneMapped={false} />
      </mesh>
      <group position={[0, -0.75, 0]}>
        {fence.map((x) => (
          <group key={x} position={[x, 0, 2.6]}>
            <mesh position={[0, 0.35, 0]}><boxGeometry args={[0.1, 0.7, 0.1]} /><meshStandardMaterial color="#5b3a22" roughness={0.9} /></mesh>
            <mesh position={[0.55, 0.45, 0]}><boxGeometry args={[1.1, 0.07, 0.05]} /><meshStandardMaterial color="#6b4a2e" roughness={0.9} /></mesh>
          </group>
        ))}
      </group>
      <Hero index={IDX}>
        <group position={[0.3, -0.9, -0.5]} scale={0.72}><Barn /></group>
      </Hero>
      <Fireflies count={quality === "high" ? 140 : 60} seed={11} spread={[14, 3, 8]} color="#bef264" />
    </SceneShell>
  );
}
