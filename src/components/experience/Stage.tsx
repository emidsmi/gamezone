"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { ACESFilmicToneMapping } from "three";
import { FEATURED } from "@/config/featured";
import type { Quality } from "./types";
import { SceneRig } from "./Scenes";

/** Único <Canvas> da página. Carregado sob demanda (dynamic, sem SSR) para não pesar nas outras rotas. */
export default function Stage({ quality, visible, onReady, onLost }: { quality: Quality; visible: boolean; onReady: () => void; onLost: () => void }) {
  const first = FEATURED[0].theme;
  return (
    <Canvas
      frameloop={visible ? "always" : "never"}
      dpr={quality === "low" ? 1 : [1, 1.5]}
      camera={{ position: [0, 0.3, 6.2], fov: 42 }}
      gl={{ antialias: quality === "high", powerPreference: "high-performance", toneMapping: ACESFilmicToneMapping }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          onLost();
        });
        onReady();
      }}
    >
      <color attach="background" args={[first.bg]} />
      <fog attach="fog" args={[first.fog, 8, 22]} />
      <SceneRig quality={quality} />
      {/* HDRI procedural (sem arquivo externo): painéis de luz que geram os reflexos PBR */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.4} position={[0, 4, -4]} scale={[10, 3, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={1.6} position={[-5, 1, 2]} scale={[3, 4, 1]} color="#ff4fa3" />
        <Lightformer form="rect" intensity={1.6} position={[5, 1, 2]} scale={[3, 4, 1]} color="#22d3ee" />
      </Environment>
      {quality === "high" && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.5} luminanceThreshold={0.7} mipmapBlur />
          <Vignette offset={0.3} darkness={0.6} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
