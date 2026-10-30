import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/data/auth";
import { getLibrary } from "@/data/user-data";
import { formatDate } from "@/lib/format";
import { mediaUrl } from "@/lib/media";
import { KeyReveal } from "@/components/KeyReveal";

export const metadata: Metadata = { title: "Minha biblioteca" };

export default async function LibraryPage() {
  await requireUser("/biblioteca");
  const items = await getLibrary();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-black">Minha biblioteca</h1>
      <p className="mt-1 text-muted">{items.length} {items.length === 1 ? "jogo" : "jogos"}</p>

      {items.length === 0 ? (
        <div className="card mt-6 p-10 text-center">
          <p className="font-bold">Sua biblioteca está vazia.</p>
          <p className="text-muted">Os jogos aparecem aqui assim que o pagamento é confirmado.</p>
          <Link href="/catalogo" className="btn btn-primary mt-4">Explorar jogos</Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {items.map((it) => {
            const game = it.games;
            const key = Array.isArray(it.activation_keys) ? it.activation_keys[0]?.key : (it.activation_keys as { key: string } | null)?.key;
            if (!game) return null;
            return (
              <li key={it.id} className="card flex flex-col gap-4 p-3 sm:flex-row sm:items-center" data-testid="library-item">
                <img src={mediaUrl(game.cover_path)} alt={`Capa de ${game.title}`} className="h-32 w-24 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Link href={`/jogo/${game.slug}`} className="block text-lg font-extrabold hover:text-brand">{game.title}</Link>
                  <p className="text-sm text-muted">{game.studio} · adquirido em {formatDate(it.acquired_at)}</p>
                  {key ? <KeyReveal value={key} /> : <p className="text-sm text-muted">Chave em geração…</p>}
                </div>
                <a href={`/api/library/${it.game_id}/download`} className="btn btn-primary sm:self-center" download>
                  Baixar
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
