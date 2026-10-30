"use client";

import { useActionState, useState } from "react";
import { checkout } from "@/actions/shop";
import { initialState } from "@/lib/validation";
import { Field, FormMessage, SubmitButton } from "@/components/ui";

const METHODS = [
  { value: "card", label: "Cartão de crédito" },
  { value: "pix", label: "PIX" },
  { value: "boleto", label: "Boleto" },
] as const;

export function CheckoutForm({ free, totalLabel }: { free: boolean; totalLabel: string }) {
  const [state, action] = useActionState(checkout, initialState);
  const [method, setMethod] = useState<"card" | "pix" | "boleto">(free ? "pix" : "card");

  return (
    <form action={action} className="card space-y-4 p-4" noValidate={false}>
      {free ? (
        <>
          <input type="hidden" name="method" value="pix" />
          <p className="text-sm text-muted">Este pedido é gratuito: nenhum pagamento é necessário. Confirme para adicionar à biblioteca.</p>
        </>
      ) : (
        <>
          <fieldset>
            <legend className="mb-2 font-bold">Forma de pagamento</legend>
            <div className="flex flex-wrap gap-2">
              {METHODS.map((m) => (
                <label key={m.value} className={`cursor-pointer rounded-lg border px-4 py-2 text-sm font-semibold has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold ${method === m.value ? "border-brand bg-brand/10" : "border-line"}`}>
                  <input type="radio" name="method" value={m.value} checked={method === m.value} onChange={() => setMethod(m.value)} className="sr-only" />
                  {m.label}
                </label>
              ))}
            </div>
          </fieldset>

          {method === "card" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2"><Field label="Nome no cartão" name="cardName" state={state} autoComplete="cc-name" /></div>
              <div className="sm:col-span-2">
                <Field label="Número do cartão" name="cardNumber" state={state} autoComplete="cc-number" inputMode="numeric" placeholder="4242 4242 4242 4242" hint="Teste: 4242… aprova · 4000 0000 0000 0002 recusa · 4000 0000 0000 0003 pendente" />
              </div>
              <Field label="Validade (MM/AA)" name="cardExpiry" state={state} autoComplete="cc-exp" placeholder="12/30" maxLength={5} />
              <Field label="CVV" name="cardCvv" state={state} autoComplete="cc-csc" inputMode="numeric" maxLength={4} placeholder="123" />
            </div>
          )}
          {method === "pix" && <p className="rounded-lg bg-panel2 p-3 text-sm">Geraremos um código PIX copia e cola. Após o pagamento, o jogo é liberado automaticamente.</p>}
          {method === "boleto" && <p className="rounded-lg bg-panel2 p-3 text-sm">Geraremos a linha digitável do boleto. O jogo é liberado após a compensação.</p>}
        </>
      )}
      <FormMessage state={state} />
      <SubmitButton pending="Processando pagamento…" className="btn btn-primary w-full py-3">
        {free ? "Adicionar à biblioteca" : `Pagar ${totalLabel}`}
      </SubmitButton>
      <p className="text-center text-xs text-muted">Ambiente de demonstração: pagamento simulado, nenhum valor real é cobrado.</p>
    </form>
  );
}
