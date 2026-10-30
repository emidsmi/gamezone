// Gerador de capas, banners e capturas SVG: cada jogo tem paleta, fundo e personagem/objeto proprios (estilo adesivo/cartoon).
export const hash = (s) => {
  let h = 2166136261;
  for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  return h >>> 0;
};
export const rng = (seed) => {
  let a = hash(seed);
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const hsl = (h, s, l) => `hsl(${Math.round(((h % 360) + 360) % 360)} ${s}% ${l}%)`;

// ---------- objetos (caixa 200x200). c = {a,b,l,d,ink,sw}: cores principal, secundaria, clara, escura, contorno, espessura ----------
const st = (c, k = 1) => `stroke="${c.ink}" stroke-width="${c.sw * k}" stroke-linejoin="round" stroke-linecap="round"`;
const poly = (pts, fill, c) => `<polygon points="${pts}" fill="${fill}" ${st(c)}/>`;
const pathEl = (d, fill, c, extra = "") => `<path d="${d}" fill="${fill}" ${st(c)} ${extra}/>`;
const circle = (x, y, r, fill, c, k = 1) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${st(c, k)}/>`;
const rect = (x, y, w, h, rx, fill, c) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${st(c)}/>`;
const ell = (x, y, rx, ry, fill, c, k = 1) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" ${st(c, k)}/>`;
const line = (x1, y1, x2, y2, col, w) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`;
const eyes = (c, y = 95, dx = 26, r = 13) => circle(100 - dx, y, r, c.l, c, 0.6) + circle(100 + dx, y, r, c.l, c, 0.6) + `<circle cx="${100 - dx + 2}" cy="${y + 2}" r="${r * 0.5}" fill="${c.d}"/><circle cx="${100 + dx + 2}" cy="${y + 2}" r="${r * 0.5}" fill="${c.d}"/>`;
const smile = (c, y = 125, w = 22) => `<path d="M${100 - w} ${y} Q100 ${y + 26} ${100 + w} ${y}" fill="none" stroke="${c.d}" stroke-width="7" stroke-linecap="round"/>`;
const star = (cx, cy, R, r, fill, c, rot = -90) => poly(Array.from({ length: 10 }, (_, i) => { const a = ((rot + i * 36) * Math.PI) / 180, rr = i % 2 ? r : R; return `${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`; }).join(" "), fill, c);

const ICONS = {
  sword: (c) => `<g transform="rotate(35 100 100)">${poly("100,6 118,38 118,128 82,128 82,38", c.l, c)}${line(100, 30, 100, 118, c.b, 6)}${rect(56, 128, 88, 16, 8, c.a, c)}${rect(89, 144, 22, 34, 7, c.b, c)}${circle(100, 188, 11, c.a, c)}</g>`,
  cat: (c) => `${poly("38,78 48,18 92,52", c.a, c)}${poly("162,78 152,18 108,52", c.a, c)}${poly("52,60 56,36 76,52", c.b, c)}${poly("148,60 144,36 124,52", c.b, c)}${ell(100, 108, 68, 60, c.a, c)}${eyes(c, 100, 28, 14)}${poly("90,122 110,122 100,134", c.b, c)}<path d="M100 134 Q88 148 74 138 M100 134 Q112 148 126 138" fill="none" stroke="${c.d}" stroke-width="5" stroke-linecap="round"/>${line(20, 118, 52, 124, c.d, 4)}${line(20, 136, 52, 132, c.d, 4)}${line(180, 118, 148, 124, c.d, 4)}${line(180, 136, 148, 132, c.d, 4)}${rect(60, 88, 80, 12, 6, c.d, c)}`,
  bolt: (c) => poly("118,6 40,112 92,112 74,194 160,80 106,80", c.a, c) + poly("118,30 72,100 108,100 96,150 136,88 100,88", c.l, { ...c, sw: 0 }),
  bomb: (c) => `${circle(96, 124, 66, c.d, c)}${ell(76, 100, 18, 12, c.l, { ...c, sw: 0 })}${rect(80, 44, 32, 22, 6, c.a, c)}<path d="M104 44 Q118 20 146 24" fill="none" stroke="${c.ink}" stroke-width="9" stroke-linecap="round"/>${star(152, 26, 22, 10, c.b, c)}`,
  robot: (c) => `${line(100, 14, 100, 44, c.ink, 8)}${circle(100, 14, 11, c.b, c)}${circle(32, 100, 14, c.b, c)}${circle(168, 100, 14, c.b, c)}${rect(40, 44, 120, 112, 26, c.a, c)}${rect(58, 70, 36, 34, 8, c.l, c)}${rect(106, 70, 36, 34, 8, c.l, c)}<circle cx="78" cy="88" r="9" fill="${c.d}"/><circle cx="126" cy="88" r="9" fill="${c.d}"/>${rect(66, 122, 68, 20, 8, c.d, c)}${line(84, 122, 84, 142, c.l, 4)}${line(100, 122, 100, 142, c.l, 4)}${line(116, 122, 116, 142, c.l, 4)}${rect(76, 156, 48, 26, 6, c.b, c)}`,
  flame: (c) => pathEl("M102 8 C122 52 166 78 156 138 C150 172 126 192 100 192 C74 192 48 172 46 138 C44 104 72 92 78 56 C96 72 98 40 102 8 Z", c.a, c) + pathEl("M100 80 C112 106 134 118 130 146 C127 166 114 176 100 176 C84 176 72 164 72 146 C72 124 92 112 100 80 Z", c.b, { ...c, sw: 0 }) + pathEl("M100 128 C108 140 116 146 114 158 C112 168 106 172 100 172 C92 172 88 166 88 158 C88 146 96 140 100 128 Z", c.l, { ...c, sw: 0 }),
  book: (c) => `${pathEl("M100 52 C72 36 38 36 14 48 L14 164 C38 152 72 152 100 168 Z", c.l, c)}${pathEl("M100 52 C128 36 162 36 186 48 L186 164 C162 152 128 152 100 168 Z", c.l, c)}${line(34, 70, 84, 76, c.a, 6)}${line(34, 92, 84, 98, c.a, 6)}${line(34, 114, 84, 120, c.a, 6)}${line(166, 70, 116, 76, c.b, 6)}${line(166, 92, 116, 98, c.b, 6)}${star(150, 130, 16, 7, c.a, { ...c, sw: 3 })}${line(100, 52, 100, 168, c.ink, 6)}`,
  rune: (c) => poly("100,10 172,52 172,146 100,190 28,146 28,52", c.a, c) + poly("100,34 150,64 150,136 100,166 50,136 50,64", c.d, { ...c, sw: 0 }) + `<path d="M100 62 L100 140 M72 90 L100 112 L128 90" fill="none" stroke="${c.l}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>`,
  coin: (c) => `${circle(100, 100, 82, c.a, c)}${circle(100, 100, 62, c.b, { ...c, sw: c.sw * 0.6 })}${star(100, 100, 40, 17, c.l, { ...c, sw: c.sw * 0.7 })}${line(52, 60, 70, 46, c.l, 7)}`,
  bell: (c) => `${circle(100, 20, 11, c.b, c)}${pathEl("M100 26 C58 30 56 84 50 112 L32 144 L168 144 L150 112 C144 84 142 30 100 26 Z", c.a, c)}${rect(28, 138, 144, 16, 8, c.b, c)}${circle(100, 168, 15, c.b, c)}${ell(78, 70, 9, 22, c.l, { ...c, sw: 0 })}`,
  gem: (c) => poly("48,58 152,58 188,102 100,188 12,102", c.a, c) + poly("48,58 100,102 12,102", c.l, { ...c, sw: c.sw * 0.7 }) + poly("152,58 100,102 188,102", c.b, { ...c, sw: c.sw * 0.7 }) + poly("48,58 152,58 100,102", c.l, { ...c, sw: c.sw * 0.7 }) + poly("12,102 100,102 100,188", c.b, { ...c, sw: c.sw * 0.7 }),
  car: (c) => `${pathEl("M54 96 L76 58 Q80 52 90 52 L128 52 Q138 52 144 60 L166 96 Z", c.l, c)}${line(104, 56, 104, 94, c.ink, 6)}${rect(12, 92, 176, 52, 20, c.a, c)}${rect(22, 104, 30, 14, 6, c.b, c)}${rect(150, 104, 30, 14, 6, c.l, c)}${circle(54, 148, 24, c.d, c)}${circle(54, 148, 9, c.l, c, 0.5)}${circle(146, 148, 24, c.d, c)}${circle(146, 148, 9, c.l, c, 0.5)}${line(22, 128, 60, 128, c.b, 6)}`,
  ufo: (c) => `${poly("70,128 130,128 170,196 30,196", c.b, { ...c, sw: 0 })}<path d="M58 100 A42 42 0 0 1 142 100 Z" fill="${c.l}" ${st(c)}/>${ell(100, 108, 90, 30, c.a, c)}${circle(50, 112, 9, c.l, c, 0.5)}${circle(100, 120, 9, c.l, c, 0.5)}${circle(150, 112, 9, c.l, c, 0.5)}${circle(100, 76, 11, c.d, { ...c, sw: 0 })}`,
  soccer: (c) => `${circle(100, 100, 82, c.l, c)}${poly("100,70 128,90 118,124 82,124 72,90", c.d, c)}${line(100, 70, 100, 22, c.ink, 6)}${line(128, 90, 170, 76, c.ink, 6)}${line(118, 124, 146, 164, c.ink, 6)}${line(82, 124, 54, 164, c.ink, 6)}${line(72, 90, 30, 76, c.ink, 6)}${poly("100,22 126,30 120,48 80,48 74,30", c.d, { ...c, sw: 4 })}`,
  basketball: (c) => `${circle(100, 100, 82, c.a, c)}${line(100, 18, 100, 182, c.ink, 6)}${line(18, 100, 182, 100, c.ink, 6)}<path d="M38 40 Q86 100 38 160 M162 40 Q114 100 162 160" fill="none" stroke="${c.ink}" stroke-width="6"/>${ell(70, 58, 14, 8, c.l, { ...c, sw: 0 })}`,
  volley: (c) => `${circle(100, 100, 82, c.l, c)}<path d="M20 90 Q60 40 110 70 T180 70" fill="none" stroke="${c.a}" stroke-width="16"/><path d="M30 140 Q80 90 130 130 T184 120" fill="none" stroke="${c.b}" stroke-width="16"/><path d="M100 18 Q70 70 100 110 T100 182" fill="none" stroke="${c.ink}" stroke-width="5"/>${circle(100, 100, 82, "none", c)}`,
  racket: (c) => `<g transform="rotate(-30 100 100)">${rect(91, 146, 18, 46, 8, c.b, c)}${ell(100, 78, 56, 70, c.l, c, 1.8)}${line(60, 40, 140, 116, c.a, 3)}${line(140, 40, 60, 116, c.a, 3)}${line(100, 12, 100, 144, c.a, 3)}${line(48, 78, 152, 78, c.a, 3)}</g>${circle(156, 160, 20, c.b, c)}<path d="M140 150 Q156 160 140 172" fill="none" stroke="${c.l}" stroke-width="4"/>`,
  gear: (c) => `${Array.from({ length: 8 }, (_, i) => rect(86, 14, 28, 40, 6, c.a, c).replace("<rect", `<rect transform="rotate(${i * 45} 100 100)"`)).join("")}${circle(100, 100, 66, c.a, c)}${circle(100, 100, 30, c.d, c)}${circle(100, 100, 12, c.l, c, 0.5)}${line(60, 70, 72, 58, c.l, 7)}`,
  ship: (c) => `${line(100, 24, 100, 130, c.ink, 12)}${line(100, 24, 100, 130, c.d, 5)}${poly("106,30 176,118 106,118", c.l, c)}${poly("94,48 38,118 94,118", c.b, c)}${pathEl("M16 118 L184 118 L158 166 L42 166 Z", c.a, c)}${circle(100, 142, 9, c.l, c, 0.5)}<path d="M8 180 Q30 166 52 180 T96 180 T140 180 T192 180" fill="none" stroke="${c.b}" stroke-width="9" stroke-linecap="round"/>${poly("100,10 124,18 100,26", c.b, { ...c, sw: 4 })}`,
  planet: (c) => `<g transform="rotate(-18 100 100)">${circle(100, 100, 54, c.a, c)}${ell(100, 100, 94, 26, "none", { ...c, ink: c.b }, 2.4)}${ell(100, 100, 94, 26, "none", c, 0.6)}</g>${circle(82, 78, 9, c.l, { ...c, sw: 0 })}${circle(116, 118, 6, c.l, { ...c, sw: 0 })}${star(170, 40, 14, 6, c.l, { ...c, sw: 4 })}`,
  tower: (c) => `${rect(60, 64, 80, 124, 4, c.a, c)}${[52, 86, 120].map((x) => rect(x, 36, 28, 32, 4, c.a, c)).join("")}<path d="M86 188 L86 150 A14 14 0 0 1 114 150 L114 188 Z" fill="${c.d}" ${st(c)}/>${rect(92, 84, 16, 34, 7, c.d, c)}${line(100, 36, 100, 8, c.ink, 7)}${poly("100,8 140,18 100,30", c.b, c)}${line(68, 70, 68, 180, c.l, 5)}`,
  castle: (c) => `${rect(14, 90, 46, 96, 4, c.a, c)}${rect(140, 90, 46, 96, 4, c.a, c)}${rect(52, 64, 96, 122, 4, c.a, c)}${[16, 38].map((x) => rect(x, 70, 20, 24, 3, c.a, c)).join("")}${[142, 164].map((x) => rect(x, 70, 20, 24, 3, c.a, c)).join("")}${[58, 90, 122].map((x) => rect(x, 42, 22, 26, 3, c.a, c)).join("")}<path d="M80 186 L80 140 A20 20 0 0 1 120 140 L120 186 Z" fill="${c.d}" ${st(c)}/>${poly("100,42 100,12 134,24 100,34", c.b, c)}${rect(30, 112, 14, 26, 6, c.d, c)}${rect(156, 112, 14, 26, 6, c.d, c)}`,
  crown: (c) => `${poly("16,150 20,52 62,98 100,34 138,98 180,52 184,150", c.a, c)}${rect(14, 146, 172, 30, 10, c.b, c)}${circle(20, 52, 11, c.l, c, 0.7)}${circle(100, 34, 11, c.l, c, 0.7)}${circle(180, 52, 11, c.l, c, 0.7)}${circle(60, 161, 8, c.l, c, 0.5)}${circle(100, 161, 8, c.d, c, 0.5)}${circle(140, 161, 8, c.l, c, 0.5)}`,
  dice: (c) => `<g transform="rotate(-14 100 100)">${rect(26, 26, 148, 148, 32, c.l, c)}${[[62, 62], [138, 62], [100, 100], [62, 138], [138, 138]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="13" fill="${c.d}"/>`).join("")}</g>${star(168, 30, 20, 8, c.b, c)}`,
  key: (c) => `<g transform="rotate(-35 100 100)">${circle(54, 100, 46, c.a, c)}${circle(54, 100, 18, c.d, c)}${rect(96, 90, 94, 20, 8, c.a, c)}${rect(146, 108, 16, 28, 6, c.a, c)}${rect(170, 108, 16, 20, 6, c.a, c)}</g>${star(40, 36, 18, 8, c.l, { ...c, sw: 4 })}`,
  helmet: (c) => `${circle(100, 104, 80, c.l, c)}${rect(40, 68, 120, 70, 34, c.d, c)}${ell(78, 92, 20, 10, c.b, { ...c, sw: 0 })}${rect(86, 14, 28, 24, 8, c.a, c)}${rect(14, 92, 20, 40, 8, c.a, c)}${rect(166, 92, 20, 40, 8, c.a, c)}${line(60, 156, 140, 156, c.a, 10)}`,
  mirror: (c) => `${rect(90, 148, 20, 42, 8, c.b, c)}${ell(100, 84, 58, 74, c.a, c)}${ell(100, 84, 42, 58, c.l, c, 0.7)}${poly("70,56 84,56 118,112 104,112", c.b, { ...c, sw: 0 })}${poly("118,60 126,60 130,70 122,70", c.b, { ...c, sw: 0 })}${star(162, 34, 16, 7, c.l, { ...c, sw: 4 })}`,
  candle: (c) => `${rect(66, 84, 68, 100, 12, c.l, c)}<path d="M66 108 Q76 128 86 108 M104 108 Q116 138 126 108" fill="none" stroke="${c.a}" stroke-width="9" stroke-linecap="round"/>${ell(100, 190, 62, 10, c.b, c)}${line(100, 84, 100, 70, c.ink, 6)}${pathEl("M100 12 C116 36 126 46 118 62 C114 72 108 74 100 74 C92 74 86 72 84 62 C80 46 94 36 100 12 Z", c.a, c)}${pathEl("M100 40 C108 52 110 58 106 64 C104 68 102 68 100 68 C98 68 94 66 94 62 C94 56 98 52 100 40 Z", c.l, { ...c, sw: 0 })}`,
  pyramid: (c) => `${circle(158, 44, 24, c.l, c)}${poly("100,24 186,172 14,172", c.a, c)}${poly("100,24 186,172 100,172", c.b, c)}${line(46, 124, 154, 124, c.ink, 5)}${line(72, 78, 128, 78, c.ink, 5)}${line(100, 78, 100, 124, c.ink, 5)}${line(70, 124, 70, 172, c.ink, 5)}${line(130, 124, 130, 172, c.ink, 5)}`,
  sun: (c) => `${Array.from({ length: 12 }, (_, i) => `<line x1="100" y1="12" x2="100" y2="34" stroke="${c.b}" stroke-width="12" stroke-linecap="round" transform="rotate(${i * 30} 100 100)"/>`).join("")}${circle(100, 100, 56, c.a, c)}${eyes(c, 92, 20, 10)}${smile(c, 114, 18)}${ell(66, 114, 10, 6, c.b, { ...c, sw: 0 })}${ell(134, 114, 10, 6, c.b, { ...c, sw: 0 })}`,
  cloud: (c) => `${pathEl("M54 156 C14 156 8 102 52 100 C52 56 112 40 134 80 C170 64 198 114 164 156 Z", c.l, c)}${eyes(c, 112, 24, 11)}${smile(c, 134, 16)}${ell(60, 130, 10, 6, c.b, { ...c, sw: 0 })}${ell(140, 130, 10, 6, c.b, { ...c, sw: 0 })}${star(168, 38, 16, 7, c.b, { ...c, sw: 4 })}`,
  moon: (c) => `${pathEl("M126 14 A88 88 0 1 0 186 142 A68 68 0 1 1 126 14 Z", c.a, c)}${star(150, 60, 18, 8, c.l, { ...c, sw: 4 })}${star(176, 108, 12, 5, c.b, { ...c, sw: 3 })}${star(106, 30, 10, 4, c.b, { ...c, sw: 3 })}${circle(52, 110, 9, c.b, { ...c, sw: 0 })}${circle(74, 70, 6, c.b, { ...c, sw: 0 })}`,
  apple: (c) => `${pathEl("M100 62 C72 40 26 60 28 114 C30 162 70 190 100 178 C130 190 170 162 172 114 C174 60 128 40 100 62 Z", c.a, c)}${rect(94, 24, 12, 42, 6, c.d, c)}${pathEl("M106 40 C130 14 164 22 164 22 C164 22 156 56 124 56 C112 56 106 46 106 40 Z", c.b, c)}${ell(64, 98, 12, 22, c.l, { ...c, sw: 0 }).replace('<ellipse', '<ellipse opacity=".6"')}${eyes(c, 118, 22, 9)}${smile(c, 138, 14)}`,
  lantern: (c) => `<path d="M70 38 Q100 -2 130 38" fill="none" stroke="${c.ink}" stroke-width="9" stroke-linecap="round"/>${rect(60, 38, 80, 16, 6, c.d, c)}${rect(54, 54, 92, 110, 18, c.l, c)}${pathEl("M100 76 C114 96 122 104 116 122 C113 132 107 136 100 136 C93 136 87 132 84 122 C78 104 90 96 100 76 Z", c.a, c)}${line(78, 54, 78, 164, c.ink, 5)}${line(122, 54, 122, 164, c.ink, 5)}${rect(58, 164, 84, 18, 6, c.d, c)}${star(168, 40, 14, 6, c.b, { ...c, sw: 4 })}${star(30, 150, 12, 5, c.b, { ...c, sw: 3 })}`,
  pot: (c) => `${star(100, 36, 28, 12, c.l, c)}<path d="M28 88 L172 88 L162 160 Q158 184 134 184 L66 184 Q42 184 38 160 Z" fill="${c.a}" ${st(c)}/>${rect(20, 76, 160, 20, 10, c.b, c)}${circle(24, 118, 14, "none", c, 1.4)}${circle(176, 118, 14, "none", c, 1.4)}${eyes(c, 128, 24, 11)}${smile(c, 148, 16)}`,
  coffee: (c) => `<path d="M36 90 L152 90 L144 158 Q140 182 114 182 L74 182 Q48 182 44 158 Z" fill="${c.l}" ${st(c)}/>${circle(160, 124, 24, "none", { ...c, ink: c.l }, 3.2)}${circle(160, 124, 24, "none", c, 0.5)}${ell(94, 90, 58, 12, c.a, c)}${ell(94, 188, 80, 10, c.b, c)}<path d="M72 70 Q60 52 74 38 Q86 24 74 10 M112 70 Q100 52 114 38 Q126 24 114 10" fill="none" stroke="${c.l}" stroke-width="9" stroke-linecap="round"/>${eyes(c, 130, 20, 9)}${smile(c, 148, 12)}`,
  owl: (c) => `${poly("44,48 56,10 90,38", c.a, c)}${poly("156,48 144,10 110,38", c.a, c)}${ell(100, 112, 66, 80, c.a, c)}${ell(100, 134, 40, 48, c.l, c)}${circle(68, 84, 28, c.l, c)}${circle(132, 84, 28, c.l, c)}${circle(70, 86, 13, c.d, c, 0.5)}${circle(130, 86, 13, c.d, c, 0.5)}${poly("90,104 110,104 100,126", c.b, c)}${line(76, 150, 124, 150, c.a, 6)}${line(80, 166, 120, 166, c.a, 6)}${poly("34,120 20,172 54,150", c.b, c)}${poly("166,120 180,172 146,150", c.b, c)}`,
  barn: (c) => `${pathEl("M26 104 L100 36 L174 104 L174 182 L26 182 Z", c.a, c)}${line(26, 104, 100, 36, c.b, 10)}${line(174, 104, 100, 36, c.b, 10)}${rect(68, 108, 64, 74, 6, c.b, c)}${line(68, 108, 132, 182, c.l, 7)}${line(132, 108, 68, 182, c.l, 7)}${rect(86, 62, 28, 28, 6, c.l, c)}${star(168, 40, 16, 7, c.l, { ...c, sw: 4 })}${circle(30, 40, 16, c.l, c)}`,
  plane: (c) => `<g transform="rotate(38 100 100)">${poly("100,70 8,128 14,142 100,118 186,142 192,128", c.a, c)}${poly("100,162 66,190 74,198 100,186 126,198 134,190", c.b, c)}${ell(100, 100, 17, 88, c.l, c)}${ell(100, 52, 8, 14, c.d, { ...c, sw: 0 })}</g>${circle(26, 40, 12, c.l, c, 0.5)}${circle(48, 28, 8, c.l, c, 0.5)}`,
  target: (c) => `${circle(96, 108, 80, c.a, c)}${circle(96, 108, 60, c.l, c, 0.8)}${circle(96, 108, 40, c.a, c, 0.8)}${circle(96, 108, 20, c.l, c, 0.8)}${line(96, 108, 172, 32, c.ink, 14)}${line(96, 108, 172, 32, c.d, 6)}${poly("158,16 188,16 188,46", c.b, c)}${poly("172,32 196,8 200,38", c.b, { ...c, sw: 4 })}`,
  trophy: (c) => `${pathEl("M54 40 L146 40 L140 100 Q134 136 100 140 Q66 136 60 100 Z", c.a, c)}${pathEl("M56 52 C20 48 14 96 62 104 M144 52 C180 48 186 96 138 104", "none", c)}${rect(90, 138, 20, 28, 4, c.b, c)}${rect(58, 164, 84, 24, 8, c.b, c)}${star(100, 84, 22, 9, c.l, { ...c, sw: 4 })}`,
  heart: (c) => pathEl("M100 180 C20 120 10 70 40 44 C66 22 94 36 100 64 C106 36 134 22 160 44 C190 70 180 120 100 180 Z", c.a, c) + ell(64, 66, 12, 8, c.l, { ...c, sw: 0 }),
};

// ---------- fundo, decoracao, cena ----------
const PATTERNS = {
  sunburst: (r, w, h, p) => { const cx = w / 2, cy = h * 0.42, R = Math.hypot(w, h); let s = ""; const n = 18; for (let i = 0; i < n; i += 2) { const a1 = (i / n) * Math.PI * 2, a2 = ((i + 1) / n) * Math.PI * 2; s += `<polygon points="${cx},${cy} ${cx + Math.cos(a1) * R},${cy + Math.sin(a1) * R} ${cx + Math.cos(a2) * R},${cy + Math.sin(a2) * R}" fill="${p.a}" opacity=".16"/>`; } return s; },
  dots: (r, w, h, p) => { let s = ""; const g = Math.max(w, h) / 16; for (let y = 0; y < h / g + 1; y++) for (let x = 0; x < w / g + 1; x++) s += `<circle cx="${x * g + (y % 2) * g / 2}" cy="${y * g}" r="${g * (0.12 + 0.18 * ((x + y) % 4) / 3)}" fill="${p.l}" opacity=".16"/>`; return s; },
  stripes: (r, w, h, p) => { let s = ""; const g = Math.max(w, h) / 12; for (let i = -12; i < 24; i++) s += `<polygon points="${i * g},0 ${i * g + g / 2},0 ${i * g + g / 2 - h * 0.6},${h} ${i * g - h * 0.6},${h}" fill="${i % 2 ? p.a : p.b}" opacity=".13"/>`; return s; },
  zigzag: (r, w, h, p) => { let s = ""; const g = Math.max(w, h) / 10; for (let row = 0; row < h / g + 1; row++) { let d = `M0 ${row * g}`; for (let x = 0; x <= w + g; x += g / 2) d += ` L${x} ${row * g + ((x / (g / 2)) % 2 ? g / 3 : 0)}`; s += `<path d="${d}" fill="none" stroke="${row % 2 ? p.a : p.l}" stroke-width="${g / 8}" opacity=".22"/>`; } return s; },
  checker: (r, w, h, p) => { let s = ""; const g = Math.max(w, h) / 12; for (let y = 0; y < h / g + 1; y++) for (let x = 0; x < w / g + 1; x++) if ((x + y) % 2) s += `<rect x="${x * g}" y="${y * g}" width="${g}" height="${g}" fill="${p.l}" opacity=".08"/>`; return s; },
  waves: (r, w, h, p) => { let s = ""; for (let i = 0; i < 7; i++) { const y = h * (0.25 + i * 0.12); s += `<path d="M0 ${y} Q${w * 0.125} ${y - 40} ${w * 0.25} ${y} T${w * 0.5} ${y} T${w * 0.75} ${y} T${w} ${y} V${h} H0 Z" fill="${i % 2 ? p.a : p.b}" opacity=".13"/>`; } return s; },
  bubbles: (r, w, h, p) => { let s = ""; for (let i = 0; i < 26; i++) s += `<circle cx="${r() * w}" cy="${r() * h}" r="${12 + r() * Math.min(w, h) * 0.1}" fill="none" stroke="${i % 2 ? p.l : p.a}" stroke-width="4" opacity=".28"/>`; return s; },
  grid: (r, w, h, p) => { let s = ""; const g = Math.max(w, h) / 14; for (let x = 0; x < w; x += g) s += `<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="${p.l}" stroke-width="2" opacity=".12"/>`; for (let y = 0; y < h; y += g) s += `<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="${p.l}" stroke-width="2" opacity=".12"/>`; return s; },
};
const PATTERN_KEYS = Object.keys(PATTERNS);

const sparkle = (x, y, s, fill, op = 0.9) => `<path d="M${x} ${y - s} Q${x + s * 0.18} ${y - s * 0.18} ${x + s} ${y} Q${x + s * 0.18} ${y + s * 0.18} ${x} ${y + s} Q${x - s * 0.18} ${y + s * 0.18} ${x - s} ${y} Q${x - s * 0.18} ${y - s * 0.18} ${x} ${y - s} Z" fill="${fill}" opacity="${op}"/>`;
const decorations = (r, w, h, p, avoid) => {
  let s = "";
  for (let i = 0; i < Math.round((w * h) / 42000); i++) {
    const x = r() * w, y = r() * h;
    if (avoid && Math.hypot(x - avoid.x, y - avoid.y) < avoid.r) continue;
    const t = r(), sz = 10 + r() * 22, col = [p.l, p.a, p.b][i % 3];
    s += t < 0.5 ? sparkle(x, y, sz, col) : t < 0.75 ? `<circle cx="${x}" cy="${y}" r="${sz / 3}" fill="${col}" opacity=".85"/>` : `<path d="M${x - sz / 2} ${y} H${x + sz / 2} M${x} ${y - sz / 2} V${y + sz / 2}" stroke="${col}" stroke-width="5" stroke-linecap="round" opacity=".85"/>`;
  }
  return s;
};

const palette = (slug) => {
  const h = hash(slug) % 360, scheme = (hash(slug) >> 3) % 3;
  const h2 = scheme === 0 ? h + 160 : scheme === 1 ? h + 40 : h + 120, h3 = scheme === 0 ? h + 40 : scheme === 1 ? h + 190 : h + 240;
  return { bg1: hsl(h, 62, 12), bg2: hsl(h + 18, 70, 30), a: hsl(h2, 92, 60), b: hsl(h3, 95, 62), l: hsl(h + 8, 100, 95), d: hsl(h, 60, 14), ink: hsl(h, 55, 9) };
};

const SIZES = { cover: [600, 800], banner: [1600, 600], shot: [1280, 720] };
const wrap = (text, max) => { const lines = []; let cur = ""; for (const word of text.split(" ")) { if ((cur + " " + word).trim().length > max && cur) { lines.push(cur); cur = word; } else cur = (cur + " " + word).trim(); } if (cur) lines.push(cur); return lines; };
const FONT = "'Arial Black','Impact','Trebuchet MS',sans-serif";

const place = (name, p, cx, cy, size, rot = 0) => {
  const fn = ICONS[name] ?? ICONS.gem, s = size / 200;
  const outline = fn({ a: "#fff", b: "#fff", l: "#fff", d: "#fff", ink: "#fff", sw: 26 });
  const body = fn({ a: p.a, b: p.b, l: p.l, d: p.d, ink: p.ink, sw: 7 });
  return `<g transform="translate(${cx} ${cy}) rotate(${rot}) scale(${s}) translate(-100 -100)"><g opacity=".28" transform="translate(10 14)">${fn({ a: "#000", b: "#000", l: "#000", d: "#000", ink: "#000", sw: 26 })}</g>${outline}${body}</g>`;
};

export function art(game, kind, idx = 0, genreLabel = "") {
  const [w, h] = SIZES[kind];
  const p = palette(game.slug);
  const r = rng(`${game.slug}:${kind}:${idx}`);
  const pat = PATTERN_KEYS[(hash(game.slug) + idx * (kind === "shot" ? 3 : 0)) % PATTERN_KEYS.length];
  const icon = game.icon ?? "gem";
  let scene = PATTERNS[pat](r, w, h, p);
  let text = "";

  if (kind === "cover") {
    scene += decorations(r, w, h, p, { x: 300, y: 330, r: 230 });
    const lines = wrap(game.title, 11);
    const long = lines.length >= 3;
    scene += place(icon, p, 300, long ? 290 : 330, long ? 370 : 420, ((hash(game.slug) % 13) - 6));
    const maxLen = Math.max(...lines.map((l) => l.length));
    const fs = Math.min(66, Math.floor(520 / (maxLen * 0.74)));
    const y0 = h - 72 - (lines.length - 1) * (fs + 4);
    text += `<rect x="0" y="${y0 - fs - 40}" width="${w}" height="${h}" fill="url(#fade)"/>`;
    text += lines.map((l, i) => `<text x="34" y="${y0 + i * (fs + 4)}" font-family="${FONT}" font-weight="900" font-size="${fs}" fill="#fff" stroke="${p.ink}" stroke-width="12" paint-order="stroke" stroke-linejoin="round" transform="rotate(-2 34 ${y0})">${esc(l)}</text>`).join("");
    text += `<rect x="34" y="${h - 52}" width="150" height="10" rx="5" fill="${p.a}"/><rect x="190" y="${h - 52}" width="40" height="10" rx="5" fill="${p.b}"/>`;
    if (genreLabel) text += `<g transform="rotate(-7 90 50)"><rect x="24" y="28" width="${40 + genreLabel.length * 15}" height="44" rx="14" fill="${p.b}" stroke="${p.ink}" stroke-width="5"/><text x="${24 + (40 + genreLabel.length * 15) / 2}" y="58" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="22" fill="${p.ink}" letter-spacing="1">${esc(genreLabel.toUpperCase())}</text></g>`;
  } else if (kind === "banner") {
    scene += decorations(r, w, h, p, { x: 1150, y: 300, r: 330 });
    scene += place(icon, p, 1150, 300, 500, ((hash(game.slug) % 11) - 5) * 1.5);
    scene += place(icon, p, 1490, 480, 120, 14).replace('<g transform', '<g opacity=".95" transform');
    scene += place(icon, p, 860, 110, 90, -16);
  } else {
    const v = idx % 3;
    scene += decorations(r, w, h, p, null);
    if (v === 0) scene += place(icon, p, w / 2, h * 0.52, 360, -6);
    if (v === 1) scene += place(icon, p, w * 0.28, h * 0.55, 300, -10) + place(icon, p, w * 0.62, h * 0.4, 210, 12) + place(icon, p, w * 0.82, h * 0.68, 150, -4);
    if (v === 2) { scene += `<rect x="0" y="${h * 0.72}" width="${w}" height="${h * 0.28}" fill="${p.d}" opacity=".7"/>`; for (let i = 0; i < 5; i++) scene += place(icon, p, 160 + i * 240, h * 0.6 - (i % 2) * 60, 130 + (i % 3) * 30, (i - 2) * 6); }
    text += `<rect x="40" y="36" width="${260 + idx * 40}" height="22" rx="11" fill="${p.a}" stroke="${p.ink}" stroke-width="4"/><rect x="40" y="68" width="170" height="14" rx="7" fill="${p.b}" stroke="${p.ink}" stroke-width="3"/>`;
    text += `<text x="${w - 40}" y="64" text-anchor="end" font-family="${FONT}" font-weight="900" font-size="34" fill="#fff" stroke="${p.ink}" stroke-width="8" paint-order="stroke">${String(1200 * (idx + 1) + (hash(game.slug) % 900)).padStart(6, "0")}</text>`;
    text += `<rect x="40" y="${h - 90}" width="${w - 80}" height="52" rx="14" fill="#000" opacity=".5"/><text x="64" y="${h - 56}" font-family="${FONT}" font-size="24" fill="#fff">${esc(game.title)} — captura ${idx + 1}</text>`;
  }

  const label = kind === "cover" ? `Capa do jogo ${game.title}` : kind === "banner" ? `Banner do jogo ${game.title}` : `Captura de tela ${idx + 1} de ${game.title}`;
  const bgAngle = (hash(game.slug) >> 5) % 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(label)}"><defs><linearGradient id="bg" x1="0" y1="0" x2="${bgAngle}" y2="1"><stop offset="0" stop-color="${p.bg1}"/><stop offset="1" stop-color="${p.bg2}"/></linearGradient><linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.ink}" stop-opacity="0"/><stop offset=".55" stop-color="${p.ink}" stop-opacity=".78"/><stop offset="1" stop-color="${p.ink}" stop-opacity=".95"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#bg)"/>${scene}${text}</svg>`;
}
