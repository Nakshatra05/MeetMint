import { createClient, SupabaseClient } from "@supabase/supabase-js";

export type ProfileRow = {
  id: string;
  wallet_address: string | null;
  name: string;
  role: string;
  interests: string[];
  bio: string | null;
  avatar_url: string;
  avatar_color: string;
  xp: number;
  level: number;
  encounter_count: number;
  badge_count: number;
  event_count: number;
  city_count: number;
  rarity: string;
  qr_payload: string;
};

export type EncounterRow = {
  id: string;
  encounter_number: number;
  user_id: string;
  met_user_id: string;
  event_id: string;
  xp_earned: number;
  is_first_encounter: boolean;
  tx_hash: string | null;
  verified: boolean;
  created_at: string;
};

export type QuestRow = {
  user_id: string;
  quest_id: string;
  title: string;
  description: string;
  emoji: string;
  target: number;
  progress: number;
  reward_xp: number;
  reward_badge: string | null;
  status: string;
  met_user_ids: string[];
  quest_type: string;
};

export type CollectionRow = {
  id: string;
  user_id: string;
  item_type: string;
  title: string;
  subtitle: string;
  rarity: string;
  encounter_number: number | null;
  emoji: string | null;
  color: string;
  met_at: string | null;
  avatar_url: string | null;
};

export const isDbEnabled = (): boolean =>
  Boolean(
    typeof window !== "undefined"
      ? process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      : process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isDbEnabled()) return null;
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return client;
}
