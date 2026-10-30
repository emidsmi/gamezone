import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Download simulado: só entrega o "instalador" se o jogo estiver na biblioteca do usuário (RLS). */
export async function GET(_req: Request, { params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(gameId)) return new NextResponse("Jogo inválido.", { status: 400 });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new NextResponse("Faça login para baixar.", { status: 401 });

  const { data } = await supabase
    .from("library_items")
    .select("games(title, slug), activation_keys(key)")
    .eq("user_id", user.id)
    .eq("game_id", gameId)
    .maybeSingle();
  if (!data?.games) return new NextResponse("Você não possui este jogo.", { status: 403 });

  const key = Array.isArray(data.activation_keys) ? data.activation_keys[0]?.key : (data.activation_keys as { key: string } | null)?.key;
  const body = [
    `GameZone Brasil — instalador simulado`,
    `Jogo: ${data.games.title}`,
    `Chave de ativação: ${key ?? "indisponível"}`,
    ``,
    `Este arquivo é apenas uma demonstração do download.`,
  ].join("\r\n");

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${data.games.slug}-instalador.txt"`,
      "Cache-Control": "private, no-store",
    },
  });
}
