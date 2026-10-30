/** Logo GameZone Brasil: um controle de videogame sorridente (com faísca verde-limão) + selo "BRASIL". */
export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={(size * 44) / 56} viewBox="0 0 56 44" aria-hidden="true">
      <defs>
        <linearGradient id="gz-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ef4444" />
          <stop offset="1" stopColor="#9f1239" />
        </linearGradient>
      </defs>
      {/* contorno branco de adesivo */}
      <path d="M14 8h28c6 0 9 4 11 12l3 13c1 5-2 9-7 9-4 0-6-2-8-5l-3-4H18l-3 4c-2 3-4 5-8 5-5 0-8-4-7-9l3-13c2-8 5-12 11-12z" fill="#fff" stroke="#fff" strokeWidth="5" strokeLinejoin="round" />
      <path d="M14 8h28c6 0 9 4 11 12l3 13c1 5-2 9-7 9-4 0-6-2-8-5l-3-4H18l-3 4c-2 3-4 5-8 5-5 0-8-4-7-9l3-13c2-8 5-12 11-12z" fill="url(#gz-body)" stroke="#3b0a14" strokeWidth="2" strokeLinejoin="round" />
      {/* direcional */}
      <rect x="9" y="17" width="12" height="4" rx="1.6" fill="#a3e635" stroke="#3b0a14" strokeWidth="1" />
      <rect x="13" y="13" width="4" height="12" rx="1.6" fill="#a3e635" stroke="#3b0a14" strokeWidth="1" />
      {/* botões */}
      <circle cx="42" cy="14.5" r="3" fill="#a3e635" stroke="#3b0a14" strokeWidth="1" />
      <circle cx="47" cy="19.5" r="3" fill="#fff" stroke="#3b0a14" strokeWidth="1" />
      <circle cx="37" cy="19.5" r="3" fill="#fecdd3" stroke="#3b0a14" strokeWidth="1" />
      <circle cx="42" cy="24.5" r="3" fill="#a3e635" stroke="#3b0a14" strokeWidth="1" />
      {/* carinha */}
      <ellipse cx="25" cy="19" rx="2.6" ry="3.2" fill="#fff" stroke="#3b0a14" strokeWidth="1" />
      <ellipse cx="32" cy="19" rx="2.6" ry="3.2" fill="#fff" stroke="#3b0a14" strokeWidth="1" />
      <circle cx="25.8" cy="19.8" r="1.4" fill="#3b0a14" />
      <circle cx="32.8" cy="19.8" r="1.4" fill="#3b0a14" />
      <path d="M24.5 26c1.4 2.6 6.6 2.6 8 0" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
      {/* faísca */}
      <path d="M28 0l1.6 4.4 4.4 1.6-4.4 1.6L28 12l-1.6-4.4L22 6l4.4-1.6z" fill="#a3e635" stroke="#3b0a14" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="text-xl font-black italic tracking-tight sm:text-2xl">
          GAME<span className="text-brand">ZONE</span>
        </span>
        <span className="mt-0.5 w-fit -rotate-2 rounded bg-brand px-1.5 py-0.5 text-[10px] font-black tracking-[0.25em] text-[#1a2e05]">BRASIL</span>
      </span>
    </span>
  );
}
