const KNOWN: Record<string, string> = {
  not_authenticated: "Faça login para continuar.",
  empty_cart: "Seu carrinho está vazio.",
  game_unavailable: "Um dos jogos do carrinho não está mais disponível.",
  already_owned: "Você já possui um dos jogos do carrinho. Remova-o para continuar.",
  invalid_method: "Forma de pagamento inválida para este pedido.",
  payment_closed: "Este pagamento já foi encerrado.",
  payment_not_found: "Pagamento não encontrado.",
  amount_mismatch: "O valor do pagamento não confere com o pedido.",
  order_not_pending: "Este pedido não está mais aguardando pagamento.",
  role_change_forbidden: "Você não tem permissão para alterar o perfil de acesso.",
  "Invalid login credentials": "E-mail ou senha incorretos.",
  "Email not confirmed": "Confirme seu e-mail antes de entrar.",
  "User already registered": "Já existe uma conta com este e-mail.",
};

const messageOf = (error: unknown): string | undefined =>
  typeof error === "string" ? error : error instanceof Error ? error.message : (error as { message?: string } | null)?.message;

/** Converte erros técnicos (Postgres/Supabase) em mensagens amigáveis em português. */
export function friendlyError(error: unknown, fallback = "Algo deu errado. Tente novamente em instantes."): string {
  const message = messageOf(error);
  if (!message) return fallback;
  for (const [key, text] of Object.entries(KNOWN)) if (message.includes(key)) return text;
  if (message.includes("row-level security")) return "Você não tem permissão para realizar esta ação.";
  if (message.includes("duplicate key")) return "Este registro já existe.";
  if (message.includes("violates foreign key")) return "Este item está em uso e não pode ser removido.";
  return fallback;
}

export type SetupProblem = { title: string; detail: string; fix: string };

/**
 * Diagnóstico de problemas de configuração/infra (mostrado nas telas de erro).
 * Reconhece: variáveis ausentes, Supabase inacessível, chave inválida, migrations não aplicadas, RLS e usuário demo ausente.
 */
export function diagnoseSetup(error: unknown): SetupProblem {
  const m = messageOf(error) ?? "";
  const raw = typeof error === "object" && error ? JSON.stringify(error) : m;
  const text = `${m} ${raw}`;
  if (text.includes("Variável de ambiente ausente"))
    return { title: "Supabase não configurado", detail: m, fix: "Copie .env.example para .env.local, preencha as 3 chaves e reinicie o servidor (npm run dev)." };
  if (text.includes("DEMO_USER_UNAVAILABLE"))
    return { title: "Usuário de demonstração não encontrado", detail: "O seed não foi aplicado ou o login demo falhou.", fix: "Aplique o seed (veja README, seção \"Rodar o seed de novo\") e rode npm run doctor." };
  if (/fetch failed|ECONNREFUSED|ENOTFOUND|ETIMEDOUT|Failed to fetch/i.test(text))
    return { title: "Não foi possível conectar ao Supabase", detail: "A URL configurada não respondeu.", fix: "Confira NEXT_PUBLIC_SUPABASE_URL em .env.local e se o projeto está ativo (projetos gratuitos pausam por inatividade). Rode npm run doctor." };
  if (/Invalid API key|invalid.*jwt|JWT/i.test(text))
    return { title: "Chave do Supabase inválida", detail: "A anon key ou a service role key foi recusada.", fix: "Copie as chaves em Project Settings > API e atualize .env.local." };
  if (/PGRST205|PGRST200|42P01|Could not find the (table|relationship)|does not exist/i.test(text))
    return { title: "Banco sem as tabelas do projeto", detail: "As migrations ainda não foram aplicadas nesse projeto Supabase.", fix: "Rode: npx supabase link --project-ref SEU_REF && npx supabase db push --include-seed" };
  if (/42501|permission denied|row-level security/i.test(text))
    return { title: "Permissão negada pelo banco (RLS)", detail: "As políticas de leitura pública não estão ativas.", fix: "Reaplique as migrations (supabase/migrations/*_rls.sql) e rode npm run doctor." };
  return { title: "Não foi possível carregar os dados", detail: m || "Erro desconhecido.", fix: "Rode npm run doctor para diagnosticar a configuração." };
}

/** Transforma o objeto de erro do PostgREST em um Error legível (evita o overlay "Error: {json}"). */
export function toError(error: unknown): Error {
  if (error instanceof Error) return error;
  const e = error as { message?: string; details?: string; code?: string } | null;
  return new Error([e?.code, e?.message, e?.details].filter(Boolean).join(" · ") || "Erro desconhecido");
}
