import { formatPrice } from "@/lib/format";

export function PriceTag({ game, size = "md" }: { game: { price_cents: number; final_price_cents: number; discount_percent: number }; size?: "md" | "lg" }) {
  const big = size === "lg";
  return (
    <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-0.5">
      {game.discount_percent > 0 && (
        <span className="rounded bg-ok px-1.5 py-0.5 text-xs font-extrabold text-black" aria-label={`${game.discount_percent}% de desconto`}>
          -{game.discount_percent}%
        </span>
      )}
      {game.discount_percent > 0 && (
        <s className={`${big ? "text-base" : "text-xs"} text-muted`} aria-label={`de ${formatPrice(game.price_cents)}`}>
          {formatPrice(game.price_cents)}
        </s>
      )}
      <span className={`${big ? "text-2xl" : "text-sm"} font-extrabold ${game.final_price_cents === 0 ? "text-ok" : ""}`}>
        {formatPrice(game.final_price_cents)}
      </span>
    </span>
  );
}
