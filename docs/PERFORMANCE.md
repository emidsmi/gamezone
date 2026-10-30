# Performance e acessibilidade (Fase 6)

Limitação importante: o ambiente de desenvolvimento só tem WebGL por software (SwiftShader, ~2 fps). **FPS real e Lighthouse não foram medidos em GPU.** O que segue é o que foi medido de fato e o que é projeção.

## Medido

| Item | Resultado | Meta |
| --- | --- | --- |
| Chunk 3D (three + R3F + drei + postprocessing + cenas), carregado sob demanda | ~1,1 MB bruto, **~298 KB gzip** | ≤ 450 KB gzip |
| Próximo maior chunk (framework/app) | ~72 KB gzip | n/d |
| Console no Vercel/local (desktop e mobile) | sem erros; só aviso `THREE.Clock` do R3F | sem erros |
| Testes | Vitest 54/54; Playwright da experiência 3/3 (desktop, movimento reduzido, mobile) | verde |

## Decisões de desempenho

- Um único `<Canvas>` fixo; as 6 cenas só renderizam (`visible`) quando o peso > 0.
- Bundle 3D carregado com `dynamic(..., { ssr: false })` após a primeira pintura; o poster do jogo aparece enquanto a cena carrega.
- Qualidade adaptativa: `high` (bloom, vinheta, dpr até 2, mais partículas) e `low` (sem pós-processamento, dpr 1, menos partículas) em mobile/dispositivos fracos; `?q=low|high` força.
- Instanciamento: riscos de velocidade, rastro, árvores e poeira usam `InstancedMesh`; vagalumes usam `Points` (1 draw call).
- Sem WebGL ou com `prefers-reduced-motion`: seções planas com imagem, sem canvas.
- Perda de contexto WebGL leva ao fallback estático.

## Acessibilidade

- Um `h1` (leitores de tela) e `h2` por jogo; painéis inativos usam `inert`; navegação por pontos e cards é por botões/links com foco visível.
- Texto claro sobre fundo escuro (#ffffff / ~#f5e9ea sobre ~#140708) com contraste muito acima de 4,5:1; texto do botão COMPRAR (escuro sobre verde-limão) também passa.
- Sem rolagem horizontal em 390 px (testado).

## Pendente / a medir em máquina com GPU

- FPS real (alvo 60 desktop / 30+ mobile), LCP, Lighthouse.
- Contraste medido com ferramenta (hoje estimado pelos tokens).
