import type { Metadata } from "next";
import { getCategories } from "@/data/games";
import { deleteCategory } from "@/actions/admin";
import { CategoryForm } from "@/components/AdminForms";

export const metadata: Metadata = { title: "Admin · Categorias" };

export default async function AdminCategories({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const { erro } = await searchParams;
  const categories = await getCategories();
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-black">Categorias</h1>
      {erro && <p role="alert" className="rounded-lg border border-danger/50 bg-danger/10 px-3 py-2 text-sm text-danger">Esta categoria possui jogos e não pode ser removida.</p>}
      <div className="grid gap-6 md:grid-cols-[1fr_20rem]">
        <ul className="card divide-y divide-line">
          {categories.map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-2 p-3">
              <span><span className="font-semibold">{c.name}</span> <span className="text-sm text-muted">/{c.slug}</span></span>
              <form action={deleteCategory}><input type="hidden" name="id" value={c.id} /><button className="btn btn-danger btn-sm" aria-label={`Excluir ${c.name}`}>Excluir</button></form>
            </li>
          ))}
        </ul>
        <CategoryForm />
      </div>
    </div>
  );
}
