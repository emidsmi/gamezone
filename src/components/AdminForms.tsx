"use client";

import { useActionState } from "react";
import { saveCategory, savePromotion } from "@/actions/admin";
import { initialState } from "@/lib/validation";
import { Field, FormMessage, SubmitButton } from "@/components/ui";

export function CategoryForm() {
  const [state, action] = useActionState(saveCategory, initialState);
  return (
    <form action={action} className="card space-y-3 p-4">
      <h2 className="text-lg font-extrabold">Nova categoria</h2>
      <Field label="Nome" name="name" state={state} />
      <Field label="Slug" name="slug" state={state} required={false} hint="Opcional: gerado a partir do nome." />
      <FormMessage state={state} />
      <SubmitButton pending="Salvando…">Adicionar</SubmitButton>
    </form>
  );
}

export function PromotionForm({ games }: { games: { id: string; title: string }[] }) {
  const [state, action] = useActionState(savePromotion, initialState);
  const now = new Date();
  const local = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  const end = new Date(now.getTime() + 14 * 86400000);
  return (
    <form action={action} className="card space-y-3 p-4">
      <h2 className="text-lg font-extrabold">Nova promoção</h2>
      <div>
        <label htmlFor="gameId" className="mb-1 block text-sm font-semibold">Jogo</label>
        <select id="gameId" name="gameId" required defaultValue="" className="input">
          <option value="" disabled>Selecione…</option>
          {games.map((g) => <option key={g.id} value={g.id}>{g.title}</option>)}
        </select>
        {state.fieldErrors?.gameId && <p className="mt-1 text-sm text-danger">{state.fieldErrors.gameId[0]}</p>}
      </div>
      <Field label="Desconto (%)" name="discountPercent" type="number" state={state} hint="Entre 1 e 95." />
      <Field label="Início" name="startsAt" type="datetime-local" defaultValue={local(now)} state={state} />
      <Field label="Fim" name="endsAt" type="datetime-local" defaultValue={local(end)} state={state} />
      <FormMessage state={state} />
      <SubmitButton pending="Salvando…">Criar promoção</SubmitButton>
    </form>
  );
}
