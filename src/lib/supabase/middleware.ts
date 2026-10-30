import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";
import { hasSupabaseEnv } from "@/lib/env";
import { FULL_VERSION_PREFIXES, isStaticMode } from "@/lib/static-mode";
import { DEMO_ACCOUNTS, DEMO_ROLE_COOKIE, isDemoMode, parseDemoRole } from "@/lib/demo";
import { resolveAccess, type Role } from "@/lib/routes";

/** Renova a sessão do Supabase, entra como usuário demo (se DEMO_MODE) e protege as rotas por perfil. */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Modo estático (entrega parcial): sem Supabase; áreas de conta/compra levam à página "em breve".
  if (isStaticMode() || !hasSupabaseEnv()) {
    const { pathname } = request.nextUrl;
    if (FULL_VERSION_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
      const url = request.nextUrl.clone();
      url.pathname = "/em-breve";
      url.search = `?area=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }
    return response;
  }

  const supabase = createServerClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(list) {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const demo = isDemoMode();
  let user: { id: string } | null = null;
  try {
    ({ data: { user } } = await supabase.auth.getUser());

    if (!user && demo) {
      // Sessão criada no servidor com o usuário de demonstração escolhido (cliente ou admin).
      const account = DEMO_ACCOUNTS[parseDemoRole(request.cookies.get(DEMO_ROLE_COOKIE)?.value)];
      const { data } = await supabase.auth.signInWithPassword(account);
      user = data.user;
    }
  } catch {
    // Supabase inacessível: segue sem usuário; as páginas mostram o estado de erro.
  }

  let role: Role | null = null;
  const { pathname } = request.nextUrl;
  if (user && pathname.startsWith("/admin")) {
    try {
      const { data } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
      role = data?.role ?? "customer";
    } catch {
      role = "customer";
    }
  }

  const redirectTo = resolveAccess(pathname, user ? { role: role ?? "customer" } : null, { demo });
  if (redirectTo) {
    const url = request.nextUrl.clone();
    const [path, query] = redirectTo.split("?");
    url.pathname = path;
    url.search = query ? `?${query}` : "";
    const redirect = NextResponse.redirect(url);
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    return redirect;
  }
  return response;
}
