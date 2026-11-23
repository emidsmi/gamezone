/**
 * Modo estático (entrega parcial): o site roda só com os dados de exemplo embutidos em
 * src/data/static/catalog.json, sem Supabase. É ativado automaticamente quando NEXT_PUBLIC_SUPABASE_URL
 * não está definida (ex.: deploy na Vercel sem variáveis) ou com NEXT_PUBLIC_STATIC_MODE=true.
 * Usa só variáveis NEXT_PUBLIC_*, então servidor e navegador sempre concordam.
 */
export const isStaticMode = () => process.env.NEXT_PUBLIC_STATIC_MODE === "true" || !process.env.NEXT_PUBLIC_SUPABASE_URL;

/** Áreas que dependem de conta/banco e ficam para a versão completa (carrinho, pagamento, biblioteca, pedidos e desejos funcionam localmente no navegador). */
export const FULL_VERSION_PREFIXES = ["/perfil", "/admin", "/modo-admin", "/api/library", "/entrar", "/cadastro", "/recuperar-senha", "/redefinir-senha"];
