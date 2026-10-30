import { setDemoRole } from "@/actions/demo";

/** Seletor "Modo admin": visível somente no ambiente de demonstração. */
export function DemoSwitch({ isAdmin }: { isAdmin: boolean }) {
  return (
    <form action={setDemoRole} className="flex items-center">
      <input type="hidden" name="role" value={isAdmin ? "customer" : "admin"} />
      <button
        type="submit"
        role="switch"
        aria-checked={isAdmin}
        title="Alternar entre cliente demo e administrador (somente na demonstração)"
        className="flex items-center gap-2 rounded-full border border-line px-2.5 py-1.5 text-xs font-bold hover:bg-panel2"
      >
        <span className={`relative h-4 w-7 rounded-full transition-colors ${isAdmin ? "bg-gold" : "bg-line"}`} aria-hidden="true">
          <span className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all ${isAdmin ? "left-3.5" : "left-0.5"}`} />
        </span>
        <span className="hidden sm:inline">Modo admin</span>
        <span className="sr-only sm:hidden">Modo admin</span>
      </button>
    </form>
  );
}
