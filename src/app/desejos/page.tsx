import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/data/auth";
import { getUserFlags, getWishlistGames } from "@/data/user-data";
import { GameCard } from "@/components/GameCard";

export const metadata: Metadata = { title: "Lista de desejos" };

export default async function WishlistPage() {
  await requireUser("/desejos");
  const [games, flags] = await Promise.all([getWishlistGames(), getUserFlags()]);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-black">Lista de desejos</h1>
      {games.length === 0 ? (
        <div className="card mt-6 p-10 text-center">
          <p className="font-bold">Nenhum jogo na sua lista.</p>
          <p className="text-muted">Toque no ♡ de um jogo para guardá-lo aqui.</p>
          <Link href="/catalogo" className="btn btn-primary mt-4">Explorar jogos</Link>
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {games.map((g) => <li key={g.id}><GameCard game={g} flags={flags} back="/desejos" fluid /></li>)}
        </ul>
      )}
    </div>
  );
}
