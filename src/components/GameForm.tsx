"use client";

import { useActionState } from "react";
import { saveGame } from "@/actions/admin";
import { initialState } from "@/lib/validation";
import { Field, FormMessage, SubmitButton } from "@/components/ui";

type Req = { os?: string; cpu?: string; ram?: string; gpu?: string; storage?: string };
export type GameFormDefaults = {
  id?: string; title?: string; slug?: string; short_description?: string; description?: string; category_id?: string; studio?: string; publisher?: string;
  price_cents?: number; release_date?: string; age_rating?: number; is_featured?: boolean; is_active?: boolean;
  tags?: string; platformIds?: string[]; requirements?: { minimum?: Req; recommended?: Req };
};

export function GameForm({ defaults = {}, categories, platforms }: { defaults?: GameFormDefaults; categories: { id: string; name: string }[]; platforms: { id: string; name: string }[] }) {
  const [state, action] = useActionState(saveGame, initialState);
  const min = defaults.requirements?.minimum ?? {};
  const rec = defaults.requirements?.recommended ?? {};
  const err = (n: string) => state.fieldErrors?.[n]?.[0];

  return (
    <form action={action} className="space-y-6">
      {defaults.id && <input type="hidden" name="id" value={defaults.id} />}
      <div className="card grid gap-4 p-4 sm:grid-cols-2">
        <Field label="Título" name="title" defaultValue={defaults.title} state={state} />
        <Field label="Slug (URL)" name="slug" defaultValue={defaults.slug} state={state} hint="Letras minúsculas, números e hífen." />
        <div className="sm:col-span-2"><Field label="Resumo" name="shortDescription" defaultValue={defaults.short_description} state={state} /></div>
        <div className="sm:col-span-2">
          <label htmlFor="description" className="mb-1 block text-sm font-semibold">Descrição</label>
          <textarea id="description" name="description" rows={6} required defaultValue={defaults.description} className="input" aria-invalid={err("description") ? true : undefined} />
          {err("description") && <p className="mt-1 text-sm text-danger">{err("description")}</p>}
        </div>
        <div>
          <label htmlFor="categoryId" className="mb-1 block text-sm font-semibold">Categoria</label>
          <select id="categoryId" name="categoryId" required defaultValue={defaults.category_id ?? ""} className="input">
            <option value="" disabled>Selecione…</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {err("categoryId") && <p className="mt-1 text-sm text-danger">{err("categoryId")}</p>}
        </div>
        <div>
          <label htmlFor="ageRating" className="mb-1 block text-sm font-semibold">Classificação indicativa</label>
          <select id="ageRating" name="ageRating" defaultValue={String(defaults.age_rating ?? 0)} className="input">
            {[0, 10, 12, 14, 16, 18].map((a) => <option key={a} value={a}>{a === 0 ? "Livre" : `${a} anos`}</option>)}
          </select>
        </div>
        <Field label="Estúdio" name="studio" defaultValue={defaults.studio} state={state} />
        <Field label="Publisher" name="publisher" defaultValue={defaults.publisher} state={state} />
        <Field label="Preço (R$)" name="priceReais" type="number" defaultValue={defaults.price_cents !== undefined ? (defaults.price_cents / 100).toFixed(2) : undefined} state={state} hint="Use 0 para jogos gratuitos." />
        <Field label="Data de lançamento" name="releaseDate" type="date" defaultValue={defaults.release_date} state={state} />
        <div className="sm:col-span-2"><Field label="Tags" name="tags" defaultValue={defaults.tags} state={state} required={false} hint="Separe por vírgula. Ex.: Cooperativo, Pixel art, Fantasia" /></div>
        <fieldset className="sm:col-span-2">
          <legend className="mb-1 text-sm font-semibold">Plataformas</legend>
          <div className="flex flex-wrap gap-4">
            {platforms.map((p) => (
              <label key={p.id} className="flex items-center gap-2 text-sm"><input type="checkbox" name="platformIds" value={p.id} defaultChecked={defaults.platformIds?.includes(p.id)} className="h-4 w-4 accent-lime-400" />{p.name}</label>
            ))}
          </div>
        </fieldset>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isActive" defaultChecked={defaults.is_active ?? true} className="h-4 w-4 accent-lime-400" /> Ativo na loja</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isFeatured" defaultChecked={defaults.is_featured} className="h-4 w-4 accent-lime-400" /> Destaque no hero da home</label>
      </div>

      <div className="card grid gap-4 p-4 sm:grid-cols-2">
        <h2 className="text-lg font-extrabold sm:col-span-2">Imagens</h2>
        <div><label htmlFor="cover" className="mb-1 block text-sm font-semibold">Capa (retrato)</label><input id="cover" name="cover" type="file" accept="image/svg+xml,image/png,image/jpeg,image/webp" className="input" /></div>
        <div><label htmlFor="banner" className="mb-1 block text-sm font-semibold">Banner (paisagem)</label><input id="banner" name="banner" type="file" accept="image/svg+xml,image/png,image/jpeg,image/webp" className="input" /></div>
        <div className="sm:col-span-2"><label htmlFor="gallery" className="mb-1 block text-sm font-semibold">Galeria (adiciona novas imagens)</label><input id="gallery" name="gallery" type="file" multiple accept="image/svg+xml,image/png,image/jpeg,image/webp" className="input" /></div>
        <p className="text-xs text-muted sm:col-span-2">SVG, PNG, JPG ou WebP, até 5 MB cada. Enviadas ao bucket público game-media do Supabase Storage.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {([["Min", "Requisitos mínimos", min], ["Rec", "Requisitos recomendados", rec]] as const).map(([p, title, r]) => (
          <div key={p} className="card space-y-3 p-4">
            <h2 className="text-lg font-extrabold">{title}</h2>
            <Field label="Sistema" name={`req${p}Os`} defaultValue={r.os} state={state} required={false} />
            <Field label="Processador" name={`req${p}Cpu`} defaultValue={r.cpu} state={state} required={false} />
            <Field label="Memória" name={`req${p}Ram`} defaultValue={r.ram} state={state} required={false} />
            <Field label="Placa de vídeo" name={`req${p}Gpu`} defaultValue={r.gpu} state={state} required={false} />
            <Field label="Armazenamento" name={`req${p}Storage`} defaultValue={r.storage} state={state} required={false} />
          </div>
        ))}
      </div>

      <FormMessage state={state} />
      <SubmitButton pending="Salvando…">Salvar jogo</SubmitButton>
    </form>
  );
}
