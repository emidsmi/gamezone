"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, ExtrudeGeometry, Object3D, Shape, type InstancedMesh, type Points } from "three";
import { Hero, SceneShell, makeTerrain, seeded } from "./shared";

const IDX = 4;
const dummy = new Object3D();

/** Lua crescente: duas circunferências (externa menos interna) extrudadas. */
function crescent() {
  const R = 1, d = 0.5, r = 0.85;
  const x = (R * R - r * r + d * d) / (2 * d);
  const y = Math.sqrt(R * R - x * x);
  const th = Math.atan2(y, x);
  const ph = Math.atan2(y, x - d);
  const s = new Shape();
  s.absarc(0, 0, R, th, Math.PI * 2 - th, false);
  s.absarc(d, 0, r, -ph, ph, true);
  return new ExtrudeGeometry(s, { depth: 0.25, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 3, curveSegments: 48 });
}

/** Vagalumes: 600 (alta) / 240 (baixa), posições recalculadas por frame com seno; um único draw call. */
function Swarm({ count }: { count: number }) {
  const pts = useRef<Points>(null);
  const base = useMemo(() => {
    const r = seeded(77);
    return Array.from({ length: count }, () => ({ x: (r() - 0.5) * 16, y: r() * 3.6 - 1.2, z: -r() * 10 + 1.5, p: r() * 6.28, s: 0.2 + r() * 0.6 }));
  }, [count]);
  const positions = useMemo(() => new Float32Array(count * 3), [count]);
  useFrame((state) => {
    const p = pts.current;
    if (!p) return;
    const t = state.clock.elapsedTime;
    base.forEach((b, i) => {
      positions[i * 3] = b.x + Math.sin(t * b.s + b.p) * 0.5;
      positions[i * 3 + 1] = b.y + Math.sin(t * b.s * 1.4 + b.p) * 0.35;
      positions[i * 3 + 2] = b.z + Math.cos(t * b.s * 0.9 + b.p) * 0.5;
    });
    p.geometry.attributes.position.needsUpdate = true;
  });
  return (
    <points ref={pts} frustumCulled={false}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial color="#d9f99d" size={0.075} sizeAttenuation transparent opacity={0.95} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
    </points>
  );
}

/** Árvores: cones empilhados instanciados (2 draw calls para ~36 árvores). */
function Forest({ trees }: { trees: number }) {
  const items = useMemo(() => {
    const r = seeded(5);
    return Array.from({ length: trees }, () => {
      const side = r() < 0.5 ? -1 : 1;
      return { x: side * (2.6 + r() * 9), z: -1 - r() * 14, s: 0.7 + r() * 0.9 };
    });
  }, [trees]);
  const ref = (kind: "low" | "top") => (m: InstancedMesh | null) => {
    if (!m) return;
    items.forEach((it, i) => {
      dummy.position.set(it.x, -1.4 + (kind === "low" ? 1.0 : 1.9) * it.s, it.z);
      dummy.scale.setScalar(it.s * (kind === "low" ? 1 : 0.7));
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  };
  return (
    <>
      <instancedMesh ref={ref("low")} args={[undefined, undefined, trees]}>
        <coneGeometry args={[0.9, 2, 7]} /><meshStandardMaterial color="#0e2a24" roughness={1} />
      </instancedMesh>
      <instancedMesh ref={ref("top")} args={[undefined, undefined, trees]}>
        <coneGeometry args={[0.9, 2, 7]} /><meshStandardMaterial color="#133a31" roughness={1} />
      </instancedMesh>
    </>
  );
}

/** Cena 5 — A Trilha dos Vagalumes: lua crescente, floresta, trilha e enxame de vagalumes. */
export function VagalumesScene({ high }: { high: boolean }) {
  const moon = useMemo(() => crescent(), []);
  const ground = useMemo(
    () => makeTerrain(40, 40, (x, z) => Math.sin(x * 0.4) * Math.cos(z * 0.3) * 0.25 - 1.5 - Math.max(0, 1 - Math.abs(x) / 1.4) * 0.12, (h, x) => (Math.abs(x) < 1.2 ? [0.2, 0.17, 0.1] : [0.04, 0.12 + h * 0.01, 0.1])),
    [],
  );
  return (
    <SceneShell index={IDX}>
      <mesh geometry={ground} position={[0, 0, -4]}><meshStandardMaterial vertexColors roughness={1} /></mesh>
      <Forest trees={high ? 40 : 22} />
      <Hero index={IDX}>
        <group position={[-1.4, 1.5, -4]} rotation={[0, 0.2, 0.35]} scale={1.25}>
          <mesh geometry={moon}><meshStandardMaterial color="#fef9c3" emissive="#fff2a8" emissiveIntensity={0.9} roughness={0.9} toneMapped={false} /></mesh>
        </group>
        <pointLight position={[-1.2, 2.2, -1]} color="#bef264" intensity={14} distance={9} />
      </Hero>
      <Swarm count={high ? 600 : 240} />
    </SceneShell>
  );
}
