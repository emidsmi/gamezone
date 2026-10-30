import type { Metadata } from "next";
import Link from "next/link";
import { getAdminGames } from "@/data/admin";
import { deleteGame } from "@/actions/admin";
import { formatMoney } from "@/lib/format";
import { mediaUrl } from "@/lib/media";

export const metadata: Metadata = { title: "Admin · Jogos" };

export default async function AdminGames({ searchParams }: { searchParams: Promise<{ salvo?: string }> }) {
  const { salvo } = await searchParams;
  const games = await getAdminGames();
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-3xl font-black">Jogos <span className="text-lg font-semibold text-muted">({games.length})</span></h1>
        <Link href="/admin/jogos/novo" className="btn btn-primary">Novo jogo</Link>
      </div>
      {salvo && <p role="status" className="rounded-lg border border-ok/50 bg-ok/10 px-3 py-2 text-sm text-ok">Jogo salvo com sucesso.</p>}
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[40rem] text-sm">
          <thead><tr className="text-left text-muted"><th className="p-3 font-semibold">Jogo</th><th className="p-3 font-semibold">Categoria</th><th className="p-3 text-right font-semibold">Preço</th><th className="p-3 font-semibold">Status</th><th className="p-3 text-right font-semibold">Ações</th></tr></thead>
          <tbody>
            {games.map((g) => (
              <tr key={g.id} className="border-t border-line">
                <td className="p-3"><div className="flex items-center gap-3"><img src={mediaUrl(g.cover_path)} alt="" className="h-12 w-9 rounded object-cover" /><span className="font-semibold">{g.title}</span></div></td>
                <td className="p-3">{(g.categories as { name: string } | null)?.name}</td>
                <td className="p-3 text-right">{formatMoney(g.price_cents)}</td>
                <td className="p-3">{g.is_active ? "Ativo" : "Inativo"}{g.is_featured ? " · destaque" : ""}</td>
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/jogos/${g.id}`} className="btn btn-ghost btn-sm">Editar</Link>
                    <form action={deleteGame}><input type="hidden" name="id" value={g.id} /><button className="btn btn-danger btn-sm" aria-label={`Excluir ${g.title}`}>Excluir</button></form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
