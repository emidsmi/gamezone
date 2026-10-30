import Link from "next/link";
import { getCurrentUser } from "@/data/auth";
import { getUserFlags } from "@/data/user-data";
import { signOut } from "@/actions/auth";
import { isDemoMode } from "@/lib/demo";
import { isStaticMode } from "@/lib/static-mode";
import { Logo } from "@/components/Logo";
import { DemoSwitch } from "@/components/DemoSwitch";

const NAV = [
  { href: "/", label: "Início" },
  { href: "/loja", label: "Loja" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/catalogo?promo=1", label: "Promoções" },
  { href: "/catalogo?free=1", label: "Grátis" },
];

export async function Header() {
  const staticMode = isStaticMode();
  const demo = isDemoMode() && !staticMode;
  const user = await getCurrentUser();
  const flags = await getUserFlags().catch(() => ({ loggedIn: false, owned: [], wishlist: [], cart: [] }));
  const isAdmin = user?.profile.role === "admin";

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
        <Link href="/" aria-label="GameZone Brasil, página inicial" className="shrink-0"><Logo /></Link>

        <nav aria-label="Principal" className="no-scrollbar order-4 flex w-full gap-1 overflow-x-auto md:order-none md:w-auto">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold text-muted hover:bg-panel2 hover:text-fg">{n.label}</Link>
          ))}
        </nav>

        <form action="/catalogo" role="search" className="order-3 w-full md:order-none md:ml-auto md:w-auto md:min-w-0 md:max-w-sm md:flex-1">
          <label htmlFor="header-search" className="sr-only">Buscar jogos</label>
          <input id="header-search" name="q" type="search" placeholder="Buscar jogos, estúdios…" className="input !min-h-10 !py-1.5" />
        </form>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          {staticMode && <span className="hidden rounded-full border border-gold/50 bg-gold/10 px-3 py-1 text-xs font-bold text-gold sm:inline">Pré-visualização</span>}
          {demo && <DemoSwitch isAdmin={isAdmin} />}
          <Link href="/desejos" className="relative rounded-lg px-2.5 py-2 hover:bg-panel2" aria-label={`Lista de desejos${flags.wishlist.length ? `, ${flags.wishlist.length} itens` : ""}`}>
            <span aria-hidden="true">♡</span>
          </Link>
          <Link href="/carrinho" className="relative rounded-lg px-2.5 py-2 hover:bg-panel2" aria-label={`Carrinho${flags.cart.length ? `, ${flags.cart.length} itens` : ", vazio"}`}>
            <span aria-hidden="true">🛒</span>
            {flags.cart.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-xs font-extrabold text-black" aria-hidden="true">{flags.cart.length}</span>
            )}
          </Link>

          {user ? (
            <details className="relative">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-semibold hover:bg-panel2">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-brand text-sm font-black text-black" aria-hidden="true">{user.profile.display_name.charAt(0).toUpperCase()}</span>
                <span className="hidden max-w-28 truncate sm:inline">{user.profile.display_name}</span>
              </summary>
              <div className="card absolute right-0 mt-2 w-56 p-2 shadow-2xl">
                {demo && <p className="px-3 py-1 text-xs text-muted">Modo demonstração · {isAdmin ? "administrador" : "cliente"}</p>}
                <Link className="block rounded-lg px-3 py-2 text-sm hover:bg-panel2" href="/biblioteca">Minha biblioteca</Link>
                <Link className="block rounded-lg px-3 py-2 text-sm hover:bg-panel2" href="/pedidos">Meus pedidos</Link>
                <Link className="block rounded-lg px-3 py-2 text-sm hover:bg-panel2" href="/desejos">Lista de desejos</Link>
                {!demo && <Link className="block rounded-lg px-3 py-2 text-sm hover:bg-panel2" href="/perfil">Perfil</Link>}
                {isAdmin && <Link className="block rounded-lg px-3 py-2 text-sm font-bold text-gold hover:bg-panel2" href="/admin">Painel admin</Link>}
                {!demo && <form action={signOut}><button className="w-full rounded-lg px-3 py-2 text-left text-sm text-danger hover:bg-panel2">Sair</button></form>}
              </div>
            </details>
          ) : (
            !demo && !staticMode && (
              <>
                <Link href="/entrar" className="btn btn-ghost btn-sm">Entrar</Link>
                <Link href="/cadastro" className="btn btn-primary btn-sm hidden sm:inline-flex">Criar conta</Link>
              </>
            )
          )}
        </div>
      </div>
    </header>
  );
}
