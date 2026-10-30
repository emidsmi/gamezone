# Storyboard — GameZone Brasil (experiência de rolagem)

Autor: diretor-arte-ux. Data: 30/10/2026. Prazo: 10/11/2026. Caso fictício de faculdade: nomes, estúdios e jogos são inventados. Nada aqui usa marcas ou personagens reais.
Fonte de textos: título e `short_description` de `src/data/static/catalog.json`. Preço, desconto e classificação vêm do mesmo catálogo em tempo de execução (o 3D não os conhece; só o HTML os mostra). Os valores exatos não foram transcritos aqui para não duplicar dado.

## 1. Princípios e tokens

1. **Um palco, seis atos.** Um único `<Canvas>` fixo; a rolagem só muda câmera, luz, cor de fundo e o objeto-herói. Nunca há dois canvas.
2. **Texto é HTML, sempre.** Título, descrição, preço e COMPRAR ficam em HTML real (leitor de tela, foco, funciona sem WebGL).
3. **Marca primeiro.** Vinho `#14070a`, verde-limão `#a3e635`, títulos pesados em itálico. Cada jogo tem paleta própria no 3D, mas o texto e o botão usam sempre os tokens da marca.
4. **Estilizado, não fotorrealista.** Formas simples, materiais PBR limpos, silhuetas legíveis a 300 px de largura (lembram as capas ilustradas atuais).
5. **Degradar sem quebrar.** Poster estático, sem animação ou menos partículas; a compra nunca depende do 3D.

### Tokens reaproveitados (`globals.css`)
| Token | Valor | Uso |
|---|---|---|
| ink / panel / panel2 / line | `#14070a` / `#1f0b10` / `#2e1218` / `#54212d` | fundo, cartões, bordas |
| fg / muted | `#fff1f2` / `#dcaab4` | texto principal / secundário |
| brand / gold | `#a3e635` / `#d9f99d` | destaque, foco, botão |
| Fonte | Segoe UI (sistema); títulos: 900, itálico, caixa alta, `letter-spacing:-.02em` | sem webfont |
| Raio / sombra | botão `.6rem`, cartão `1rem`; sombra do COMPRAR `0 8px 30px -8px #a3e63588` | |
| Título de cena | `clamp(2.4rem, 6vw, 5.5rem)`; descrição `1.125rem/1.6`; selo de gênero `.8rem` caixa alta | |

### Tokens de movimento
| Token | Valor | Uso |
|---|---|---|
| `--m-fast` | 160 ms, `cubic-bezier(.2,.8,.2,1)` | hover, foco |
| `--m-text` | 600 ms, `power3.out` (GSAP) | entrada do texto |
| `--m-scene` | 1100 ms equivalente de scroll, `power2.inOut` | troca de cena |
| `--m-lerp` | damping 0,08 (câmera e mouse) | suavização contínua |
| Lenis | `lerp: 0.09`, `wheelMultiplier: .9`, `smoothTouch` desligado | rolagem |
| Stagger do texto | 70 ms (selo, título, descrição, preço, botão) | |
Regra: nada se move mais de 12° por segundo na câmera; sem flash acima de 3 Hz.

## 2. Wireframe

### Desktop (>= 1024 px)
```
+--------------------------------------------------------------+
| GAMEZONE BRASIL    Início  Catálogo  Carrinho       [Entrar] |  menu fixo (z 50, fundo ink/70 + blur)
+--------------------------------------------------------------+
|                                  |  01 / 06   [CORRIDA]      |
|   CANVAS 3D fixo                 |  GRAVITRON GP             |
|   (esquerda, 58% da largura,     |  Naves de corrida         |
|    100svh, objeto-herói          |  deslizam por pistas...   |
|    centrado em 45% / 50%)        |  R$ 119,90  -25%  16+     |
|                                  |  [ COMPRAR ]  Ver jogo    |
|          o   o   o   o   o   o   |  barra de progresso 6 pts |
+--------------------------------------------------------------+
   (6 seções de 200svh cada; o canvas fica fixo e troca a cena)
+--------------------------------------------------------------+
|  Mais jogos                                                  |
|  [capa][capa][capa][capa][capa]  >   carrossel estilo Netflix |
|  (scroll horizontal, setas, foco visível, data-lenis-prevent)|
+--------------------------------------------------------------+
|  © 2026 GameZone Brasil  ·  caso fictício acadêmico          |
+--------------------------------------------------------------+
```
Texto à direita: coluna de `min(34rem, 38vw)` sobre scrim `linear-gradient(to left, #14070a 0 55%, #14070a00)`.

### Mobile (< 768 px)
```
+----------------------+
| GAMEZONE  [menu]     |  fixo
+----------------------+
|  CANVAS 3D fixo      |  topo, 52svh
|  (objeto centrado)   |
|----------------------|
|  01/06 [CORRIDA]     |  painel de texto na base,
|  GRAVITRON GP        |  fundo ink/85 + blur, 48svh
|  descrição 2 linhas  |
|  R$ 119,90   [COMPRAR]|  botão >= 48 px de altura
+----------------------+
 seções de 150svh; carrossel com snap; rodapé © 2026
```
Tablet (768–1023): igual ao mobile, canvas 56svh.

## 3. Jogos

Convenções: **Luz** = iluminação; HDRI procedural = `Environment` com `Lightformer` (sem arquivo externo). Se algum preset do drei for usado, só com licença CC0 confirmada. Contraste calculado como estimativa (WCAG); validar com ferramenta antes de entregar. Todos os textos ficam sobre o scrim vinho da coluna direita, então a combinação real é sempre **fg `#fff1f2` sobre `#14070a` (cerca de 17:1)**, título e botão incluídos; o selo usa **brand sobre ink (cerca de 12:1)**; descrição em **muted `#dcaab4` sobre ink (cerca de 9:1)**; botão **`#1a2e05` sobre `#a3e635` (cerca de 11:1)**. Todas passam AA e AAA para texto normal.

### 3.1 Gravitron GP — "Velocidade sem freio"
- **Ambiente**: túnel de pista antigravidade em arco sobre o vazio, noite roxa com faixas de neon que passam.
- **Paleta**: fundo `#0b0a2a` → `#2a0f5c`; primária `#7c3aed`; acento `#22d3ee`; luz quente `#ff4fa3`; metal `#cbd5e1`.
- **Luz**: HDRI procedural escuro (intensidade 0,6) com 2 `Lightformer` retangulares ciano e magenta como rim light; 1 `pointLight` ciano sob a nave (brilho no chão).
- **Objeto-herói**: disco/nave de corrida em formato de gota achatada, cabine de vidro, 2 propulsores.
- **Construção**: corpo = `SphereGeometry` (48x32) escalada (1,6 / 0,35 / 1,2) + `TorusGeometry` fino como aro; cabine = meia esfera com `MeshPhysicalMaterial` `transmission .9, roughness .05, ior 1.45, thickness .3`; casco `metalness .9, roughness .28, color #7c3aed`, `clearcoat 1`; aletas = 2 `BoxGeometry` chanfradas (extrude pequeno); propulsores = cilindros `emissive #22d3ee`, `emissiveIntensity 3` (alimenta o bloom). Pista = `PlaneGeometry` 6x80 com shader de listras que rolam em `uv.y` (uniforme `uTime` e `uSpeed` ligado ao scroll), faixas laterais emissivas.
- **Partículas**: 600 `InstancedMesh` de riscos de velocidade (cápsulas finas), reciclados em Z; rastro dos propulsores com 80 quads.
- **Scroll**: progresso 0→1 aumenta `uSpeed` (1→4) e o risco de velocidade estica 1→5x; nave inclina (roll) ±12° conforme a direção do scroll.
- **Mouse**: nave desvia até 0,4 un e gira 6° (lerp 0,08).
- **Câmera**: entra de trás e acima (0, 1,6, 6) com FOV 55 e mergulha para (-1,2, 0,8, 4,2) com FOV 40; sai acelerando em avanço para dentro do túnel (dolly -3 un) enquanto a cor de fundo vira a do jogo 2.
- **Transição para o 2**: flash curto de luz branca-azulada (bloom +0,6 por 300 ms) cobre a troca da cena.
- **Poster**: SVG baseado na capa `ufo` de `scripts/art.mjs` sobre degradê roxo; arquivo `public/posters/gravitron.webp` (1200x1400).

### 3.2 Fazenda Lua Nova — "Plante pela lua"
- **Ambiente**: campo ondulado à noite, celeiro pequeno, lua enorme baixa atrás; cerca e plantações em fileiras.
- **Paleta**: céu `#0f1f3d` → `#2b3a67`; lua `#fff3c4`; celeiro `#b4443a`; telhado `#7a2e2a`; grama `#2f7d4f`; luz de janela `#fbbf24`.
- **Luz**: `directionalLight` frio `#9db7ff` (intensidade 1,4) vindo da lua; HDRI procedural com `Lightformer` circular azul-claro; ponto quente `#fbbf24` na porta do celeiro.
- **Objeto-herói**: celeiro com telhado em duas águas, portão em X, janelinha acesa; lua grande como esfera com ruído.
- **Construção**: paredes = `BoxGeometry` 2,4x1,6x2; telhado = `ExtrudeGeometry` de triângulo (ou 2 caixas rotacionadas ±38°); portão = caixa + 2 barras em X; materiais madeira estilizada `roughness .85, metalness 0`, `normalMap` procedural (ruído em `CanvasTexture` 512²); lua = `SphereGeometry` raio 3 com `ShaderMaterial` (crateras por `fbm`, emissiva `#fff3c4`, `emissiveIntensity 1.2`); terreno = `PlaneGeometry` 40x40 (128 seg) deslocado por `sin` suave no vertex shader; plantações = `InstancedMesh` (300 cones achatados).
- **Partículas**: 150 vaga-lumes lentos `#fde68a` + 40 sprites de poeira de luar.
- **Scroll**: lua sobe 0,8 un e aumenta brilho 1→1,4; câmera circula 20° ao redor do celeiro; plantações crescem (escala Y 0,2→1) com stagger.
- **Mouse**: parallax suave da lua e do celeiro em camadas (0,15 / 0,05 un).
- **Câmera**: entra de baixo, olhando a lua, sobe para plano aberto (FOV 42); sai afastando e descendo até o horizonte.
- **Transição para o 3**: névoa azul-marinho sobe do chão (fog density 0→0,12), fecha e reabre já no mar.
- **Poster**: capa `barn` com céu noturno e lua grande; `fazenda.webp`.

### 3.3 Marés de Guerra — "Use a maré a seu favor"
- **Ambiente**: mar aberto agitado, céu de tempestade com abertura dourada no horizonte, ilhas distantes.
- **Paleta**: mar `#0e3b5e` → `#0a1f33`; espuma `#e6f4ff`; céu `#20324a` → `#d6a45a`; casco `#6b4226`; velas `#f4ead2`.
- **Luz**: `directionalLight` baixo `#ffd7a1` (1,8) do horizonte; HDRI procedural com `Lightformer` laranja baixo e cinza-azul acima; neblina distante `#20324a`.
- **Objeto-herói**: veleiro de dois mastros, casco robusto, velas infladas.
- **Construção**: casco = `LatheGeometry` ou caixa afunilada em `ExtrudeGeometry` (proa pontuda), `roughness .7`; mastros = cilindros finos `roughness .8`; velas = `PlaneGeometry` 8x8 seg dobradas por vertex shader (`sin` + vento) com `side: DoubleSide`, `roughness .9`, translucidez fake; cordame = linhas (`Line`) finas. **Mar** = `PlaneGeometry` 80x80 (192 seg) com `ShaderMaterial`: soma de 4 ondas Gerstner (`uTime`, amplitude ligada ao scroll), normal recalculada no fragment, cor por profundidade e fresnel (`pow(1-dot(n,v),3)`), espuma por limiar de altura; barco acompanha altura/inclinação da onda sob ele (mesma função em JS, só 1 amostra).
- **Partículas**: 400 gotas/spray instanciadas na proa; 60 gaivotas opcionais (corte 1).
- **Scroll**: amplitude das ondas 0,25→0,9; barco balança até 14° de roll; nuvens escuras avançam.
- **Mouse**: o horizonte inclina até 3° (câmera roll); vento das velas responde.
- **Câmera**: entra rente à água (y 0,6), vê a proa surgir, sobe em arco para a lateral (FOV 45); sai passando sob a quilha, mergulhando visualmente.
- **Transição para o 4**: o mar escurece até quase preto (exposição 1→0,35) e a névoa cinza assume.
- **Poster**: capa `ship` com ondas; `mares.webp`.

### 3.4 Casa dos Espelhos Cegos — "O reflexo não obedece"
- **Ambiente**: corredor escuro de uma casa abandonada, assoalho de madeira molhada, névoa baixa, um espelho oval de moldura antiga no centro.
- **Paleta**: fundo `#07090d`; névoa `#1b2a3a`; moldura `#8a6a2f`; vidro `#a8c7d8`; luz fria `#7fb4d9`; vermelho de alerta `#ff3b3b` (usado em 2 frames).
- **Luz**: pouca luz: 1 `spotLight` frio `#7fb4d9` (ângulo 0,5, penumbra 1) sobre o espelho; HDRI quase preto com 1 `Lightformer` vertical (janela) fraco; vinheta forte (0,55).
- **Objeto-herói**: espelho oval alto em pé, moldura entalhada.
- **Construção**: moldura = `TorusGeometry` achatado (raio 1, tubo 0,12, 64x16) escalado (0,7/1/0,3), `metalness 1, roughness .4, color #8a6a2f`, `normalMap` procedural de ornamentos; vidro = `Reflector` do drei em baixa resolução (256x256, `mixStrength` 1,2) + `ShaderMaterial` de distorção (ruído em `uv` ligado ao scroll) **ou, para cortar custo**, `MeshPhysicalMaterial` `metalness 1, roughness .02` com `envMap` do HDRI; o "reflexo que desobedece" = um boneco simples (silhueta de capsule + esfera) renderizado só dentro do Reflector com atraso de 400 ms em relação ao mouse. Piso = plano `roughness .35, metalness 0`, `clearcoat .6`. Névoa = 1 plano grande com shader de ruído `fbm` animado, alfa 0,25, `depthWrite false`.
- **Partículas**: 200 grãos de poeira na luz do spot (pontos com `size attenuation`); 1 pisca de luz aleatório a cada 7–11 s.
- **Scroll**: câmera aproxima do espelho; o reflexo se descola (atraso 0→1,2 s); vinheta 0,4→0,7.
- **Mouse**: lanterna invisível: o spot segue o cursor (lerp), reflexo imita com atraso.
- **Câmera**: entra de longe, ponto de vista humano (y 1,5, FOV 50); chega a 1,5 un do espelho; sai atravessando o vidro com leve distorção.
- **Transição para o 5**: dissolução por ruído: o vidro "racha" (máscara de ruído em tela) e revela a floresta.
- **Poster**: capa `mirror` sobre azul quase preto; `espelhos.webp`.

### 3.5 A Trilha dos Vagalumes — "A floresta muda a cada noite"
- **Ambiente**: floresta noturna densa de silhuetas, trilha de terra, lua crescente grande, vagalumes por toda parte.
- **Paleta**: céu `#0a1a1a` → `#134e4a`; árvores `#06201c`; lua `#fef9c3`; vagalumes `#bef264` e `#fde047`; trilha `#3b2a1a`.
- **Luz**: `hemisphereLight` esverdeado fraco; `directionalLight` da lua `#d9f99d` (0,8); vagalumes como emissivas com bloom, sem luzes reais (somente 3 `pointLight` fixas).
- **Objeto-herói**: lua crescente grande, com uma lanterna viva (esfera pequena brilhante) no fim da trilha.
- **Construção**: lua = `SphereGeometry` com `ShaderMaterial` que recorta a crescente (segunda esfera deslocada como máscara no fragment), emissiva; árvores = `InstancedMesh` de cones empilhados (3 níveis, 60 instâncias em 3 profundidades, parallax); troncos = cilindros; trilha = `PlaneGeometry` curvo com `roughness 1`; lanterna = esfera `emissive #bef264, intensity 4` com halo (sprite aditivo).
- **Partículas**: **600** vagalumes em `Points` (GPU: posição por `sin/cos` com fase individual no vertex shader), tamanho pulsante, cor alterna entre as duas do paleta; um subgrupo de 40 forma uma trilha que acompanha o scroll.
- **Scroll**: vagalumes se agrupam em direção à lanterna conforme o progresso; câmera avança pela trilha (dolly 6 un).
- **Mouse**: vagalumes próximos ao cursor se afastam em raio 1,2 (repulsão no shader, uniform `uMouse`).
- **Câmera**: entra alta, olhando a lua; desce e caminha pela trilha em primeira pessoa baixa (y 0,9, FOV 52); sai subindo para o céu.
- **Transição para o 6**: os vagalumes sobem e viram "poeira dourada" que escurece em tom areia.
- **Poster**: capa `moon` sobre verde-azulado com pontos amarelo-limão; `trilha.webp`.

### 3.6 Rali das Dunas Vermelhas — "Rali brutal"
- **Ambiente**: duna vermelha em fim de tarde, sol baixo grande atrás, céu laranja e rosa, horizonte com canyons.
- **Paleta**: areia `#c2410c` → `#7c2d12`; céu `#fb923c` → `#fda4af`; sol `#fff7ed`; carro `#e11d48`; sombras `#3b0a0a`.
- **Luz**: `directionalLight` rasante `#ffb27a` (2,4) com sombra suave; HDRI procedural com `Lightformer` grande laranja atrás e rosa acima; bloom no sol.
- **Objeto-herói**: carro de rali robusto, para-choque elevado, faróis auxiliares no teto.
- **Construção**: carroceria = `ExtrudeGeometry` de perfil lateral + `BoxGeometry` chanfrada para a cabine; tinta `MeshPhysicalMaterial` `metalness .6, roughness .35, clearcoat 1, clearcoatRoughness .15, color #e11d48`; vidros = `metalness .9, roughness .1, color #0f172a`; 4 rodas = `CylinderGeometry` com `TorusGeometry` (pneu) `roughness .95`, rodam proporcional ao scroll; faróis = 4 esferas `emissive #fff7ed`. Dunas = `PlaneGeometry` 60x60 (160 seg) deslocada por `fbm` no vertex shader (cristas assimétricas), cor com gradiente por inclinação e ruído de grão para areia (`roughness 1`).
- **Partículas**: poeira atrás das rodas: 300 sprites instanciados (billboards macios, `NormalBlending`, alfa decrescente); 120 grãos de areia ao vento (linhas curtas).
- **Scroll**: carro percorre a duna (path `CatmullRomCurve3` de 4 pontos); poeira cresce com a velocidade; sol sobe 3° e esquenta a cor.
- **Mouse**: câmera orbita até 6° em torno do carro; a poeira inclina.
- **Câmera**: entra baixa e lateral, no nível das rodas; passa para travelling traseiro e abre em plano geral; sai com o carro ultrapassando a câmera.
- **Transição para o carrossel**: sol "pousa" e a cena escurece em `#14070a`; o canvas faz fade-out e é desmontado (`frameloop="never"`) ao passar do último trecho.
- **Poster**: capa `car` sobre areia vermelha com sol; `rali.webp`.

## 4. Transições e `prefers-reduced-motion`

| Tipo | Como |
|---|---|
| Câmera | cada cena tem `camIn` e `camOut`; o `ScrollTrigger` com `scrub: 1` interpola entre `camOut(n)` e `camIn(n+1)` no último 30% da seção. |
| Ambiente | uma única instância de cada grupo; só 2 grupos visíveis ao mesmo tempo (atual e próximo); o resto fica com `visible=false`. Cor de fundo/`fog`/exposição interpoladas em JS (um objeto `state`). |
| Cortina | blur CSS no texto (6 px → 0) e opacidade; no 3D, o efeito de "cobertura" por jogo descrito acima (flash, névoa, rachadura, poeira). Duração total 700–1100 ms de rolagem. |
| Texto | cada bloco entra por `--m-text` e sai por 300 ms; só um bloco tem `aria-hidden=false`. |
| Foco | COMPRAR da cena ativa tem `tabindex 0`; os demais `inert`. Ordem: menu → cena ativa → carrossel → rodapé. |
| Reduced motion | sem Lenis, sem ScrollTrigger scrub, sem partículas; 6 seções estáticas empilhadas, cada uma com poster, texto e COMPRAR; carrossel normal; nada de autoplay. Detecção por `matchMedia` (reage a mudança em tempo real). |

## 5. Estados

| Estado | Comportamento |
|---|---|
| Carregando | tela ink com logo e barra `brand` (progresso real do `useProgress`); mostra o poster do jogo 1 em 200 ms; o texto do 1 já aparece (HTML); duração alvo < 2,5 s em 4G, canvas lazy (`dynamic` em wrapper client). |
| Erro WebGL / contexto perdido | detectar antes de montar; em falha, trocar para o modo poster (igual a reduced motion) e mostrar aviso discreto "Modo leve ativado". Tratar `webglcontextlost` com tentativa única de restaurar. |
| Mobile | `dpr` máximo 1,5 (1,25 em aparelhos fracos); sem pós-processamento além de tone mapping; partículas -50%; sem `Reflector` (jogo 4 usa envMap); toque: giroscópio opcional desligado; rolagem nativa com Lenis `syncTouch` desligado. |
| Sem JS | poster e texto de cada jogo em HTML (SSR), COMPRAR funciona (formulário). |
| Modo estático | COMPRAR leva ao detalhe do jogo (ver AUDITORIA §2); o rótulo continua "COMPRAR". |
| Qualidade adaptativa | `PerformanceMonitor` do drei: 3 níveis (alto/médio/baixo); cai quando FPS < 45 por 2 s; sobe se > 58 por 5 s. Baixo = poster. |

## 6. Orçamento de performance por cena

Meta: 60 fps em notebook com iGPU; 30+ fps em celular médio. Bundle 3D carregado só na rota `/`, fora do bundle da loja (`/loja`).

| Cena | Triângulos | Partículas | Draw calls | Observação |
|---|---|---|---|---|
| 1 Gravitron | <= 60 k | 680 | <= 35 | pista + riscos instanciados |
| 2 Fazenda | <= 70 k | 190 + 300 inst. | <= 40 | terreno 128² |
| 3 Marés | <= 90 k | 400 (+60) | <= 30 | mar 192² é o maior custo (shader) |
| 4 Espelhos | <= 80 k | 200 | <= 45 | `Reflector` dobra os draw calls da cena |
| 5 Vagalumes | <= 60 k | 600 + 60 árvores inst. | <= 30 | partículas todas na GPU |
| 6 Rali | <= 85 k | 420 | <= 40 | duna 160² |
| Total ativo (2 cenas visíveis) | <= 150 k | <= 1.200 | <= 80 | só atual + próxima na tela |

Texturas: procedurais em `CanvasTexture` <= 512², sem imagens grandes. Pós-processamento: bloom (intensidade .5, `mipmapBlur`) + vinheta + tone mapping ACES; sem SSAO, sem DOF. Sombras: só no jogo 6 (1024² suave). Peso alvo do JS 3D: <= 450 KB gzip.

## 7. Riscos e cortes

| Risco | Mitigação |
|---|---|
| Prazo apertado (10/11) | construir primeiro a estrutura (scroll + 1 cena + poster + COMPRAR), depois cenas em ordem. |
| Mar (shader) e Reflector pesam | usar o envMap no jogo 4; ondas com 2 camadas no nível médio. |
| Compatibilidade R3F 9 / React 19 / Next 16 | testar na primeira entrega; `transpilePackages` se preciso. |
| Lenis × `scroll-behavior: smooth` | remover o `smooth` da `html` na rota nova (ver AUDITORIA §6). |
| Texto ilegível sobre cena clara | scrim vinho sempre presente; teste de contraste. |

### Ordem de corte (se faltar tempo)
1. **Corte 1**: jogo 6 Rali: trocar o 3D por poster animado com parallax em CSS (3 camadas SVG) e poeira em CSS.
2. **Corte 2**: jogo 5 Vagalumes: reduzir a cena à lua + partículas (sem floresta instanciada, só silhuetas em SVG).
3. **Corte 3**: jogo 4 Espelhos: remover o `Reflector` e o reflexo atrasado; espelho com envMap e névoa.
4. Depois disso, 1–3 ficam completos; os jogos 4–6 viram "cenas leves" mantendo texto, COMPRAR e carrossel.
5. Último recurso: 3 cenas 3D reais (1–3) + 3 com poster animado; tudo no mesmo layout.

## 8. Decisões para aprovação

| # | Decisão | Recomendação |
|---|---|---|
| 1 | Quais 6 jogos entram na narrativa (hoje só Gravitron GP tem `is_featured`)? | Lista fixa `FEATURED_SLUGS` no código, sem mexer no limite de 5 da home antiga. |
| 2 | Espelho do jogo 4: `Reflector` real ou envMap? | envMap por padrão; `Reflector` só desktop se sobrar tempo. |
| 3 | Altura das seções de rolagem | 200svh desktop, 150svh mobile; total ~ 12 telas de rolagem. |
| 4 | Fallback sem WebGL e com reduced motion | Mesmo modo "poster" para os dois, com 6 seções estáticas. |
| 5 | Cortes 4–6 se faltar prazo | Aprovar a ordem: Rali, depois Vagalumes, depois Espelhos (seção 7). |
