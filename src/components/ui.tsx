"use client";

import { useFormStatus } from "react-dom";
import type { ActionState } from "@/lib/validation";

export function SubmitButton({ children, pending, className = "btn btn-primary" }: { children: React.ReactNode; pending?: string; className?: string }) {
  const { pending: isPending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={isPending} aria-busy={isPending}>
      {isPending ? (pending ?? "Aguarde…") : children}
    </button>
  );
}

export function Field({
  label, name, type = "text", state, defaultValue, required = true, autoComplete, hint, placeholder, inputMode, maxLength,
}: {
  label: string; name: string; type?: string; state?: ActionState; defaultValue?: string; required?: boolean;
  autoComplete?: string; hint?: string; placeholder?: string; inputMode?: "numeric" | "text" | "email"; maxLength?: number;
}) {
  const errors = state?.fieldErrors?.[name];
  const id = `f-${name}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold">
        {label}
        {!required && <span className="font-normal text-muted"> (opcional)</span>}
      </label>
      <input
        id={id} name={name} type={type} defaultValue={defaultValue} required={required} autoComplete={autoComplete}
        placeholder={placeholder} inputMode={inputMode} maxLength={maxLength} className="input"
        aria-invalid={errors?.length ? true : undefined} aria-describedby={errors?.length ? `${id}-err` : hint ? `${id}-hint` : undefined}
      />
      {hint && !errors?.length && <p id={`${id}-hint`} className="mt-1 text-xs text-muted">{hint}</p>}
      {errors?.length ? <p id={`${id}-err`} className="mt-1 text-sm text-danger">{errors[0]}</p> : null}
    </div>
  );
}

export function FormMessage({ state }: { state: ActionState }) {
  if (!state.message) return null;
  return (
    <p role={state.ok ? "status" : "alert"} className={`rounded-lg border px-3 py-2 text-sm ${state.ok ? "border-ok/50 bg-ok/10 text-ok" : "border-danger/50 bg-danger/10 text-danger"}`}>
      {state.message}
    </p>
  );
}
