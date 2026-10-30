export function Stars({ value, size = 16, showValue = false, count }: { value: number; size?: number; showValue?: boolean; count?: number }) {
  const full = Math.round(value);
  return (
    <span className="inline-flex items-center gap-1" role="img" aria-label={`Nota ${value.toFixed(1)} de 5${count !== undefined ? `, ${count} avaliações` : ""}`}>
      <span aria-hidden="true" className="inline-flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg key={i} width={size} height={size} viewBox="0 0 20 20" fill={i <= full ? "#a3e635" : "#54212d"}>
            <path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L1.4 7.8l6-.8z" />
          </svg>
        ))}
      </span>
      {showValue && <span className="text-sm font-semibold">{value.toFixed(1)}</span>}
      {count !== undefined && <span className="text-sm text-muted">({count})</span>}
    </span>
  );
}
