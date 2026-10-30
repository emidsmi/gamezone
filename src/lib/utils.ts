export const slugify = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const cn = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(" ");

/** Chave de ativação: já vem formatada do banco (XXXXX-XXXXX-XXXXX-XXXXX). */
export const maskKey = (key: string) => key.replace(/[0-9A-F]{5}$/i, "•••••");
