"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, MathUtils, Vector3, type DirectionalLight, type Fog, type Group, type PerspectiveCamera } from "three";
import { FEATURED } from "@/config/featured";
import { EspelhosScene } from "./scenes/Espelhos";
import { FazendaScene } from "./scenes/Fazenda";
import { GravitronScene } from "./scenes/Gravitron";
import { MaresScene } from "./scenes/Mares";
import { RaliScene } from "./scenes/Rali";
import { VagalumesScene } from "./scenes/Vagalumes";
import { expState } from "./state";
import type { Quality } from "./types";

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
      <FazendaScene quality={quality} />
      <MaresScene high={quality === "high"} />
      <EspelhosScene high={quality === "high"} />
      <VagalumesScene high={quality === "high"} />
      <RaliScene high={quality === "high"} />
    </>
  );
}
