export type Role =
  | "BUILDER"
  | "CREATOR"
  | "FOUNDER"
  | "DESIGNER"
  | "RESEARCHER"
  | "DEVELOPER";

export type Interest =
  | "WEB3"
  | "AI"
  | "GAMING"
  | "STARTUPS"
  | "DESIGN"
  | "MONAD"
  | "SOLIDITY"
  | "DEFI"
  | "CONTENT"
  | "UX"
  | "CONSUMER";

export type Rarity = "COMMON" | "RARE" | "EPIC" | "LEGENDARY";

export type UserProfile = {
  id: string;
  name: string;
  role: Role;
  interests: Interest[];
  bio?: string;
  avatar: string;
  avatarColor: string;
  xp: number;
  level: number;
  encounterCount: number;
  badgeCount: number;
  eventCount: number;
  cityCount: number;
  rarity: Rarity;
  walletAddress?: string;
  qrPayload: string;
};

export type GameEvent = {
  id: string;
  name: string;
  shortName: string;
  city: string;
  date: string;
  participants: number;
  encounters: number;
  quests: number;
  drops: number;
  emoji: string;
};

export type Encounter = {
  id: string;
  encounterNumber: number;
  userId: string;
  metUserId: string;
  eventId: string;
  xpEarned: number;
  timestamp: string;
  isFirstEncounter: boolean;
  txHash?: string;
  verified: boolean;
};

export type QuestStatus = "active" | "completed";

export type Quest = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  target: number;
  progress: number;
  rewardXP: number;
  rewardBadge?: string;
  status: QuestStatus;
  metUserIds: string[];
  type: "meet_count" | "meet_builders" | "meet_unique" | "speedrun";
};

export type Badge = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  rarity: Rarity;
  unlockedAt?: string;
};

export type CollectionItem = {
  id: string;
  type: "person" | "event" | "badge";
  title: string;
  subtitle: string;
  rarity: Rarity;
  encounterNumber?: number;
  emoji?: string;
  color: string;
  metAt?: string;
  avatarUrl?: string;
};

export type LeaderboardEntry = {
  userId: string;
  name: string;
  xp: number;
  rank: number;
  avatar: string;
  avatarColor: string;
  isCurrentUser?: boolean;
};

export type EventDrop = {
  id: string;
  name: string;
  emoji: string;
  total: number;
  claimed: number;
  requirements: { label: string; met: boolean }[];
  claimedByUser: boolean;
};

export type NearbyUser = UserProfile & {
  distance: string;
  label?: "HOT" | "RARE" | "NEW";
  mapX: number;
  mapY: number;
};

export type AppState = {
  isAuthenticated: boolean;
  hasProfile: boolean;
  connectedWallet?: string;
  currentUser: UserProfile | null;
  encounters: Encounter[];
  quests: Quest[];
  badges: Badge[];
  collection: CollectionItem[];
  leaderboard: LeaderboardEntry[];
  eventDrop: EventDrop;
  attendedEvents: string[];
};
