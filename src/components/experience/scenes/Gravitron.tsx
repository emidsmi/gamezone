"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, DoubleSide, MathUtils, Object3D, type Group, type InstancedMesh, type ShaderMaterial } from "three";
import { expState } from "../state";
import type { Quality } from "../types";

/**
 * Cena 1 — Gravitron GP. Tudo procedural (sem arquivos externos):
 *  - nave: elipsoide metálico + aro, cabine de vidro, aletas e dois propulsores emissivos (alimentam o bloom);
 *  - pista antigravidade: plano com shader de listras que rolam, faixas laterais emissivas e fade por distância;
 *  - riscos de velocidade: InstancedMesh reciclado em Z; esticam e aceleram com o progresso da rolagem;
 *  - rastro dos propulsores: esferas instanciadas que encolhem.
 * Orçamento: ~12k triângulos, 1 draw call de riscos, 2 de rastro.
 */
const IDX = 0;
const CYAN = new Color("#22d3ee");
const MAGENTA = new Color("#ff4fa3");
const dummy = new Object3D();

/** PRNG determinístico (mulberry32): mantém o render puro. */
function seeded(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const trackVertex = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const trackFragment = /* glsl */ `
  uniform float uTime; uniform float uSpeed; uniform float uAlpha;
  uniform vec3 uCyan; uniform vec3 uMagenta;
  varying vec2 vUv;
  void main() {
    float along = vUv.y * 60.0 - uTime * uSpeed;
    float f = fract(along);
    float stripe = smoothstep(0.0, 0.05, f) * (1.0 - smoothstep(0.08, 0.14, f));
    float edge = abs(vUv.x - 0.5) * 2.0;
    float rail = smoothstep(0.82, 0.88, edge) * (1.0 - smoothstep(0.94, 1.0, edge));
    float lane = (1.0 - smoothstep(0.0, 0.02, abs(edge - 0.33))) * 0.35 * step(0.5, fract(along * 0.5));
    vec3 col = vec3(0.045, 0.02, 0.12)
      + uCyan * stripe * 0.35 * (1.0 - edge * 0.4)
      + mix(uCyan, uMagenta, step(0.5, vUv.x)) * rail * 1.6
      + uMagenta * lane;
    float fade = smoothstep(0.0, 0.35, 1.0 - vUv.y) * smoothstep(0.0, 0.08, vUv.y);
    gl_FragColor = vec4(col, fade * uAlpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function Track() {
  const mat = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uSpeed: { value: 1 }, uAlpha: { value: 0 }, uCyan: { value: CYAN }, uMagenta: { value: MAGENTA } }), []);
  useFrame((_, dt) => {
    const m = mat.current;
    if (!m) return;
    const p = MathUtils.clamp(expState.pos - IDX, 0, 1);
    m.uniforms.uTime.value += dt;
    m.uniforms.uSpeed.value = MathUtils.lerp(m.uniforms.uSpeed.value, 1.2 + p * 5, 0.05);
    m.uniforms.uAlpha.value = expState.w[IDX];
  });
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, -26]}>
      <planeGeometry args={[9, 60, 1, 1]} />
      <shaderMaterial ref={mat} uniforms={uniforms} vertexShader={trackVertex} fragmentShader={trackFragment} transparent depthWrite={false} side={DoubleSide} />
    </mesh>
  );
}

function Streaks({ count }: { count: number }) {
  const mesh = useRef<InstancedMesh>(null);
  const data = useMemo(
    () => {
      const rnd = seeded(7);
      return Array.from({ length: count }, (_, i) => ({ x: (rnd() - 0.5) * 12, y: -1.2 + rnd() * 4.6, z: -30 + rnd() * 36, s: 0.6 + rnd() * 0.8, c: i % 3 === 0 ? MAGENTA : CYAN }));
    },
    [count],
  );
  useFrame((_, dt) => {
    const m = mesh.current;
    if (!m) return;
    const p = MathUtils.clamp(expState.pos - IDX, 0, 1);
    const w = expState.w[IDX];
    m.visible = w > 0.01;
    if (!m.visible) return;
    const speed = (6 + p * 26) * (0.4 + 0.6 * w);
    const stretch = 1 + p * 4;
    data.forEach((d, i) => {
      d.z += speed * d.s * dt;
      if (d.z > 6) { d.z = -30; d.x = (Math.random() - 0.5) * 12; }
      dummy.position.set(d.x, d.y, d.z);
      dummy.scale.set(1, 1, stretch * d.s * 1.6);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      m.setColorAt(i, d.c);
    });
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[0.018, 0.018, 1]} />
      <meshBasicMaterial toneMapped={false} transparent opacity={0.85} />
    </instancedMesh>
  );
}

function Trail({ side }: { side: 1 | -1 }) {
  const mesh = useRef<InstancedMesh>(null);
  const N = 36;
  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    for (let k = 0; k < N; k++) {
      const f = k / N;
      dummy.position.set(Math.sin(t * 9 + k) * 0.015 * f, Math.cos(t * 7 + k) * 0.015 * f, -0.2 - f * 3.2);
      dummy.scale.setScalar((1 - f) * (0.14 + 0.03 * Math.sin(t * 30 + k)));
      dummy.updateMatrix();
      m.setMatrixAt(k, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });
  return (
    <group position={[side * 0.9, -0.1, -0.95]}>
      <instancedMesh ref={mesh} args={[undefined, undefined, N]} frustumCulled={false}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#22d3ee" toneMapped={false} transparent opacity={0.55} />
      </instancedMesh>
    </group>
  );
}

function Ufo() {
  const g = useRef<Group>(null);
  const roll = useRef(0);
  useFrame((state) => {
    const o = g.current;
    if (!o) return;
    const t = state.clock.elapsedTime;
    // roll acompanha a velocidade/direção da rolagem; o mouse desvia a nave (até 0,4 un) e gira até ~6°
    expState.vel *= 0.92;
    roll.current = MathUtils.lerp(roll.current, MathUtils.clamp(-expState.vel * 0.0018, -0.21, 0.21), 0.08);
    o.rotation.z = roll.current - expState.px * 0.06;
    o.rotation.y = MathUtils.lerp(o.rotation.y, expState.px * 0.1 + Math.sin(t * 0.5) * 0.05, 0.08);
    o.rotation.x = MathUtils.lerp(o.rotation.x, expState.py * 0.08, 0.08);
    o.position.x = MathUtils.lerp(o.position.x, expState.px * 0.4, 0.08);
    o.position.y = MathUtils.lerp(o.position.y, Math.sin(t * 1.6) * 0.06 - expState.py * 0.25, 0.1);
  });
  return (
    <group ref={g}>
      {/* casco: elipsoide metálico com verniz */}
      <mesh scale={[1.6, 0.35, 1.2]}>
        <sphereGeometry args={[1, 64, 40]} />
        <meshPhysicalMaterial color="#7c3aed" metalness={0.9} roughness={0.28} clearcoat={1} clearcoatRoughness={0.12} />
      </mesh>
      {/* aro metálico claro */}
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1.62, 1.22, 1]}>
        <torusGeometry args={[1, 0.035, 16, 96]} />
        <meshStandardMaterial color="#cbd5e1" metalness={1} roughness={0.2} />
      </mesh>
      {/* cabine de vidro */}
      <mesh position={[0, 0.2, 0.05]}>
        <sphereGeometry args={[0.52, 40, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial color="#a5f3fc" metalness={0} roughness={0.04} transparent opacity={0.62} clearcoat={1} envMapIntensity={1.6} />
      </mesh>
      <mesh position={[0, 0.27, 0.05]} scale={[0.7, 0.7, 0.7]}>
        <sphereGeometry args={[0.22, 20, 16]} />
        <meshStandardMaterial color="#0f172a" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* aletas */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 1.15, 0.05, -0.55]} rotation={[0, s * 0.35, s * -0.25]}>
          <boxGeometry args={[0.55, 0.05, 0.7]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.25} />
        </mesh>
      ))}
      {/* propulsores emissivos */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.9, -0.1, -0.95]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.17, 0.21, 0.5, 24]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.35} />
          </mesh>
          <mesh position={[0, 0, -0.27]} rotation={[Math.PI, 0, 0]}>
            <circleGeometry args={[0.15, 24]} />
            <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={3.2} toneMapped={false} />
          </mesh>
        </group>
      ))}
      <Trail side={-1} />
      <Trail side={1} />
      {/* luz ciano sob a nave: reflexo no chão */}
      <pointLight color="#22d3ee" intensity={7} distance={7} position={[0, -0.9, 0]} />
    </group>
  );
}

export function GravitronScene({ quality }: { quality: Quality }) {
  const root = useRef<Group>(null);
  const hero = useRef<Group>(null);
  useFrame(() => {
    const r = root.current;
    if (!r) return;
    const w = expState.w[IDX];
    r.visible = w > 0.01;
    // a nave entra de baixo e sai para cima; a pista e os riscos têm animação própria
    if (hero.current) {
      hero.current.scale.setScalar(0.4 + 0.6 * w);
      hero.current.position.y = (expState.pos - IDX - 0.5) * 2.6;
    }
  });
  return (
    <group ref={root}>
      <group ref={hero}>
        <Ufo />
      </group>
      <Track />
      <Streaks count={quality === "high" ? 600 : 260} />
    </group>
  );
}
