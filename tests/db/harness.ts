import { PGlite } from "@electric-sql/pglite";
import { pgcrypto } from "@electric-sql/pglite/contrib/pgcrypto";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(__dirname, "../..");

// Substitutos minimos do que o Supabase fornece (auth, storage e papeis).
const SUPABASE_STUBS = readFileSync(path.join(ROOT, "tests/db/supabase-stubs.sql"), "utf8");

export function migrationsSql(): string[] {
  const dir = path.join(ROOT, "supabase/migrations");
  return readdirSync(dir).filter((f) => f.endsWith(".sql")).sort().map((f) => readFileSync(path.join(dir, f), "utf8"));
}

export const seedSql = () => readFileSync(path.join(ROOT, "supabase/seed.sql"), "utf8");

export async function createDb(opts: { seed?: boolean } = {}) {
  const db = new PGlite({ extensions: { pgcrypto } });
  await db.exec(SUPABASE_STUBS);
  for (const sql of migrationsSql()) await db.exec(sql);
  if (opts.seed) await db.exec(seedSql());
  return db;
}

export type Actor = { role: "anon" | "authenticated" | "service_role"; uid?: string };

/** Executa uma consulta com o papel/JWT informados (simula PostgREST) e volta para o superusuario. */
export async function as<T = Record<string, unknown>>(db: PGlite, actor: Actor, sql: string, params: unknown[] = []) {
  await db.exec(`set role ${actor.role}; select set_config('request.jwt.claim.sub', '${actor.uid ?? ""}', false);`);
  try {
    const res = await db.query<T>(sql, params);
    return res.rows;
  } finally {
    await db.exec(`reset role; select set_config('request.jwt.claim.sub', '', false);`);
  }
}

export const IDS = {
  admin: "00000000-0000-4000-8000-0000000000a1",
  ana: "00000000-0000-4000-8000-0000000000c1",
  bruno: "00000000-0000-4000-8000-0000000000c2",
  carla: "00000000-0000-4000-8000-0000000000c3",
  demo: "00000000-0000-4000-8000-0000000000e1",
};
