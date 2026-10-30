"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, type ReactNode } from "react";
import { BufferGeometry, Float32BufferAttribute, MathUtils, PlaneGeometry, type Group } from "three";
import { expState } from "../state";

/** PRNG determinístico (mulberry32): mantém o render puro. */
export function seeded(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Casca de cena: visível só quando o peso da cena > 0. O cenário (filhos) rola a meia velocidade;
 * o herói (`<Hero>`) rola mais rápido, criando paralaxe entre os dois.
 */
export function SceneShell({ index, children }: { index: number; children: ReactNode }) {
  const root = useRef<Group>(null);
  useFrame(() => {
    const r = root.current;
    if (!r) return;
    r.visible = expState.w[index] > 0.01;
    r.position.y = (expState.pos - (index + 0.5)) * 1.3;
  });
  return (
    <group ref={root} visible={false}>
      {children}
    </group>
  );
}

/** Objeto-herói: entra crescendo, gira levemente com o mouse e sai rolando para cima. */
export function Hero({ index, children, spin = 0 }: { index: number; children: ReactNode; spin?: number }) {
  const g = useRef<Group>(null);
  useFrame((state) => {
    const o = g.current;
    if (!o) return;
    const w = expState.w[index];
    o.scale.setScalar(0.4 + 0.6 * w);
    o.position.y = (expState.pos - (index + 0.5)) * 1.3;
    o.rotation.y = MathUtils.lerp(o.rotation.y, expState.px * 0.5 + Math.sin(state.clock.elapsedTime * 0.4) * 0.12 + spin * state.clock.elapsedTime, 0.08);
    o.rotation.x = MathUtils.lerp(o.rotation.x, -expState.py * 0.14, 0.08);
  });
  return <group ref={g}>{children}</group>;
}

/** Terreno procedural: plano deslocado por uma função de altura, com cor por vértice. */
export function makeTerrain(size: number, seg: number, height: (x: number, z: number) => number, color: (h: number, x: number, z: number) => [number, number, number]): BufferGeometry {
  const g = new PlaneGeometry(size, size, seg, seg);
  g.rotateX(-Math.PI / 2);
  const pos = g.attributes.position;
  const colors: number[] = [];
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    const h = height(x, z);
    pos.setY(i, h);
    colors.push(...color(h, x, z));
  }
  g.setAttribute("color", new Float32BufferAttribute(colors, 3));
  g.computeVertexNormals();
  return g;
}
