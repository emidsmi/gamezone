# Auditoria — GameZone Brasil (Fase 0)

Gerada pelo agente `auditor-codigo` (somente leitura) em 30/10/2026. Evidências no formato `arquivo:linha`. Não foram lidos arquivos `.env*`.
Observação: `package.json` ainda se chama `pixelporto`; contas demo usam `@pixelporto.test`; cookie `pp_demo_role`. A marca visível é GameZone Brasil. Projeto Vercel: `gamezone-brasil`.

## 1. Stack
| Item | Valor |
|---|---|
| Framework | next ^16.4.2, react/react-dom ^19.3.1 (`package.json:23-25`) |
| Estilo | tailwindcss ^4.3.3, tokens em `@theme` (`src/app/globals.css:3-16`) |
| Dados | @supabase/ssr, supabase-js, zod ^4 |
| Testes | vitest (`tests/**/*.test.ts`), playwright (`./e2e`), pglite (testes de banco) |
| Não instalado | three, @react-three/*, gsap, lenis |
| `next.config.ts` | só `serverActions.bodySizeLimit`; sem `transpilePackages`; o código usa `<img>` (sem `next/image`) |
| Proxy | `src/proxy.ts` (matcher exclui `_next/*` e imagens) |

## 2. Modos de execução
| Modo | Gatilho | Evidência |
|---|---|---|
| Estático | `NEXT_PUBLIC_STATIC_MODE=true` ou `NEXT_PUBLIC_SUPABASE_URL` ausente | `src/lib/static-mode.ts:7` |
| Demo | `DEMO_MODE=true` (servidor) | `src/lib/demo.ts:15` |
| Normal | Supabase configurado, demo desligado | `src/lib/routes.ts:13-28` |

| Aspecto | Estático | Demo | Normal |
|---|---|---|---|
| Dados | `src/data/static/catalog.json` em memória; `src/data/games.ts` desvia por função | view `catalog_games` | idem |
| Usuário | `null` / flags vazias | proxy faz login da conta demo | sessão real |
| Proxy | rotas de compra/conta → `/em-breve` | auth → `/`; `/admin` de não-admin → `/modo-admin` | protege por perfil |
| Compra | botão desabilitado em `/jogo/[slug]`; cards só com link | `addToCart` com usuário demo | idem, ou `/entrar` |

Estático tem precedência sobre demo (`Header.tsx:19`, proxy retorna antes).

## 3. Home atual
`src/app/page.tsx` (Server Component): `getCurrentUser` + `getHomeData` + `getUserFlags` → `Hero` (client, rotação 7 s, `<form action={addToCart}>`) + `Carousel` (client) com `GameCard` (server). `layout.tsx` envolve tudo com `Header` (sticky z-40) e `Footer` — ficam em todas as rotas, inclusive em uma home 3D.
Dependências da home: `back="/"` nas actions (`src/actions/shop.ts`), `resolveAccess` devolve `/`, logo/nav, e2e `purchase.spec.ts:30-41`, `revalidatePath("/", "layout")`.

## 4. Destaque (`is_featured`)
Coluna em `supabase/migrations/20260101000001_schema.sql:55`; consultas limitam a **5** (`src/data/games.ts:135`, `src/data/static/index.ts:63`); admin tem checkbox (`GameForm.tsx`).
Hoje `is_featured=true`: Lâmina do Eclipse, Ilhas de Aurora, Crônicas de Valdoran, **Gravitron GP**, Fúria de Neon, Operação Cinzas.
Dos 6 jogos pedidos, **só Gravitron GP** está marcado. Os 6 existem no catálogo e têm arte em `public/media`. `FEATURED_SLUGS` não existe no código.

## 5. Testes
| Suíte | Protege | Quebra se a home mudar? |
|---|---|---|
| `tests/unit/static-catalog.test.ts` | `staticHome()`, filtros, paginação (41 jogos) | Sim, se mexer em `staticHome()`/catálogo |
| `tests/unit/business.test.ts` | preço, gateway, checkout, Zod, rotas, erros | Não (salvo `routes.ts`/`shop.ts`/`checkout.ts`) |
| `tests/db/database.test.ts` | seed (41 jogos), RLS, checkout transacional | Só se o seed mudar |
| `e2e/purchase.spec.ts` | home sem login, compra completa, recusado, desejos, admin | **Teste 1 quebra** com a nova home |
Lacunas: sem teste de componentes, sem e2e do modo estático, sem CI (`.github` inexistente), lint só em `src`.

## 6. Riscos para three.js / R3F / GSAP / Lenis
- `<Canvas>` só no cliente; `dynamic(..., { ssr:false })` **não é permitido em Server Component** (`node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md:94-95`) → wrapper client.
- Passar ao 3D só dados serializáveis; **COMPRAR deve ser HTML real sobre o Canvas** (acessível e funciona sem WebGL).
- R3F 9.x necessário para React 19; verificar compatibilidade e `transpilePackages` (doc `05-config/01-next-config-js/transpilePackages.md`).
- `html { scroll-behavior: smooth }` (`globals.css:18`) conflita com Lenis; carrossel horizontal precisa de `data-lenis-prevent`.
- Header `sticky z-40` e Canvas `fixed`: controlar z-index/`pointer-events`; usar `svh/dvh` (iOS).
- Acessibilidade: `prefers-reduced-motion` já tratado em `globals.css:47-49`; falta fallback sem WebGL e ordem de foco por seção.
- Peso: nenhuma lib 3D hoje; three+drei podem passar de ~600 KB → carregar só na rota da experiência, sob demanda.
- Vercel sem variáveis ⇒ modo estático ⇒ COMPRAR não conclui compra; ligar `NEXT_PUBLIC_SUPABASE_URL` tira do modo estático e exige banco + seed; `DEMO_MODE=true` em produção deixa qualquer visitante virar admin.

## 7. Inacessível no modo estático publicado
Redirecionam a `/em-breve`: `/carrinho`, `/checkout`, `/pedidos[/id]`, `/biblioteca`, `/api/library/*`, `/desejos`, `/perfil`, `/entrar`, `/cadastro`, `/recuperar-senha`, `/redefinir-senha`, `/admin/**`, `/modo-admin`. Inertes: `/auth/callback`, `ReviewForm`, lista de desejos nos cards, `DemoSwitch`. Acessíveis: `/`, `/catalogo`, `/jogo/[slug]`, `/em-breve`.

## 8. Dados
Migrations: schema, functions, rls, storage. Tabelas/views: `catalog_games` (view), `categories`, `platforms`, `tags`, `reviews`, `library_items`, `wishlists`, `carts`, `cart_items`, `orders`, `order_items`, `payments`, `profiles`, `games`, `activation_keys`. RPCs: `create_order_from_cart` (usuário) e `confirm_payment` (só service role). Variáveis: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (servidor), `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_STATIC_MODE`, `DEMO_MODE`.

## 9. Tokens reutilizáveis
`ink #14070a`, `panel #1f0b10`, `panel2 #2e1218`, `line #54212d`, `fg #fff1f2`, `muted #dcaab4`, `brand #a3e635`, `gold #d9f99d`, `danger #ff7b7b`, `ok #4ade80`. Fonte Segoe UI/system (sem webfont). Utilitárias: `.btn*`, `.card`, `.input`, `.no-scrollbar`, `.sr-only-focusable`.

## 10. Fluxos que não podem quebrar
- Compra: `GameCard`/`Hero`/`jogo/[slug]` → `addToCart` → `/carrinho` → `CheckoutForm` → `checkout` → `placeOrder` → `/pedidos/[id]`.
- Liberação: RPC `confirm_payment` (idempotente) → `library_items`, `activation_keys`; `KeyReveal`; download.
- Auth/demo: `proxy.ts` → `updateSession`, `routes.ts`, `data/auth.ts`, `actions/demo.ts`.
- Admin: `app/admin/**`, `actions/admin.ts`.
- Contrato do COMPRAR: `<form action={addToCart}>` com `gameId`, `back`, `goTo`.

## 11. Riscos e contradições
1. Só 1 dos 6 jogos é destaque; limite de 5 nas consultas.
2. A nova home precisa manter `staticMode`, `owned` e o ramo `isOwned` do Hero ou o e2e (teste 1) quebra.
3. `staticHome()` acopla home, catálogo e testes.
4. `ssr:false` proibido em Server Component → wrapper client.
5. Lenis × `scroll-behavior: smooth` × carrossel horizontal.
6. `Header`/`Footer` globais; texto "Entrega parcial" no rodapé.
7. Na Vercel atual, COMPRAR só leva ao detalhe.
8. Sem CI.

## 12. Perguntas em aberto
Ver a mensagem de plano da Fase 0 (respondidas pelo dono do projeto antes da Fase 1).
