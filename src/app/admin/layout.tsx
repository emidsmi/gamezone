import Link from "next/link";
import { requireAdmin } from "@/data/auth";

const LINKS = [
  { href: "/admin", label: "Indicadores" },
  { href: "/admin/jogos", label: "Jogos" },
  { href: "/admin/categorias", label: "Categorias" },
  { href: "/admin/promocoes", label: "Promoções" },
  { href: "/admin/pedidos", label: "Pedidos" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-widest text-gold">Painel administrativo</p>
      <nav aria-label="Administração" className="no-scrollbar mt-2 flex gap-1 overflow-x-auto border-b border-line pb-3">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold text-muted hover:bg-panel2 hover:text-fg">{l.label}</Link>
        ))}
      </nav>
      <div className="mt-6">{children}</div>
    </div>
  );
}
