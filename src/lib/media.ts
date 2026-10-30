import { isStaticMode } from "@/lib/static-mode";

const BUCKET = "game-media";

/** URL de um arquivo de capa/banner/galeria: Storage público do Supabase, ou /media (modo estático). */
export function mediaUrl(path: string | null | undefined): string {
  if (!path) return "/placeholder-cover.svg";
  if (/^https?:\/\//.test(path)) return path;
  if (isStaticMode()) return `/media/${path}`;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return `${base}/storage/v1/object/public/${BUCKET}/${path}`;
}

export const MEDIA_BUCKET = BUCKET;
