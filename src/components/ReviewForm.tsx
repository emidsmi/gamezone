"use client";

import { useActionState } from "react";
import { submitReview } from "@/actions/shop";
import { initialState } from "@/lib/validation";
import { FormMessage, SubmitButton } from "@/components/ui";

export function ReviewForm({ gameId, initialRating, initialComment }: { gameId: string; initialRating?: number; initialComment?: string }) {
  const [state, action] = useActionState(submitReview, initialState);
  return (
    <form action={action} className="card space-y-3 p-4">
      <input type="hidden" name="gameId" value={gameId} />
      <fieldset>
        <legend className="mb-1 text-sm font-semibold">Sua nota</legend>
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="flex cursor-pointer items-center gap-1 text-sm">
              <input type="radio" name="rating" value={n} defaultChecked={initialRating === n} required className="accent-lime-400" />
              {n}★
            </label>
          ))}
        </div>
        {state.fieldErrors?.rating && <p className="mt-1 text-sm text-danger">{state.fieldErrors.rating[0]}</p>}
      </fieldset>
      <div>
        <label htmlFor="comment" className="mb-1 block text-sm font-semibold">Comentário <span className="font-normal text-muted">(opcional)</span></label>
        <textarea id="comment" name="comment" rows={3} maxLength={2000} defaultValue={initialComment} className="input" placeholder="O que você achou do jogo?" />
      </div>
      <FormMessage state={state} />
      <SubmitButton pending="Publicando…">{initialRating ? "Atualizar avaliação" : "Publicar avaliação"}</SubmitButton>
    </form>
  );
}
