export function AuthShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="card space-y-5 p-6">
        <div>
          <h1 className="text-2xl font-black">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
