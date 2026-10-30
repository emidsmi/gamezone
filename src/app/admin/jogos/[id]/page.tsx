import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdminGame } from "@/data/admin";
import { getCategories, getPlatforms } from "@/data/games";
import { GameForm } from "@/components/GameForm";

export const metadata: Metadata = { title: "Admin · Editar jogo" };

export default async function EditGamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const [{ game, tagNames, platformIds }, categories, platforms] = await Promise.all([getAdminGame(id), getCategories(), getPlatforms()]);
  if (!game) notFound();
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-black">Editar: {game.title}</h1>
      <GameForm
        categories={categories}
        platforms={platforms}
        defaults={{ ...game, tags: tagNames.join(", "), platformIds, requirements: game.system_requirements as never }}
      />
    </div>
  );
}
