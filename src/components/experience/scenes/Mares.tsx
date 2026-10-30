"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, DoubleSide, PlaneGeometry, Shape, ExtrudeGeometry, type Group, type ShaderMaterial } from "three";
import { Hero, SceneShell } from "./shared";

const IDX = 2;

/** Ondas Gerstner (3 componentes). A mesma soma, simplificada, calcula a altura do barco em JS. */
const WAVES: [number, number, number, number][] = [
  // dirX, dirZ, comprimento, amplitude
  [1, 0.3, 7, 0.22],
  [-0.4, 1, 4.2, 0.12],
  [0.7, -0.7, 2.6, 0.06],
];
const waveGlsl = WAVES.map(([dx, dz, L, A], i) => `
  { vec2 d = normalize(vec2(${dx.toFixed(2)}, ${dz.toFixed(2)})); float k = 6.2831853 / ${L.toFixed(2)}; float f = k * dot(d, p.xz) - uTime * (0.8 + ${i}.0 * 0.25);
    p.y += ${A.toFixed(2)} * sin(f); p.xz += d * ${(A * 0.6).toFixed(2)} * cos(f); }`).join("\n");

const vertex = /* glsl */ `
  uniform float uTime; varying vec3 vWorld; varying float vH;
  vec3 wave(vec3 p) { ${waveGlsl} return p; }
  void main() {
    vec3 p0 = position;
    vec3 p = wave(p0);
    vec3 pa = wave(p0 + vec3(0.1, 0.0, 0.0));
    vec3 pb = wave(p0 + vec3(0.0, 0.0, 0.1));
    vNormalW = normalize(cross(pb - p, pa - p));
    vH = p.y;
    vec4 w = modelMatrix * vec4(p, 1.0);
    vWorld = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`.replace("varying vec3 vWorld;", "varying vec3 vWorld; varying vec3 vNormalW;");
const fragment = /* glsl */ `
  uniform vec3 uDeep; uniform vec3 uShallow; uniform vec3 uSky; uniform vec3 uCam;
  varying vec3 vWorld; varying vec3 vNormalW; varying float vH;
  void main() {
    vec3 n = normalize(vNormalW);
    vec3 v = normalize(uCam - vWorld);
    float fres = pow(1.0 - max(dot(n, v), 0.0), 3.0);
    vec3 base = mix(uDeep, uShallow, smoothstep(-0.25, 0.3, vH));
    vec3 l = normalize(vec3(-0.4, 0.5, -1.0));
    float spec = pow(max(dot(reflect(-l, n), v), 0.0), 60.0);
    vec3 col = mix(base, uSky, fres * 0.7) + vec3(1.0, 0.85, 0.6) * spec * 0.8;
    float fog = smoothstep(18.0, 42.0, length(vWorld - uCam));
    col = mix(col, uSky * 0.6, fog);
    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function Ocean({ seg }: { seg: number }) {
  const mat = useRef<ShaderMaterial>(null);
  const geo = useMemo(() => new PlaneGeometry(70, 70, seg, seg).rotateX(-Math.PI / 2), [seg]);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uDeep: { value: new Color("#06202b") }, uShallow: { value: new Color("#1e6b78") }, uSky: { value: new Color("#3b5568") }, uCam: { value: new Color(0, 0, 0) } }),
    [],
  );
  useFrame((state) => {
    const m = mat.current;
    if (!m) return;
    m.uniforms.uTime.value = state.clock.elapsedTime;
    m.uniforms.uCam.value.copy(state.camera.position);
  });
  return (
    <mesh geometry={geo} position={[0, -1, -8]} frustumCulled={false}>
      <shaderMaterial ref={mat} uniforms={uniforms} vertexShader={vertex} fragmentShader={fragment} side={DoubleSide} />
    </mesh>
  );
}

/** Casco de veleiro: silhueta extrudada (proa pontuda), mastro, vela e vela menor. */
function Boat() {
  const hull = useMemo(() => {
    const s = new Shape();
    s.moveTo(-1.6, 0.35);
    s.lineTo(-1.35, -0.25);
    s.quadraticCurveTo(0, -0.45, 1.25, -0.2);
    s.lineTo(2, 0.35);
    s.lineTo(-1.6, 0.35);
    return new ExtrudeGeometry(s, { depth: 0.9, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.06, bevelSegments: 3 });
  }, []);
  const g = useRef<Group>(null);
  useFrame((state) => {
    const o = g.current;
    if (!o) return;
    const t = state.clock.elapsedTime;
    o.position.y = Math.sin(t * 0.8) * 0.12;
    o.rotation.z = Math.sin(t * 0.8 + 1) * 0.06;
    o.rotation.x = Math.sin(t * 0.6) * 0.04;
  });
  return (
    <group ref={g} position={[0, 0.15, -0.45]}>
      <mesh geometry={hull}><meshStandardMaterial color="#6b4226" roughness={0.65} /></mesh>
      <mesh position={[0.1, 1.6, 0.45]}><cylinderGeometry args={[0.05, 0.06, 3.1, 12]} /><meshStandardMaterial color="#3d2412" roughness={0.8} /></mesh>
      <mesh position={[0.1, 1.7, 0.45]} rotation={[0, 0.1, 0]}><planeGeometry args={[1.7, 2.3]} /><meshStandardMaterial color="#e8dcc0" side={DoubleSide} roughness={0.95} /></mesh>
      <mesh position={[1.1, 1.0, 0.45]} rotation={[0, 0.1, 0]}><planeGeometry args={[0.8, 1.3]} /><meshStandardMaterial color="#c9453b" side={DoubleSide} roughness={0.95} /></mesh>
      <mesh position={[-1.5, 0.75, 0.45]}><sphereGeometry args={[0.07, 12, 12]} /><meshStandardMaterial color="#ffd27a" emissive="#ffb347" emissiveIntensity={4} toneMapped={false} /></mesh>
      <pointLight position={[-1.5, 0.9, 0.45]} color="#ffb347" intensity={4} distance={4} />
    </group>
  );
}

/** Cena 3 — Marés de Guerra: oceano Gerstner em shader, veleiro balançando, céu de tempestade. */
export function MaresScene({ high }: { high: boolean }) {
  return (
    <SceneShell index={IDX}>
      <Ocean seg={high ? 150 : 70} />
      <mesh position={[0, 4, -30]}><planeGeometry args={[90, 30]} /><meshBasicMaterial color="#27384a" toneMapped={false} /></mesh>
      <Hero index={IDX}>
        <group position={[0, -0.7, -1]} scale={0.62}><Boat /></group>
      </Hero>
    </SceneShell>
  );
}
