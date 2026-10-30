import type { Metadata } from "next";
import { requireUser } from "@/data/auth";
import { ProfileForm } from "@/components/AuthForms";

export const metadata: Metadata = { title: "Meu perfil" };

export default async function ProfilePage({ searchParams }: { searchParams: Promise<{ senha?: string }> }) {
  const user = await requireUser("/perfil");
  const { senha } = await searchParams;
  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-3xl font-black">Meu perfil</h1>
      {senha === "alterada" && <p role="status" className="mt-4 rounded-lg border border-ok/50 bg-ok/10 px-3 py-2 text-sm text-ok">Senha alterada com sucesso.</p>}
      <div className="card mt-6 p-6">
        <ProfileForm displayName={user.profile.display_name} email={user.email} />
      </div>
      <p className="mt-4 text-sm text-muted">Tipo de conta: {user.profile.role === "admin" ? "Administrador" : "Cliente"}</p>
    </div>
  );
}
