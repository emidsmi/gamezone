/** Dados serializáveis de cada jogo da experiência (passam do Server Component para o cliente). */
export type ExperienceGame = {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  category_name: string;
  studio: string;
  tag_names: string[];
  age_rating: number;
  price_cents: number;
  final_price_cents: number;
  discount_percent: number;
  cover_path: string | null;
  banner_path: string | null;
  owned: boolean;
};

export type ExperienceMode = "pending" | "3d" | "static";
export type Quality = "high" | "low";
