import { beforeAll, describe, expect, it } from "vitest";
import type { PGlite } from "@electric-sql/pglite";
import { as, createDb, IDS } from "./harness";

let db: PGlite;

beforeAll(async () => {
  db = await createDb({ seed: true });
});

const gameId = async (slug: string) =>
  (await db.query<{ id: string }>("select id from public.games where slug = $1", [slug])).rows[0].id;

async function checkout(uid: string, slugs: string[], method = "card") {
  await as(db, { role: "authenticated", uid }, "delete from public.cart_items");
  for (const s of slugs) {
    await as(db, { role: "authenticated", uid }, `insert into public.carts (user_id) values ($1) on conflict (user_id) do nothing`, [uid]);
    await as(db, { role: "authenticated", uid }, `insert into public.cart_items (cart_id, game_id) select c.id, $2 from public.carts c where c.user_id = $1 on conflict do nothing`, [uid, await gameId(s)]);
  }
  const [row] = await as<{ r: { order_id: string; payment_id: string; total_cents: number } }>(
    db, { role: "authenticated", uid }, `select public.create_order_from_cart($1::public.payment_method) as r`, [method],
  );
  return row.r;
}

describe("seed", () => {
  it("cria 41 jogos, 4+ categorias e usuarios de teste", async () => {
    const g = await db.query<{ n: number }>("select count(*)::int n from public.games");
    expect(g.rows[0].n).toBeGreaterThanOrEqual(40);
    const u = await db.query<{ n: number }>("select count(*)::int n from public.profiles where role = 'admin'");
    expect(u.rows[0].n).toBe(1);
    const rv = await db.query<{ n: number }>("select min(review_count)::int n from public.games");
    expect(rv.rows[0].n).toBeGreaterThanOrEqual(3);
  });

  it("compras do seed geram biblioteca e chaves unicas", async () => {
    const lib = await db.query<{ n: number; k: number }>(
      "select count(*)::int n, (select count(distinct key) from public.activation_keys)::int k from public.library_items",
    );
    expect(lib.rows[0].n).toBeGreaterThan(5);
    expect(lib.rows[0].k).toBe(lib.rows[0].n);
  });

  it("calcula preco final com promocao vigente", async () => {
    const [g] = (await db.query<{ price_cents: number; final_price_cents: number; discount_percent: number }>(
      "select price_cents, final_price_cents, discount_percent from public.catalog_games where slug = 'lamina-do-eclipse'",
    )).rows;
    expect(g.discount_percent).toBe(25);
    expect(g.final_price_cents).toBe(g.price_cents - Math.floor((g.price_cents * 25) / 100));
  });
});

describe("modo demonstracao", () => {
  it("usuario demo existe, com biblioteca, chaves e lista de desejos", async () => {
    const lib = await as<{ title: string }>(db, { role: "authenticated", uid: IDS.demo }, "select g.title from public.library_items l join public.games g on g.id = l.game_id order by l.acquired_at desc");
    expect(lib).toHaveLength(3);
    expect(lib[0].title).toBe("Crônicas de Valdoran"); // mais recente => base de "Porque você jogou X"
    const keys = await as(db, { role: "authenticated", uid: IDS.demo }, "select key from public.activation_keys");
    expect(keys).toHaveLength(3);
    expect(await as(db, { role: "authenticated", uid: IDS.demo }, "select 1 from public.wishlists")).toHaveLength(3);
  });

  it("usuario demo continua sem poder liberar jogo sem pagamento aprovado", async () => {
    const demo = { role: "authenticated", uid: IDS.demo } as const;
    await expect(as(db, demo, "insert into public.library_items (user_id, game_id, order_id) select $1, g.id, (select id from public.orders where user_id = $1 limit 1) from public.games g where slug = 'turbo-quartzo'", [IDS.demo])).rejects.toThrow();
    await expect(as(db, demo, "select public.confirm_payment(gen_random_uuid(), 'approved')")).rejects.toThrow(/permission denied/);
  });

  it("o seed pode rodar de novo sobre um banco ja populado", async () => {
    const { createDb, seedSql } = await import("./harness");
    const fresh = await createDb({ seed: true });
    await fresh.exec(seedSql());
    const g = await fresh.query<{ n: number }>("select count(*)::int n from public.games");
    const u = await fresh.query<{ n: number }>("select count(*)::int n from auth.users where email like '%@pixelporto.test'");
    const l = await fresh.query<{ n: number }>("select count(*)::int n from public.library_items");
    expect(g.rows[0].n).toBe(41);
    expect(u.rows[0].n).toBe(15);
    expect(l.rows[0].n).toBe(13);
    await fresh.close();
  });
});

describe("RLS", () => {
  it("visitante le catalogo mas nao ve pedidos nem perfis", async () => {
    expect((await as(db, { role: "anon" }, "select 1 from public.catalog_games limit 1")).length).toBe(1);
    expect((await as(db, { role: "anon" }, "select 1 from public.orders")).length).toBe(0);
    expect((await as(db, { role: "anon" }, "select 1 from public.activation_keys")).length).toBe(0);
  });

  it("cliente ve apenas os proprios pedidos e chaves", async () => {
    const orders = await as<{ user_id: string }>(db, { role: "authenticated", uid: IDS.ana }, "select user_id from public.orders");
    expect(orders.length).toBeGreaterThan(0);
    expect(orders.every((o) => o.user_id === IDS.ana)).toBe(true);
    const keys = await as(db, { role: "authenticated", uid: IDS.bruno }, "select * from public.activation_keys");
    const own = await db.query("select * from public.library_items where user_id = $1", [IDS.bruno]);
    expect(keys.length).toBe(own.rows.length);
  });

  it("admin ve todos os pedidos", async () => {
    const all = await db.query<{ n: number }>("select count(*)::int n from public.orders");
    const seen = await as(db, { role: "authenticated", uid: IDS.admin }, "select id from public.orders");
    expect(seen.length).toBe(all.rows[0].n);
  });

  it("cliente nao escreve em tabelas de venda nem em jogos", async () => {
    const ana = { role: "authenticated", uid: IDS.ana } as const;
    await expect(as(db, ana, "insert into public.library_items (user_id, game_id, order_id) select $1, id, (select id from public.orders limit 1) from public.games limit 1", [IDS.ana])).rejects.toThrow();
    await expect(as(db, ana, "insert into public.orders (user_id, total_cents, status, paid_at) values ($1, 0, 'paid', now())", [IDS.ana])).rejects.toThrow();
    const upd = await as(db, ana, "update public.games set price_cents = 1 returning id");
    expect(upd.length).toBe(0);
  });

  it("cliente nao pode se promover a admin", async () => {
    await expect(as(db, { role: "authenticated", uid: IDS.ana }, "update public.profiles set role = 'admin' where id = $1", [IDS.ana])).rejects.toThrow(/role_change_forbidden/);
  });

  it("admin pode alterar jogos", async () => {
    const upd = await as(db, { role: "authenticated", uid: IDS.admin }, "update public.games set is_featured = is_featured where slug = 'pixel-pomar' returning id");
    expect(upd.length).toBe(1);
  });

  it("cliente nao pode chamar confirm_payment", async () => {
    await expect(
      as(db, { role: "authenticated", uid: IDS.ana }, "select public.confirm_payment(gen_random_uuid(), 'approved')"),
    ).rejects.toThrow(/permission denied/);
  });
});

describe("avaliacoes", () => {
  it("so quem comprou pode avaliar", async () => {
    const ana = { role: "authenticated", uid: IDS.ana } as const;
    // Ana nao comprou 'turbo-quartzo'
    await expect(
      as(db, ana, "insert into public.reviews (user_id, game_id, rating, comment) values ($1, $2, 5, 'x')", [IDS.ana, await gameId("turbo-quartzo")]),
    ).rejects.toThrow(/row-level security/);
    // Ana comprou 'lamina-do-eclipse'
    const ok = await as(db, ana, "insert into public.reviews (user_id, game_id, rating, comment) values ($1, $2, 5, 'Excelente') returning author_name", [IDS.ana, await gameId("lamina-do-eclipse")]);
    expect(ok[0]).toMatchObject({ author_name: "Ana Souza" });
  });

  it("nao permite avaliar em nome de outro usuario", async () => {
    await expect(
      as(db, { role: "authenticated", uid: IDS.ana }, "insert into public.reviews (user_id, game_id, rating) values ($1, $2, 4)", [IDS.bruno, await gameId("operacao-cinzas")]),
    ).rejects.toThrow(/row-level security/);
  });

  it("atualiza nota media e contagem", async () => {
    const [g] = (await db.query<{ avg_rating: string; review_count: number; calc: string; n: number }>(
      `select avg_rating, review_count, (select round(avg(rating)::numeric, 2) from public.reviews where game_id = g.id) calc, (select count(*)::int from public.reviews where game_id = g.id) n
       from public.games g where slug = 'lamina-do-eclipse'`,
    )).rows;
    expect(Number(g.avg_rating)).toBe(Number(g.calc));
    expect(g.review_count).toBe(g.n);
  });
});

describe("checkout transacional", () => {
  it("pagamento aprovado gera pedido pago, biblioteca e chave unica", async () => {
    const { order_id, payment_id, total_cents } = await checkout(IDS.carla, ["turbo-quartzo", "lanterna-minima"]);
    expect(total_cents).toBe(4990 + 2990);
    // antes da confirmacao nada e liberado
    expect((await db.query("select 1 from public.library_items where order_id = $1", [order_id])).rows.length).toBe(0);

    const r = await db.query<{ r: { status: string; released: number } }>("select public.confirm_payment($1, 'approved', 'mock-ok') r", [payment_id]);
    expect(r.rows[0].r).toMatchObject({ status: "approved", released: 2 });

    const order = (await db.query<{ status: string; paid_at: string | null }>("select status, paid_at from public.orders where id = $1", [order_id])).rows[0];
    expect(order.status).toBe("paid");
    expect(order.paid_at).not.toBeNull();
    const keys = await db.query<{ key: string }>("select k.key from public.activation_keys k join public.library_items l on l.id = k.library_item_id where l.order_id = $1", [order_id]);
    expect(keys.rows).toHaveLength(2);
    expect(keys.rows[0].key).toMatch(/^[0-9A-F]{5}(-[0-9A-F]{5}){3}$/);
    expect(new Set(keys.rows.map((k) => k.key)).size).toBe(2);
    // carrinho e esvaziado
    const left = await as(db, { role: "authenticated", uid: IDS.carla }, "select * from public.cart_items");
    expect(left).toHaveLength(0);
  });

  it("confirmar duas vezes e idempotente (nao duplica chaves)", async () => {
    const { payment_id, order_id } = await checkout(IDS.bruno, ["casa-dos-espelhos-cegos"]);
    await db.query("select public.confirm_payment($1, 'approved')", [payment_id]);
    const again = await db.query<{ r: { already_processed?: boolean; released: number } }>("select public.confirm_payment($1, 'approved') r", [payment_id]);
    expect(again.rows[0].r).toMatchObject({ already_processed: true, released: 0 });
    const n = await db.query<{ n: number }>("select count(*)::int n from public.activation_keys k join public.library_items l on l.id = k.library_item_id where l.order_id = $1", [order_id]);
    expect(n.rows[0].n).toBe(1);
  });

  it("pagamento recusado nunca libera o jogo", async () => {
    const { payment_id, order_id } = await checkout(IDS.carla, ["ace-point-tenis"]);
    await db.query("select public.confirm_payment($1, 'declined', 'mock-x', 'Cartao recusado')", [payment_id]);
    expect((await db.query<{ status: string }>("select status from public.orders where id = $1", [order_id])).rows[0].status).toBe("failed");
    expect((await db.query("select 1 from public.library_items where order_id = $1", [order_id])).rows).toHaveLength(0);
    await expect(db.query("select public.confirm_payment($1, 'approved')", [payment_id])).rejects.toThrow(/payment_closed/);
  });

  it("pagamento pendente nao libera ate ser aprovado", async () => {
    const { payment_id, order_id } = await checkout(IDS.carla, ["sentinelas-do-vale"], "pix");
    await db.query("select public.confirm_payment($1, 'pending', 'mock-pix')", [payment_id]);
    expect((await db.query("select 1 from public.library_items where order_id = $1", [order_id])).rows).toHaveLength(0);
    await db.query("select public.confirm_payment($1, 'approved')", [payment_id]);
    expect((await db.query("select 1 from public.library_items where order_id = $1", [order_id])).rows).toHaveLength(1);
  });

  it("rejeita compra de jogo ja possuido e carrinho vazio", async () => {
    await expect(checkout(IDS.ana, ["lamina-do-eclipse"])).rejects.toThrow(/already_owned/);
    await as(db, { role: "authenticated", uid: IDS.ana }, "delete from public.cart_items");
    await expect(
      as(db, { role: "authenticated", uid: IDS.ana }, "select public.create_order_from_cart('card')"),
    ).rejects.toThrow(/empty_cart/);
  });

  it("jogo gratuito usa metodo free e libera sem cobranca", async () => {
    const { payment_id, total_cents } = await checkout(IDS.carla, ["festa-caotica-online"], "card");
    expect(total_cents).toBe(0);
    const m = await db.query<{ method: string }>("select method from public.payments where id = $1", [payment_id]);
    expect(m.rows[0].method).toBe("free");
    await db.query("select public.confirm_payment($1, 'approved')", [payment_id]);
    expect((await db.query("select 1 from public.library_items where user_id = $1 and game_id = $2", [IDS.carla, await gameId("festa-caotica-online")])).rows).toHaveLength(1);
  });

  it("rejeita aprovacao quando o valor do pagamento diverge do pedido", async () => {
    const { payment_id } = await checkout(IDS.bruno, ["cafeteria-quantica"]);
    await db.query("update public.payments set amount_cents = amount_cents - 1 where id = $1", [payment_id]);
    await expect(db.query("select public.confirm_payment($1, 'approved')", [payment_id])).rejects.toThrow(/amount_mismatch/);
  });
});
