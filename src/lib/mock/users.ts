import { getAvatarUrl, getAvatarColor } from "../avatars";
import type { UserProfile, NearbyUser } from "../types";

function withAvatar(user: Omit<UserProfile, "avatar" | "avatarColor"> & { avatar?: string; avatarColor?: string }): UserProfile {
  return {
    ...user,
    avatar: user.avatar ?? getAvatarUrl(user.id),
    avatarColor: user.avatarColor ?? getAvatarColor(user.id),
  } as UserProfile;
}

export const MOCK_USERS: UserProfile[] = [
  withAvatar({
    id: "arjun",
    name: "Arjun Mehta",
    role: "BUILDER",
    interests: ["MONAD", "SOLIDITY", "WEB3"],
    bio: "Building cool things onchain.",
    xp: 380,
    level: 3,
    encounterCount: 42,
    badgeCount: 6,
    eventCount: 4,
    cityCount: 3,
    rarity: "RARE",
    qrPayload: "meetmint:arjun",
  }),
  withAvatar({
    id: "riya",
    name: "Riya Sharma",
    role: "CREATOR",
    interests: ["AI", "CONTENT", "DESIGN"],
    bio: "Creating stories at the intersection of AI and culture.",
    xp: 350,
    level: 3,
    encounterCount: 38,
    badgeCount: 5,
    eventCount: 3,
    cityCount: 2,
    rarity: "EPIC",
    qrPayload: "meetmint:riya",
  }),
  withAvatar({
    id: "dev",
    name: "Dev Patel",
    role: "DEVELOPER",
    interests: ["DEFI", "WEB3", "STARTUPS"],
    bio: "Shipping DeFi infra that actually works.",
    xp: 325,
    level: 3,
    encounterCount: 35,
    badgeCount: 4,
    eventCount: 3,
    cityCount: 2,
    rarity: "COMMON",
    qrPayload: "meetmint:dev",
  }),
  withAvatar({
    id: "ananya",
    name: "Ananya Rao",
    role: "DESIGNER",
    interests: ["DESIGN", "UX", "STARTUPS"],
    bio: "Designing products people actually love.",
    xp: 290,
    level: 2,
    encounterCount: 28,
    badgeCount: 4,
    eventCount: 2,
    cityCount: 2,
    rarity: "RARE",
    qrPayload: "meetmint:ananya",
  }),
  withAvatar({
    id: "karan",
    name: "Karan Singh",
    role: "FOUNDER",
    interests: ["CONSUMER", "WEB3", "STARTUPS"],
    bio: "Consumer apps are the future of Web3.",
    xp: 290,
    level: 2,
    encounterCount: 31,
    badgeCount: 5,
    eventCount: 3,
    cityCount: 3,
    rarity: "LEGENDARY",
    qrPayload: "meetmint:karan",
  }),
  withAvatar({
    id: "ankit",
    name: "Ankit Verma",
    role: "RESEARCHER",
    interests: ["AI", "WEB3", "GAMING"],
    bio: "Researching the next wave of onchain games.",
    xp: 290,
    level: 2,
    encounterCount: 26,
    badgeCount: 3,
    eventCount: 2,
    cityCount: 1,
    rarity: "COMMON",
    qrPayload: "meetmint:ankit",
  }),
  withAvatar({
    id: "nakshatra",
    name: "Nakshatra Goel",
    role: "BUILDER",
    interests: ["MONAD", "WEB3", "STARTUPS"],
    bio: "MeetMint explorer. Always hunting for builders.",
    xp: 425,
    level: 4,
    encounterCount: 47,
    badgeCount: 7,
    eventCount: 5,
    cityCount: 4,
    rarity: "EPIC",
    qrPayload: "meetmint:nakshatra",
  }),
];

export const NEARBY_USERS: NearbyUser[] = [
  { ...MOCK_USERS[0], distance: "12m", label: "RARE", mapX: 65, mapY: 25 },
  { ...MOCK_USERS[1], distance: "28m", label: "HOT", mapX: 30, mapY: 40 },
  { ...MOCK_USERS[2], distance: "45m", label: "NEW", mapX: 75, mapY: 55 },
  { ...MOCK_USERS[3], distance: "52m", mapX: 20, mapY: 65 },
  { ...MOCK_USERS[4], distance: "68m", label: "RARE", mapX: 55, mapY: 75 },
];

export function getUserById(id: string): UserProfile | undefined {
  return MOCK_USERS.find((u) => u.id === id);
}

export function getUserByQrPayload(payload: string): UserProfile | undefined {
  const id = payload.replace("meetmint:", "");
  return getUserById(id);
}

/** Build nearby list from DB profiles with map positions */
export function profilesToNearby(profiles: UserProfile[], excludeId?: string): NearbyUser[] {
  const positions = [
    { distance: "12m", label: "RARE" as const, mapX: 65, mapY: 25 },
    { distance: "28m", label: "HOT" as const, mapX: 30, mapY: 40 },
    { distance: "45m", label: "NEW" as const, mapX: 75, mapY: 55 },
    { distance: "52m", mapX: 20, mapY: 65 },
    { distance: "68m", label: "RARE" as const, mapX: 55, mapY: 75 },
  ];

  return profiles
    .filter((p) => p.id !== excludeId)
    .slice(0, 5)
    .map((p, i) => {
      const pos = positions[i] ?? { distance: `${20 + i * 15}m`, mapX: 50, mapY: 50 };
      return {
        ...p,
        distance: pos.distance,
        mapX: pos.mapX,
        mapY: pos.mapY,
        label: "label" in pos ? pos.label : undefined,
      };
    });
}
