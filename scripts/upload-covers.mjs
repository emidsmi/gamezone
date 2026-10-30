// Envia as capas, banners e capturas SVG de supabase/seed-assets para o bucket publico "game-media".
// Uso: npm run db:covers   (le NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY de .env.local)
import { createClient } from "@supabase/supabase-js";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const BUCKET = "game-media";
const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "supabase", "seed-assets");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY em .env.local antes de rodar este script.");
  process.exit(1);
}
if (!existsSync(dir)) {
  console.error("Pasta supabase/seed-assets nao encontrada. Rode: npm run db:seed:generate");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

// Mesmo mapeamento usado pelo seed.sql (cover_path / banner_path / gallery_paths)
const targetPath = (file) => {
  if (file.endsWith("-cover.svg")) return `covers/${file}`;
  if (file.endsWith("-banner.svg")) return `banners/${file}`;
  return `shots/${file}`;
};

const { data: buckets, error: listError } = await supabase.storage.listBuckets();
if (listError) {
  console.error("Nao foi possivel acessar o Storage:", listError.message);
  process.exit(1);
}
if (!buckets.some((b) => b.id === BUCKET)) {
  const { error } = await supabase.storage.createBucket(BUCKET, { public: true, fileSizeLimit: 5 * 1024 * 1024 });
  if (error) {
    console.error("Falha ao criar o bucket:", error.message);
    process.exit(1);
  }
  console.log(`Bucket "${BUCKET}" criado.`);
}

const files = readdirSync(dir).filter((f) => f.endsWith(".svg"));
let ok = 0;
const failures = [];
const queue = [...files];

async function worker() {
  while (queue.length) {
    const file = queue.shift();
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(targetPath(file), readFileSync(join(dir, file)), { contentType: "image/svg+xml", cacheControl: "3600", upsert: true });
    if (error) failures.push(`${file}: ${error.message}`);
    else ok++;
    if ((ok + failures.length) % 25 === 0) console.log(`  ${ok + failures.length}/${files.length}`);
  }
}
await Promise.all(Array.from({ length: 8 }, worker));

console.log(`\nEnviados: ${ok}/${files.length}`);
if (failures.length) {
  console.error("Falhas:\n" + failures.join("\n"));
  process.exit(1);
}

// Verificacao: o primeiro arquivo precisa estar acessivel publicamente
const sample = targetPath(files[0]);
const res = await fetch(`${url}/storage/v1/object/public/${BUCKET}/${sample}`, { method: "HEAD" });
console.log(res.ok ? `Verificado: ${url}/storage/v1/object/public/${BUCKET}/${sample}` : `ATENCAO: URL publica retornou ${res.status}. O bucket e publico?`);
process.exit(res.ok ? 0 : 1);
