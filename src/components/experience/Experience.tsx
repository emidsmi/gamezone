"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import type Lenis from "lenis";
import { GameSection } from "./GameSection";
import { MoreGames } from "./MoreGames";
import { expState } from "./state";
import type { ExperienceGame, ExperienceMode, Quality } from "./types";

// O Canvas (three.js) só existe no navegador e só é baixado nesta rota.
const Stage = dynamic(() => import("./Stage"), { ssr: false });

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function Experience({ games, staticMode }: { games: ExperienceGame[]; staticMode: boolean }) {
  const [mode, setMode] = useState<ExperienceMode>("pending");
  const [quality, setQuality] = useState<Quality>("high");
  const [sceneReady, setSceneReady] = useState(false);
  const [canvasOn, setCanvasOn] = useState(true);
  const [active, setActive] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);
  const gamesRef = useRef<HTMLDivElement>(null);
  const anchors = useRef<(HTMLElement | null)[]>([]);

  // Capacidades: movimento reduzido ou sem WebGL => modo "static" (seções com poster, sem 3D).
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decide = () => {
      setMode(reduce.matches || !hasWebGL() ? "static" : "3d");
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      const weak = (navigator.hardwareConcurrency ?? 8) <= 4 || ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) <= 4;
      // ?q=low | ?q=high força a qualidade (útil para testes de desempenho e para GPUs fracas).
      const forced = new URLSearchParams(window.location.search).get("q");
      setQuality(forced === "low" || forced === "high" ? forced : mobile || weak ? "low" : "high");
    };
    decide();
    reduce.addEventListener("change", decide);
    return () => reduce.removeEventListener("change", decide);
  }, []);

  // Altura real do cabeçalho (muda entre desktop e celular): o palco 3D começa logo abaixo dele.
  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    const set = () => document.documentElement.style.setProperty("--hdr", `${header.getBoundingClientRect().height}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(header);
    return () => ro.disconnect();
  }, []);

  // Ponteiro normalizado (-1..1) para o parallax da cena.
  useEffect(() => {
    if (mode !== "3d") return;
    const onMove = (e: PointerEvent) => {
      expState.px = (e.clientX / window.innerWidth) * 2 - 1;
      expState.py = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mode]);

  // Scroll storytelling: Lenis (rolagem suave) + GSAP ScrollTrigger (progresso por seção). Importados sob demanda.
  useEffect(() => {
    if (mode !== "3d") return;
    let cancelled = false;
    let cleanup = () => {};
    (async () => {
      const [{ default: gsap }, { ScrollTrigger }, { default: LenisCtor }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger"), import("lenis")]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const lenis = new LenisCtor({ lerp: 0.09, wheelMultiplier: 0.9 });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      const triggers = anchors.current.map((el, i) =>
        el
          ? ScrollTrigger.create({
              trigger: el,
              start: "top top",
              end: "bottom top",
              onUpdate: (self) => {
                expState.pos = i + self.progress;
                // O texto troca um pouco antes do fim da seção, junto com a mistura das cenas.
                const next = Math.min(games.length - 1, Math.floor(expState.pos + 0.1));
                setActive((prev) => (prev === next ? prev : next));
              },
            })
          : null,
      );
      // O canvas some quando a narrativa termina (carrossel e rodapé).
      const wrap = gamesRef.current
        ? ScrollTrigger.create({ trigger: gamesRef.current, start: "top bottom", end: "bottom bottom", onToggle: (self) => setCanvasOn(self.isActive) })
        : null;

      cleanup = () => {
        triggers.forEach((t) => t?.kill());
        wrap?.kill();
        gsap.ticker.remove(tick);
        lenis.destroy();
        lenisRef.current = null;
      };
    })();
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [mode, games.length]);

  const goTo = useCallback((i: number) => {
    const el = anchors.current[i];
    if (!el) return;
    // No palco 3D, o meio da âncora = objeto do jogo totalmente visível; no modo plano, topo da seção.
    const y = el.getBoundingClientRect().top + window.scrollY + (mode === "static" ? 0 : el.offsetHeight / 2);
    if (lenisRef.current) lenisRef.current.scrollTo(y, { duration: 1.3 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  }, [mode]);

  return (
    <div>
      <h1 className="sr-only">GameZone Brasil: seis jogos em destaque</h1>

      {mode === "3d" && (
        <div
          aria-hidden="true"
          className={`pointer-events-none fixed left-0 top-[var(--hdr,72px)] z-[5] h-[calc((100svh-var(--hdr,72px))*0.52)] w-full transition-opacity duration-700 lg:h-[calc(100svh-var(--hdr,72px))] lg:w-[58%] ${sceneReady && canvasOn ? "opacity-100" : "opacity-0"}`}
        >
          <Stage quality={quality} visible={canvasOn} onReady={() => setSceneReady(true)} onLost={() => setMode("static")} />
        </div>
      )}

      {mode === "3d" && !sceneReady && (
        <p role="status" className="fixed bottom-4 left-4 z-20 rounded-full bg-black/60 px-4 py-2 text-xs font-semibold text-muted">Carregando cena 3D…</p>
      )}

      {mode === "3d" && canvasOn && (
        <nav aria-label="Jogos em destaque" className="fixed right-3 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
          {games.map((g, i) => (
            <button
              key={g.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`${i + 1}: ${g.title}`}
              aria-current={i === active}
              className={`h-3 w-3 rounded-full border border-brand transition-all ${i === active ? "scale-125 bg-brand" : "bg-transparent hover:bg-brand/50"}`}
            />
          ))}
        </nav>
      )}

      {mode === "static" ? (
        <div ref={gamesRef} className="relative z-10">
          {games.map((g, i) => (
            <GameSection
              key={g.id}
              game={g}
              index={i}
              total={games.length}
              variant="flat"
              active
              sceneReady={false}
              staticMode={staticMode}
              innerRef={(el) => { anchors.current[i] = el; }}
            />
          ))}
        </div>
      ) : (
        <div
          ref={gamesRef}
          className="relative z-10 h-[calc(var(--n)*150svh+100svh)] lg:h-[calc(var(--n)*200svh+100svh)]"
          style={{ "--n": games.length } as CSSProperties}
        >
          {/* Palco fixo: todos os painéis empilhados; só o da cena ativa aparece. */}
          <div className="sticky top-[var(--hdr,72px)] h-[calc(100svh-var(--hdr,72px))] overflow-hidden">
            {games.map((g, i) => (
              <GameSection key={g.id} game={g} index={i} total={games.length} variant="stage" active={i === active} sceneReady={sceneReady} staticMode={staticMode} />
            ))}
          </div>
          {/* Âncoras invisíveis: cada uma mede o progresso (scroll) de um jogo e serve de destino de navegação. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0">
            {games.map((g, i) => (
              <div key={g.id} id={`jogo-${g.slug}`} ref={(el) => { anchors.current[i] = el; }} className="h-[150svh] lg:h-[200svh]" />
            ))}
          </div>
        </div>
      )}

      <MoreGames games={games} onSelect={goTo} />
    </div>
  );
}
