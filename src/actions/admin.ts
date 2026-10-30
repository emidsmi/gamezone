"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/data/auth";
import { friendlyError } from "@/lib/errors";
import { slugify } from "@/lib/utils";
import { categorySchema, formToObject, gameSchema, promotionSchema, zodState, type ActionState } from "@/lib/validation";
import { MEDIA_BUCKET } from "@/lib/media";

const MAX_BYTES = 5 * 1024 * 1024;
const TYPES: Record<string, string> = { "image/svg+xml": "svg", "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" };

type Supabase = Awaited<ReturnType<typeof createClient>>;

async function uploadImage(supabase: Supabase, file: FormDataEntryValue | null, folder: string, slug: string): Promise<string | null> {
  if (!(file instanceof File) || file.size === 0) return null;
  const ext = TYPES[file.type];
  if (!ext) throw new Error("Formato de imagem inválido. Use SVG, PNG, JPG ou WebP.");
  if (file.size > MAX_BYTES) throw new Error("Imagem maior que 5 MB.");
  const path = `${folder}/${slug}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  return path;
}

const reqFields = (v: Record<string, string>, p: "Min" | "Rec") => ({
  os: v[`req${p}Os`], cpu: v[`req${p}Cpu`], ram: v[`req${p}Ram`], gpu: v[`req${p}Gpu`], storage: v[`req${p}Storage`],
});

export async function saveGame(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const raw = formToObject(formData);
  raw.platformIds = formData.getAll("platformIds");
  raw.isFeatured = formData.get("isFeatured") === "on" ? "true" : "";
  raw.isActive = formData.get("isActive") === "on" ? "true" : "";
  const parsed = gameSchema.safeParse(raw);
  if (!parsed.success) return zodState(parsed.error);
  const v = parsed.data;
  const strings = v as unknown as Record<string, string>;

  const supabase = await createClient();
  try {
    const existingId = v.id || undefined;
    let current: { cover_path: string | null; banner_path: string | null; gallery_paths: string[] } | null = null;
    if (existingId) {
      const { data } = await supabase.from("games").select("cover_path, banner_path, gallery_paths").eq("id", existingId).maybeSingle();
      current = data;
    }

    const cover = await uploadImage(supabase, formData.get("cover"), "covers", v.slug);
    const banner = await uploadImage(supabase, formData.get("banner"), "banners", v.slug);
    const galleryFiles = formData.getAll("gallery");
    const gallery: string[] = [];
    for (const f of galleryFiles) {
      const p = await uploadImage(supabase, f, "shots", v.slug);
      if (p) gallery.push(p);
    }

    const row = {
      slug: v.slug,
      title: v.title,
      short_description: v.shortDescription,
      description: v.description,
      category_id: v.categoryId,
      studio: v.studio,
      publisher: v.publisher,
      price_cents: Math.round(v.priceReais * 100),
      release_date: v.releaseDate,
      age_rating: v.ageRating,
      is_featured: v.isFeatured,
      is_active: v.isActive,
      system_requirements: { minimum: reqFields(strings, "Min"), recommended: reqFields(strings, "Rec") },
      cover_path: cover ?? current?.cover_path ?? null,
      banner_path: banner ?? current?.banner_path ?? null,
      gallery_paths: gallery.length ? [...(current?.gallery_paths ?? []), ...gallery] : (current?.gallery_paths ?? []),
    };

    let gameId = existingId;
    if (gameId) {
      const { error } = await supabase.from("games").update(row).eq("id", gameId);
      if (error) throw error;
    } else {
      const { data, error } = await supabase.from("games").insert(row).select("id").single();
      if (error) throw error;
      gameId = data.id;
    }

    // Tags (separadas por vírgula) e plataformas substituem as anteriores.
    const names = [...new Set(v.tags.split(",").map((t) => t.trim()).filter(Boolean))];
    await supabase.from("game_tags").delete().eq("game_id", gameId!);
    if (names.length) {
      const { error: tagErr } = await supabase.from("tags").upsert(names.map((name) => ({ name, slug: slugify(name) })), { onConflict: "slug" });
      if (tagErr) throw tagErr;
      const { data: tagRows } = await supabase.from("tags").select("id").in("slug", names.map(slugify));
      if (tagRows?.length) await supabase.from("game_tags").insert(tagRows.map((t) => ({ game_id: gameId!, tag_id: t.id })));
    }
    await supabase.from("game_platforms").delete().eq("game_id", gameId!);
    if (v.platformIds.length) await supabase.from("game_platforms").insert(v.platformIds.map((platform_id) => ({ game_id: gameId!, platform_id })));
  } catch (e) {
    return { ok: false, message: friendlyError(e, e instanceof Error && !e.message.includes("duplicate") ? e.message : "Não foi possível salvar o jogo.") };
  }

  revalidatePath("/", "layout");
  redirect("/admin/jogos?salvo=1");
}

export async function deleteGame(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const id = String(formData.get("id"));
  // Jogos já vendidos não podem ser apagados (FK em order_items): apenas desativados.
  const { error } = await supabase.from("games").delete().eq("id", id);
  if (error) await supabase.from("games").update({ is_active: false }).eq("id", id);
  revalidatePath("/", "layout");
  redirect("/admin/jogos");
}

export async function saveCategory(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const raw = formToObject(formData);
  if (!raw.slug && typeof raw.name === "string") raw.slug = slugify(raw.name);
  const parsed = categorySchema.safeParse(raw);
  if (!parsed.success) return zodState(parsed.error);
  const { id, name, slug } = parsed.data;
  const supabase = await createClient();
  const { error } = id ? await supabase.from("categories").update({ name, slug }).eq("id", id) : await supabase.from("categories").insert({ name, slug });
  if (error) return { ok: false, message: friendlyError(error, "Não foi possível salvar a categoria.") };
  revalidatePath("/", "layout");
  return { ok: true, message: "Categoria salva." };
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", String(formData.get("id")));
  revalidatePath("/", "layout");
  redirect(error ? "/admin/categorias?erro=em-uso" : "/admin/categorias");
}

export async function savePromotion(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = promotionSchema.safeParse(formToObject(formData));
  if (!parsed.success) return zodState(parsed.error);
  const v = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase.from("promotions").insert({
    game_id: v.gameId,
    discount_percent: v.discountPercent,
    starts_at: new Date(v.startsAt).toISOString(),
    ends_at: new Date(v.endsAt).toISOString(),
  });
  if (error) return { ok: false, message: friendlyError(error, "Não foi possível criar a promoção.") };
  revalidatePath("/", "layout");
  return { ok: true, message: "Promoção criada." };
}

export async function togglePromotion(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("promotions").update({ active: formData.get("active") === "true" }).eq("id", String(formData.get("id")));
  revalidatePath("/", "layout");
}

export async function deletePromotion(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("promotions").delete().eq("id", String(formData.get("id")));
  revalidatePath("/", "layout");
}
