import type { Metadata } from "next";
import { getAdminPromotions } from "@/data/admin";
import { createClient } from "@/lib/supabase/server";
import { deletePromotion, togglePromotion } from "@/actions/admin";
import { formatDateTime } from "@/lib/format";
import { isPromotionActive } from "@/services/pricing";
import { PromotionForm } from "@/components/AdminForms";

export const metadata: Metadata = { title: "Admin · Promoções" };

export default async function AdminPromotions() {
  const supabase = await createClient();
  const [promos, { data: games }] = await Promise.all([getAdminPromotions(), supabase.from("games").select("id, title").order("title")]);
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-black">Promoções</h1>
      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[34rem] text-sm">
            <thead><tr className="text-left text-muted"><th className="p-3 font-semibold">Jogo</th><th className="p-3 font-semibold">Desconto</th><th className="p-3 font-semibold">Período</th><th className="p-3 font-semibold">Situação</th><th className="p-3 text-right font-semibold">Ações</th></tr></thead>
            <tbody>
              {promos.map((p) => {
                const live = isPromotionActive(p);
                return (
                  <tr key={p.id} className="border-t border-line">
                    <td className="p-3 font-semibold">{(p.games as { title: string } | null)?.title}</td>
                    <td className="p-3">{p.discount_percent}%</td>
                    <td className="p-3 text-muted">{formatDateTime(p.starts_at)} → {formatDateTime(p.ends_at)}</td>
                    <td className="p-3">{live ? <span className="text-ok">No ar</span> : p.active ? "Agendada/encerrada" : "Pausada"}</td>
                    <td className="p-3">
                      <div className="flex justify-end gap-2">
                        <form action={togglePromotion}><input type="hidden" name="id" value={p.id} /><input type="hidden" name="active" value={String(!p.active)} /><button className="btn btn-ghost btn-sm">{p.active ? "Pausar" : "Ativar"}</button></form>
                        <form action={deletePromotion}><input type="hidden" name="id" value={p.id} /><button className="btn btn-danger btn-sm">Excluir</button></form>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {promos.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted">Nenhuma promoção cadastrada.</td></tr>}
            </tbody>
          </table>
        </div>
        <PromotionForm games={games ?? []} />
      </div>
    </div>
  );
}
