import type {
  UserProfile,
  Encounter,
  Quest,
  CollectionItem,
  LeaderboardEntry,
  Role,
  Interest,
  Rarity,
  QuestStatus,
} from "@/lib/types";
import type { ProfileRow, EncounterRow, QuestRow, CollectionRow } from "./client";

export function rowToProfile(row: ProfileRow): UserProfile {
  return {
    id: row.id,
    name: row.name,
    role: row.role as Role,
    interests: row.interests as Interest[],
    bio: row.bio ?? undefined,
    avatar: row.avatar_url,
    avatarColor: row.avatar_color,
    xp: row.xp,
    level: row.level,
    encounterCount: row.encounter_count,
    badgeCount: row.badge_count,
    eventCount: row.event_count,
    cityCount: row.city_count,
    rarity: row.rarity as Rarity,
    walletAddress: row.wallet_address ?? undefined,
    qrPayload: row.qr_payload,
  };
}

export function profileToRow(profile: UserProfile): ProfileRow {
  return {
    id: profile.id,
    wallet_address: profile.walletAddress ?? null,
    name: profile.name,
    role: profile.role,
    interests: profile.interests,
    bio: profile.bio ?? null,
    avatar_url: profile.avatar,
    avatar_color: profile.avatarColor,
    xp: profile.xp,
    level: profile.level,
    encounter_count: profile.encounterCount,
    badge_count: profile.badgeCount,
    event_count: profile.eventCount,
    city_count: profile.cityCount,
    rarity: profile.rarity,
    qr_payload: profile.qrPayload,
  };
}

export function rowToEncounter(row: EncounterRow): Encounter {
  return {
    id: row.id,
    encounterNumber: row.encounter_number,
    userId: row.user_id,
    metUserId: row.met_user_id,
    eventId: row.event_id,
    xpEarned: row.xp_earned,
    timestamp: row.created_at,
    isFirstEncounter: row.is_first_encounter,
    txHash: row.tx_hash ?? undefined,
    verified: row.verified,
  };
}

export function rowToQuest(row: QuestRow): Quest {
  return {
    id: row.quest_id,
    title: row.title,
    description: row.description,
    emoji: row.emoji,
    target: row.target,
    progress: row.progress,
    rewardXP: row.reward_xp,
    rewardBadge: row.reward_badge ?? undefined,
    status: row.status as QuestStatus,
    metUserIds: row.met_user_ids,
    type: row.quest_type as Quest["type"],
  };
}

export function questToRow(userId: string, quest: Quest): QuestRow {
  return {
    user_id: userId,
    quest_id: quest.id,
    title: quest.title,
    description: quest.description,
    emoji: quest.emoji,
    target: quest.target,
    progress: quest.progress,
    reward_xp: quest.rewardXP,
    reward_badge: quest.rewardBadge ?? null,
    status: quest.status,
    met_user_ids: quest.metUserIds,
    quest_type: quest.type,
  };
}

export function rowToCollection(row: CollectionRow): CollectionItem {
  return {
    id: row.id,
    type: row.item_type as CollectionItem["type"],
    title: row.title,
    subtitle: row.subtitle,
    rarity: row.rarity as Rarity,
    encounterNumber: row.encounter_number ?? undefined,
    emoji: row.emoji ?? undefined,
    color: row.color,
    metAt: row.met_at ?? undefined,
    avatarUrl: row.avatar_url ?? undefined,
  };
}

export function profileToLeaderboardEntry(
  profile: UserProfile,
  rank: number,
  isCurrentUser?: boolean
): LeaderboardEntry {
  return {
    userId: profile.id,
    name: profile.name.split(" ")[0].toUpperCase(),
    xp: profile.xp,
    rank,
    avatar: profile.avatar,
    avatarColor: profile.avatarColor,
    isCurrentUser,
  };
}
