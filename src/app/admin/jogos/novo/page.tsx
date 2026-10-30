import type { Metadata } from "next";
import { getCategories, getPlatforms } from "@/data/games";
import { GameForm } from "@/components/GameForm";

export const metadata: Metadata = { title: "Admin · Novo jogo" };

export default async function NewGamePage() {
  const [categories, platforms] = await Promise.all([getCategories(), getPlatforms()]);
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-black">Novo jogo</h1>
      <GameForm categories={categories} platforms={platforms} />
    </div>
  );
}
