// Gera src/types/database.ts a partir das migrations (aplicadas em um Postgres WASM).
// Com Docker/Supabase CLI voce pode usar, alternativamente: npx supabase gen types typescript --local > src/types/database.ts
import { PGlite } from "@electric-sql/pglite";
import { pgcrypto } from "@electric-sql/pglite/contrib/pgcrypto";
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const db = new PGlite({ extensions: { pgcrypto } });
await db.exec(readFileSync(join(root, "tests/db/supabase-stubs.sql"), "utf8"));
const dir = join(root, "supabase/migrations");
for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) await db.exec(readFileSync(join(dir, f), "utf8"));

const enums = (await db.query(`select t.typname, array_agg(e.enumlabel order by e.enumsortorder) labels from pg_type t join pg_enum e on e.enumtypid = t.oid join pg_namespace n on n.oid = t.typnamespace where n.nspname = 'public' group by t.typname order by 1`)).rows;
const enumNames = new Set(enums.map((e) => e.typname));
const rels = (await db.query(`select c.relname, c.relkind from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relkind in ('r','v') order by 1`)).rows;
const cols = (await db.query(`select table_name, column_name, udt_name, is_nullable, column_default from information_schema.columns where table_schema = 'public' order by table_name, ordinal_position`)).rows;

const fks = (
  await db.query(`
select con.conname, cl.relname tbl, rf.relname ref,
  (select array_agg(a.attname order by k.ord) from unnest(con.conkey) with ordinality k(attnum, ord) join pg_attribute a on a.attrelid = con.conrelid and a.attnum = k.attnum) cols,
  (select array_agg(a.attname order by k.ord) from unnest(con.confkey) with ordinality k(attnum, ord) join pg_attribute a on a.attrelid = con.confrelid and a.attnum = k.attnum) refcols,
  exists (select 1 from pg_index i where i.indrelid = con.conrelid and i.indisunique and i.indpred is null and i.indnatts = array_length(con.conkey, 1) and i.indkey::int2[] @> con.conkey) one
from pg_constraint con
join pg_class cl on cl.oid = con.conrelid
join pg_class rf on rf.oid = con.confrelid
join pg_namespace n on n.oid = cl.relnamespace
where con.contype = 'f' and n.nspname = 'public'
order by cl.relname, con.conname`)
).rows;
const quoteList = (l) => l.map((c) => `"${c}"`).join(", ");
const relationships = (table) => {
  const rows = fks.filter((k) => k.tbl === table);
  if (!rows.length) return "[]";
  const items = rows.map((k) => `          { foreignKeyName: "${k.conname}"; columns: [${quoteList(k.cols)}]; isOneToOne: ${k.one}; referencedRelation: "${k.ref}"; referencedColumns: [${quoteList(k.refcols)}] }`);
  return `[\n${items.join(",\n")}\n        ]`;
};

const tsType = (udt) => {
  if (udt.startsWith("_")) return `${tsType(udt.slice(1))}[]`;
  if (enumNames.has(udt)) return `Database["public"]["Enums"]["${udt}"]`;
  if (["int2", "int4", "int8", "numeric", "float4", "float8"].includes(udt)) return "number";
  if (udt === "bool") return "boolean";
  if (["json", "jsonb"].includes(udt)) return "Json";
  return "string";
};

const block = (rows, fn) => rows.map(fn).join("\n");
let out = `// GERADO por scripts/gen-types.mjs a partir de supabase/migrations. Nao edite manualmente.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
`;
for (const t of rels.filter((r) => r.relkind === "r")) {
  const c = cols.filter((x) => x.table_name === t.relname);
  out += `      ${t.relname}: {
        Row: {
${block(c, (x) => `          ${x.column_name}: ${tsType(x.udt_name)}${x.is_nullable === "YES" ? " | null" : ""}`)}
        }
        Insert: {
${block(c, (x) => `          ${x.column_name}${x.is_nullable === "YES" || x.column_default ? "?" : ""}: ${tsType(x.udt_name)}${x.is_nullable === "YES" ? " | null" : ""}`)}
        }
        Update: {
${block(c, (x) => `          ${x.column_name}?: ${tsType(x.udt_name)}${x.is_nullable === "YES" ? " | null" : ""}`)}
        }
        Relationships: ${relationships(t.relname)}
      }
`;
}
out += `    }
    Views: {
`;
for (const v of rels.filter((r) => r.relkind === "v")) {
  const c = cols.filter((x) => x.table_name === v.relname);
  // Views do Postgres reportam todas as colunas como anulaveis; aqui tratamos as da vitrine como nao nulas.
  const nullable = new Set(["cover_path", "banner_path"]);
  out += `      ${v.relname}: {
        Row: {
${block(c, (x) => `          ${x.column_name}: ${tsType(x.udt_name)}${nullable.has(x.column_name) ? " | null" : ""}`)}
        }
        Relationships: []
      }
`;
}
out += `    }
    Functions: {
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean }
      create_order_from_cart: { Args: { p_method: Database["public"]["Enums"]["payment_method"] }; Returns: Json }
      confirm_payment: {
        Args: { p_payment_id: string; p_status: Database["public"]["Enums"]["payment_status"]; p_provider_ref?: string; p_reason?: string }
        Returns: Json
      }
    }
    Enums: {
${block(enums, (e) => `      ${e.typname}: ${e.labels.map((l) => `"${l}"`).join(" | ")}`)}
    }
    CompositeTypes: { [_ in never]: never }
  }
}

type PublicSchema = Database["public"];
export type Tables<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Row"];
export type TablesInsert<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Update"];
export type Enums<T extends keyof PublicSchema["Enums"]> = PublicSchema["Enums"][T];
`;
mkdirSync(join(root, "src/types"), { recursive: true });
writeFileSync(join(root, "src/types/database.ts"), out);
console.log("src/types/database.ts gerado.");
