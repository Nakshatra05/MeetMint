import type { UserProfile, Encounter, Quest, CollectionItem } from "@/lib/types";
import { getSupabase } from "./client";
import {
  rowToProfile,
  profileToRow,
  rowToEncounter,
  rowToQuest,
  questToRow,
  rowToCollection,
  profileToLeaderboardEntry,
} from "./mappers";

export async function fetchProfileByWallet(wallet: string): Promise<UserProfile | null> {
  const db = getSupabase();
  if (!db) return null;

  const { data, error } = await db
    .from("profiles")
    .select("*")
    .eq("wallet_address", wallet.toLowerCase())
    .maybeSingle();

  if (error || !data) return null;
  return rowToProfile(data);
}

export async function fetchProfileById(id: string): Promise<UserProfile | null> {
  const db = getSupabase();
  if (!db) return null;

  const { data, error } = await db.from("profiles").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;
  return rowToProfile(data);
}

export async function upsertProfile(profile: UserProfile): Promise<void> {
  const db = getSupabase();
  if (!db) return;

  const row = profileToRow(profile);
  await db.from("profiles").upsert({
    ...row,
    wallet_address: row.wallet_address?.toLowerCase() ?? null,
    updated_at: new Date().toISOString(),
  });
}

export async function fetchUserEncounters(userId: string): Promise<Encounter[]> {
  const db = getSupabase();
  if (!db) return [];

  const { data } = await db
    .from("encounters")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  return (data ?? []).map(rowToEncounter);
}

export async function insertEncounter(encounter: Encounter): Promise<void> {
  const db = getSupabase();
  if (!db) return;

  await db.from("encounters").upsert({
    id: encounter.id,
    encounter_number: encounter.encounterNumber,
    user_id: encounter.userId,
    met_user_id: encounter.metUserId,
    event_id: encounter.eventId,
    xp_earned: encounter.xpEarned,
    is_first_encounter: encounter.isFirstEncounter,
    tx_hash: encounter.txHash ?? null,
    verified: encounter.verified,
    created_at: encounter.timestamp,
  });
}

export async function fetchUserQuests(userId: string): Promise<Quest[]> {
  const db = getSupabase();
  if (!db) return [];

  const { data } = await db.from("user_quests").select("*").eq("user_id", userId);
  return (data ?? []).map(rowToQuest);
}

export async function upsertQuests(userId: string, quests: Quest[]): Promise<void> {
  const db = getSupabase();
  if (!db) return;

  const rows = quests.map((q) => questToRow(userId, q));
  await db.from("user_quests").upsert(rows);
}

export async function fetchUserCollection(userId: string): Promise<CollectionItem[]> {
  const db = getSupabase();
  if (!db) return [];

  const { data } = await db
    .from("collection_items")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  return (data ?? []).map(rowToCollection);
}

export async function insertCollectionItem(userId: string, item: CollectionItem): Promise<void> {
  const db = getSupabase();
  if (!db) return;

  await db.from("collection_items").upsert({
    id: item.id,
    user_id: userId,
    item_type: item.type,
    title: item.title,
    subtitle: item.subtitle,
    rarity: item.rarity,
    encounter_number: item.encounterNumber ?? null,
    emoji: item.emoji ?? null,
    color: item.color,
    met_at: item.metAt ?? null,
    avatar_url: item.avatarUrl ?? null,
  });
}

export async function fetchLeaderboard(currentUserId?: string) {
  const db = getSupabase();
  if (!db) return [];

  const { data } = await db
    .from("profiles")
    .select("*")
    .order("xp", { ascending: false })
    .limit(20);

  return (data ?? []).map((row, i) =>
    profileToLeaderboardEntry(rowToProfile(row), i + 1, row.id === currentUserId)
  );
}

export async function fetchNearbyProfiles(limit = 8): Promise<UserProfile[]> {
  const db = getSupabase();
  if (!db) return [];

  const { data } = await db.from("profiles").select("*").limit(limit);
  return (data ?? []).map(rowToProfile);
}

export async function hasDropClaim(userId: string, dropId: string): Promise<boolean> {
  const db = getSupabase();
  if (!db) return false;

  const { data } = await db
    .from("drop_claims")
    .select("drop_id")
    .eq("user_id", userId)
    .eq("drop_id", dropId)
    .maybeSingle();

  return Boolean(data);
}

export async function insertDropClaim(userId: string, dropId: string): Promise<void> {
  const db = getSupabase();
  if (!db) return;

  await db.from("drop_claims").upsert({ user_id: userId, drop_id: dropId });
}

export function subscribeToRealtime(
  onProfilesChange: () => void,
  onEncountersChange: () => void
) {
  const db = getSupabase();
  if (!db) return () => {};

  const channel = db
    .channel("meetmint-realtime")
    .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, onProfilesChange)
    .on("postgres_changes", { event: "*", schema: "public", table: "encounters" }, onEncountersChange)
    .subscribe();

  return () => {
    db.removeChannel(channel);
  };
}
