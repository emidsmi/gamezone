"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { MathUtils, Object3D, type Group, type InstancedMesh, type Mesh } from "three";
import { expState } from "../state";
import { Hero, SceneShell, makeTerrain, seeded } from "./shared";

const IDX = 5;
const dummy = new Object3D();

/** Carro de rali: carroceria envernizada, cabine de vidro escuro, aerofólio, faróis e rodas giratórias. */
function Car() {
  const wheels = useRef<Mesh[]>([]);
  const body = useRef<Group>(null);
  useFrame((state, dt) => {
    wheels.current.forEach((w) => w && (w.rotation.x -= dt * 14));
    const o = body.current;
    if (!o) return;
    const t = state.clock.elapsedTime;
    o.position.y = Math.sin(t * 9) * 0.015;
    // derrapagem leve: o carro atravessa de lado conforme a rolagem
    o.rotation.y = MathUtils.lerp(o.rotation.y, 0.5 + Math.sin((expState.pos - IDX) * 3) * 0.12 - expState.px * 0.1, 0.06);
    o.rotation.z = Math.sin(t * 5) * 0.01;
  });
  return (
    <group ref={body}>
      <mesh position={[0, 0.5, 0]} scale={[2.3, 0.5, 1.1]}><boxGeometry args={[1, 1, 1]} /><meshPhysicalMaterial color="#e11d48" metalness={0.65} roughness={0.3} clearcoat={1} clearcoatRoughness={0.1} /></mesh>
      <mesh position={[0.15, 0.9, 0]} scale={[1.2, 0.4, 0.95]}><boxGeometry args={[1, 1, 1]} /><meshPhysicalMaterial color="#0f172a" metalness={0.9} roughness={0.08} clearcoat={1} /></mesh>
      <mesh position={[-1.05, 1.0, 0]} scale={[0.35, 0.05, 1.2]}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="#111827" metalness={0.5} roughness={0.5} /></mesh>
      {[-0.4, 0.4].map((z) => (<mesh key={z} position={[1.17, 0.55, z]}><boxGeometry args={[0.05, 0.12, 0.25]} /><meshStandardMaterial color="#fff7d6" emissive="#fff1b8" emissiveIntensity={3} toneMapped={false} /></mesh>))}
      {[[-0.8, 0.28, 0.6], [0.8, 0.28, 0.6], [-0.8, 0.28, -0.6], [0.8, 0.28, -0.6]].map((p, i) => (
        <mesh key={i} ref={(m) => { if (m) wheels.current[i] = m; }} position={p as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.26, 20]} /><meshStandardMaterial color="#141414" roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

/** Poeira: esferas translúcidas reciclando atrás do carro (instanciadas). */
function DustTrail({ count }: { count: number }) {
  const mesh = useRef<InstancedMesh>(null);
  const seeds = useMemo(() => {
    const r = seeded(9);
    return Array.from({ length: count }, () => ({ o: r(), y: r() * 0.4, z: (r() - 0.5) * 1.4, s: 0.5 + r() }));
  }, [count]);
  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    seeds.forEach((d, i) => {
      const f = (t * 0.7 + d.o) % 1;
      dummy.position.set(-1.4 - f * 4.5, 0.2 + d.y + f * 0.9, d.z * (0.6 + f * 1.4));
      dummy.scale.setScalar((0.25 + f * 0.9) * d.s);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[1, 10, 8]} />
      <meshStandardMaterial color="#e8a56a" transparent opacity={0.28} roughness={1} depthWrite={false} />
    </instancedMesh>
  );
}

/** Cena 6 — Rali das Dunas Vermelhas: dunas procedurais com cristas, sol baixo, carro derrapando e poeira. */
export function RaliScene({ high }: { high: boolean }) {
  const dunes = useMemo(
    () =>
      makeTerrain(60, high ? 120 : 60, (x, z) => {
        const ridge = 1 - Math.abs(Math.sin(x * 0.22 + Math.sin(z * 0.17) * 1.6));
        return Math.pow(ridge, 2.2) * 1.5 + Math.sin(z * 0.12) * 0.4 - 1.4;
      }, (h) => {
        const k = MathUtils.clamp((h + 1.4) / 1.9, 0, 1);
        return [0.45 + k * 0.4, 0.14 + k * 0.17, 0.08 + k * 0.08];
      }),
    [high],
  );
  return (
    <SceneShell index={IDX}>
      <mesh geometry={dunes} position={[0, -0.2, -8]}><meshStandardMaterial vertexColors roughness={1} /></mesh>
      <mesh position={[4, 2.2, -26]}><sphereGeometry args={[3.2, 40, 24]} /><meshBasicMaterial color="#ffb070" toneMapped={false} fog={false} /></mesh>
      <Hero index={IDX}>
        <group position={[0.3, -0.9, -0.5]} scale={0.72}>
          <Car />
          <DustTrail count={high ? 70 : 36} />
        </group>
      </Hero>
    </SceneShell>
  );
}
