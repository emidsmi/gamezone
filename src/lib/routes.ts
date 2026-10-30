export type Role = "customer" | "admin";

const PROTECTED_PREFIXES = ["/biblioteca", "/pedidos", "/perfil", "/checkout", "/carrinho", "/desejos"];
const AUTH_PAGES = ["/entrar", "/cadastro", "/recuperar-senha"];

const matches = (pathname: string, prefix: string) => pathname === prefix || pathname.startsWith(`${prefix}/`);

/**
 * Regra de acesso por perfil (visitante, cliente, admin). Retorna a rota de redirecionamento, se houver.
 * No modo demonstração não existe tela de login: as páginas de autenticação voltam para a home e
 * quem não é admin é levado à página que explica como ligar o "Modo admin".
 */
export function resolveAccess(pathname: string, user: { role: Role } | null, opts: { demo?: boolean } = {}): string | null {
  if (opts.demo) {
    if (AUTH_PAGES.some((p) => matches(pathname, p))) return "/";
    if (matches(pathname, "/admin") && user && user.role !== "admin") return "/modo-admin";
    return null;
  }
  if (matches(pathname, "/admin")) {
    if (!user) return `/entrar?next=${encodeURIComponent(pathname)}`;
    return user.role === "admin" ? null : "/";
  }
  if (PROTECTED_PREFIXES.some((p) => matches(pathname, p))) {
    return user ? null : `/entrar?next=${encodeURIComponent(pathname)}`;
  }
  if (user && AUTH_PAGES.some((p) => matches(pathname, p))) return "/";
  return null;
}

/** Evita open redirect: só aceita caminhos internos. */
export function safeNext(next: string | null | undefined, fallback = "/"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return fallback;
  return next;
}
