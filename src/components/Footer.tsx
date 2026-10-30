import Link from "next/link";
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-panel/60">
      <div className="mx-auto grid max-w-[1400px] gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6">
        <div className="space-y-2">
          <Logo />
          <p className="text-sm text-muted">Sua loja de games, agora na internet. Compre, receba a chave na hora e baixe na biblioteca.</p>
        </div>
        <nav aria-label="Rodapé" className="space-y-2 text-sm">
          <p className="font-bold">Loja</p>
          <Link className="block text-muted hover:text-fg" href="/">Jogos em destaque</Link>
          <Link className="block text-muted hover:text-fg" href="/loja">Loja</Link>
          <Link className="block text-muted hover:text-fg" href="/catalogo">Catálogo completo</Link>
          <Link className="block text-muted hover:text-fg" href="/catalogo?promo=1">Promoções</Link>
          <Link className="block text-muted hover:text-fg" href="/biblioteca">Minha biblioteca</Link>
        </nav>
        <div className="space-y-2 text-sm text-muted">
          <p className="font-bold text-fg">Projeto acadêmico</p>
          <p>Entrega parcial: nesta pré-visualização o foco é o visual da loja. Pagamentos são simulados e todos os jogos, estúdios e capas são fictícios.</p>
        </div>
      </div>
      <p className="border-t border-line px-4 py-4 text-center text-xs text-muted">© 2026 GameZone Brasil · caso fictício de projeto acadêmico</p>
    </footer>
  );
}
