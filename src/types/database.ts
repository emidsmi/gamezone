// GERADO por scripts/gen-types.mjs a partir de supabase/migrations. Nao edite manualmente.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      activation_keys: {
        Row: {
          id: string
          library_item_id: string
          game_id: string
          key: string
          created_at: string
        }
        Insert: {
          id?: string
          library_item_id: string
          game_id: string
          key: string
          created_at?: string
        }
        Update: {
          id?: string
          library_item_id?: string
          game_id?: string
          key?: string
          created_at?: string
        }
        Relationships: [
          { foreignKeyName: "activation_keys_game_id_fkey"; columns: ["game_id"]; isOneToOne: false; referencedRelation: "games"; referencedColumns: ["id"] },
          { foreignKeyName: "activation_keys_library_item_id_fkey"; columns: ["library_item_id"]; isOneToOne: true; referencedRelation: "library_items"; referencedColumns: ["id"] }
        ]
      }
      cart_items: {
        Row: {
          cart_id: string
          game_id: string
          added_at: string
        }
        Insert: {
          cart_id: string
          game_id: string
          added_at?: string
        }
        Update: {
          cart_id?: string
          game_id?: string
          added_at?: string
        }
        Relationships: [
          { foreignKeyName: "cart_items_cart_id_fkey"; columns: ["cart_id"]; isOneToOne: false; referencedRelation: "carts"; referencedColumns: ["id"] },
          { foreignKeyName: "cart_items_game_id_fkey"; columns: ["game_id"]; isOneToOne: false; referencedRelation: "games"; referencedColumns: ["id"] }
        ]
      }
      carts: {
        Row: {
          id: string
          user_id: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          updated_at?: string
        }
        Relationships: [
          { foreignKeyName: "carts_user_id_fkey"; columns: ["user_id"]; isOneToOne: true; referencedRelation: "profiles"; referencedColumns: ["id"] }
        ]
      }
      categories: {
        Row: {
          id: string
          slug: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          created_at?: string
        }
        Relationships: []
      }
      game_platforms: {
        Row: {
          game_id: string
          platform_id: string
        }
        Insert: {
          game_id: string
          platform_id: string
        }
        Update: {
          game_id?: string
          platform_id?: string
        }
        Relationships: [
          { foreignKeyName: "game_platforms_game_id_fkey"; columns: ["game_id"]; isOneToOne: false; referencedRelation: "games"; referencedColumns: ["id"] },
          { foreignKeyName: "game_platforms_platform_id_fkey"; columns: ["platform_id"]; isOneToOne: false; referencedRelation: "platforms"; referencedColumns: ["id"] }
        ]
      }
      game_tags: {
        Row: {
          game_id: string
          tag_id: string
        }
        Insert: {
          game_id: string
          tag_id: string
        }
        Update: {
          game_id?: string
          tag_id?: string
        }
        Relationships: [
          { foreignKeyName: "game_tags_game_id_fkey"; columns: ["game_id"]; isOneToOne: false; referencedRelation: "games"; referencedColumns: ["id"] },
          { foreignKeyName: "game_tags_tag_id_fkey"; columns: ["tag_id"]; isOneToOne: false; referencedRelation: "tags"; referencedColumns: ["id"] }
        ]
      }
      games: {
        Row: {
          id: string
          slug: string
          title: string
          short_description: string
          description: string
          category_id: string
          studio: string
          publisher: string
          price_cents: number
          release_date: string
          age_rating: number
          cover_path: string | null
          banner_path: string | null
          gallery_paths: string[]
          system_requirements: Json
          avg_rating: number
          review_count: number
          sales_count: number
          is_featured: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          short_description: string
          description: string
          category_id: string
          studio: string
          publisher: string
          price_cents: number
          release_date: string
          age_rating?: number
          cover_path?: string | null
          banner_path?: string | null
          gallery_paths?: string[]
          system_requirements?: Json
          avg_rating?: number
          review_count?: number
          sales_count?: number
          is_featured?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          short_description?: string
          description?: string
          category_id?: string
          studio?: string
          publisher?: string
          price_cents?: number
          release_date?: string
          age_rating?: number
          cover_path?: string | null
          banner_path?: string | null
          gallery_paths?: string[]
          system_requirements?: Json
          avg_rating?: number
          review_count?: number
          sales_count?: number
          is_featured?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          { foreignKeyName: "games_category_id_fkey"; columns: ["category_id"]; isOneToOne: false; referencedRelation: "categories"; referencedColumns: ["id"] }
        ]
      }
      library_items: {
        Row: {
          id: string
          user_id: string
          game_id: string
          order_id: string
          acquired_at: string
        }
        Insert: {
          id?: string
          user_id: string
          game_id: string
          order_id: string
          acquired_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          game_id?: string
          order_id?: string
          acquired_at?: string
        }
        Relationships: [
          { foreignKeyName: "library_items_game_id_fkey"; columns: ["game_id"]; isOneToOne: false; referencedRelation: "games"; referencedColumns: ["id"] },
          { foreignKeyName: "library_items_order_id_fkey"; columns: ["order_id"]; isOneToOne: false; referencedRelation: "orders"; referencedColumns: ["id"] },
          { foreignKeyName: "library_items_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          game_id: string
          game_title: string
          unit_price_cents: number
          discount_percent: number
        }
        Insert: {
          id?: string
          order_id: string
          game_id: string
          game_title: string
          unit_price_cents: number
          discount_percent?: number
        }
        Update: {
          id?: string
          order_id?: string
          game_id?: string
          game_title?: string
          unit_price_cents?: number
          discount_percent?: number
        }
        Relationships: [
          { foreignKeyName: "order_items_game_id_fkey"; columns: ["game_id"]; isOneToOne: false; referencedRelation: "games"; referencedColumns: ["id"] },
          { foreignKeyName: "order_items_order_id_fkey"; columns: ["order_id"]; isOneToOne: false; referencedRelation: "orders"; referencedColumns: ["id"] }
        ]
      }
      orders: {
        Row: {
          id: string
          user_id: string
          status: Database["public"]["Enums"]["order_status"]
          total_cents: number
          created_at: string
          paid_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          status?: Database["public"]["Enums"]["order_status"]
          total_cents: number
          created_at?: string
          paid_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          status?: Database["public"]["Enums"]["order_status"]
          total_cents?: number
          created_at?: string
          paid_at?: string | null
        }
        Relationships: [
          { foreignKeyName: "orders_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }
        ]
      }
      payments: {
        Row: {
          id: string
          order_id: string
          status: Database["public"]["Enums"]["payment_status"]
          method: Database["public"]["Enums"]["payment_method"]
          amount_cents: number
          provider: string
          provider_ref: string | null
          failure_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          status?: Database["public"]["Enums"]["payment_status"]
          method: Database["public"]["Enums"]["payment_method"]
          amount_cents: number
          provider?: string
          provider_ref?: string | null
          failure_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          status?: Database["public"]["Enums"]["payment_status"]
          method?: Database["public"]["Enums"]["payment_method"]
          amount_cents?: number
          provider?: string
          provider_ref?: string | null
          failure_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          { foreignKeyName: "payments_order_id_fkey"; columns: ["order_id"]; isOneToOne: false; referencedRelation: "orders"; referencedColumns: ["id"] }
        ]
      }
      platforms: {
        Row: {
          id: string
          slug: string
          name: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          display_name: string
          role: Database["public"]["Enums"]["user_role"]
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name: string
          role?: Database["public"]["Enums"]["user_role"]
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string
          role?: Database["public"]["Enums"]["user_role"]
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          { foreignKeyName: "profiles_id_fkey"; columns: ["id"]; isOneToOne: true; referencedRelation: "users"; referencedColumns: ["id"] }
        ]
      }
      promotions: {
        Row: {
          id: string
          game_id: string
          discount_percent: number
          starts_at: string
          ends_at: string
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          game_id: string
          discount_percent: number
          starts_at?: string
          ends_at: string
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          game_id?: string
          discount_percent?: number
          starts_at?: string
          ends_at?: string
          active?: boolean
          created_at?: string
        }
        Relationships: [
          { foreignKeyName: "promotions_game_id_fkey"; columns: ["game_id"]; isOneToOne: false; referencedRelation: "games"; referencedColumns: ["id"] }
        ]
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          game_id: string
          author_name: string
          rating: number
          comment: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          game_id: string
          author_name?: string
          rating: number
          comment?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          game_id?: string
          author_name?: string
          rating?: number
          comment?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          { foreignKeyName: "reviews_game_id_fkey"; columns: ["game_id"]; isOneToOne: false; referencedRelation: "games"; referencedColumns: ["id"] },
          { foreignKeyName: "reviews_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }
        ]
      }
      tags: {
        Row: {
          id: string
          slug: string
          name: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          user_id: string
          game_id: string
          added_at: string
        }
        Insert: {
          user_id: string
          game_id: string
          added_at?: string
        }
        Update: {
          user_id?: string
          game_id?: string
          added_at?: string
        }
        Relationships: [
          { foreignKeyName: "wishlists_game_id_fkey"; columns: ["game_id"]; isOneToOne: false; referencedRelation: "games"; referencedColumns: ["id"] },
          { foreignKeyName: "wishlists_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }
        ]
      }
    }
    Views: {
      catalog_games: {
        Row: {
          id: string
          slug: string
          title: string
          short_description: string
          description: string
          category_id: string
          studio: string
          publisher: string
          price_cents: number
          release_date: string
          age_rating: number
          cover_path: string | null
          banner_path: string | null
          gallery_paths: string[]
          system_requirements: Json
          avg_rating: number
          review_count: number
          sales_count: number
          is_featured: boolean
          is_active: boolean
          created_at: string
          updated_at: string
          category_slug: string
          category_name: string
          discount_percent: number
          final_price_cents: number
          tag_slugs: string[]
          tag_names: string[]
          platform_slugs: string[]
        }
        Relationships: []
      }
    }
    Functions: {
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean }
      create_order_from_cart: { Args: { p_method: Database["public"]["Enums"]["payment_method"] }; Returns: Json }
      confirm_payment: {
        Args: { p_payment_id: string; p_status: Database["public"]["Enums"]["payment_status"]; p_provider_ref?: string; p_reason?: string }
        Returns: Json
      }
    }
    Enums: {
      order_status: "pending" | "paid" | "failed" | "cancelled"
      payment_method: "card" | "pix" | "boleto" | "free"
      payment_status: "pending" | "approved" | "declined" | "cancelled"
      user_role: "customer" | "admin"
    }
    CompositeTypes: { [_ in never]: never }
  }
}

type PublicSchema = Database["public"];
export type Tables<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Row"];
export type TablesInsert<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Update"];
export type Enums<T extends keyof PublicSchema["Enums"]> = PublicSchema["Enums"][T];
