"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createEncounterOnChain } from "@/lib/blockchain/encounters";
import { submitClaimDrop } from "@/lib/blockchain/write";
import { getAvatarUrl, getAvatarColor } from "@/lib/avatars";
import { isDbEnabled } from "@/lib/db/client";
import {
  fetchProfileByWallet,
  fetchProfileById,
  upsertProfile,
  fetchUserEncounters,
  insertEncounter,
  fetchUserQuests,
  upsertQuests,
  fetchUserCollection,
  insertCollectionItem,
  fetchLeaderboard,
  fetchNearbyProfiles,
  hasDropClaim,
  insertDropClaim,
  subscribeToRealtime,
} from "@/lib/db/operations";
import { DEMO_MODE, XP_REWARDS } from "@/lib/constants";
import { calculateEncounterXP, getLevelFromXP } from "@/lib/game/xp";
import { MOCK_USERS, NEARBY_USERS, profilesToNearby } from "@/lib/mock/users";
import type {
  AppState,
  Badge,
  CollectionItem,
  Encounter,
  LeaderboardEntry,
  Quest,
  Role,
  Interest,
  UserProfile,
  EventDrop,
  NearbyUser,
} from "@/lib/types";

const STORAGE_KEY = "meetmint-state";

const DEFAULT_QUESTS: Quest[] = [
  {
    id: "blitz-quest",
    title: "MONAD BLITZ QUEST",
    description: "Meet 3 new people",
    emoji: "⚡",
    target: 3,
    progress: 0,
    rewardXP: 100,
    rewardBadge: "BLITZ EXPLORER",
    status: "active",
    metUserIds: [],
    type: "meet_count",
  },
  {
    id: "connector",
    title: "THE CONNECTOR",
    description: "Meet 10 unique people",
    emoji: "🤝",
    target: 10,
    progress: 0,
    rewardXP: 100,
    status: "active",
    metUserIds: [],
    type: "meet_unique",
  },
  {
    id: "builder-quest",
    title: "THE BUILDER",
    description: "Meet 3 builders",
    emoji: "🛠",
    target: 3,
    progress: 0,
    rewardXP: 100,
    status: "active",
    metUserIds: [],
    type: "meet_builders",
  },
  {
    id: "explorer",
    title: "THE EXPLORER",
    description: "Meet someone you've never met before",
    emoji: "🧭",
    target: 1,
    progress: 0,
    rewardXP: 50,
    status: "active",
    metUserIds: [],
    type: "meet_unique",
  },
];

const DEFAULT_BADGES: Badge[] = [
  { id: "first-meet", name: "First Connection", emoji: "🤝", description: "Met your first person", rarity: "COMMON" },
  { id: "blitz-explorer", name: "Blitz Explorer", emoji: "⚡", description: "Completed Monad Blitz Quest", rarity: "EPIC" },
  { id: "builder", name: "Builder Magnet", emoji: "🛠", description: "Met 3 builders", rarity: "RARE" },
  { id: "connector", name: "Super Connector", emoji: "🌐", description: "Met 10 unique people", rarity: "LEGENDARY" },
];

function buildInitialLeaderboard(currentUser: UserProfile | null): LeaderboardEntry[] {
  const entries = MOCK_USERS.map((u) => ({
    userId: u.id,
    name: u.name.split(" ")[0].toUpperCase(),
    xp: u.xp,
    rank: 0,
    avatar: u.avatar,
    avatarColor: u.avatarColor,
    isCurrentUser: currentUser?.id === u.id,
  }));

  if (currentUser && !entries.find((e) => e.userId === currentUser.id)) {
    entries.push({
      userId: currentUser.id,
      name: currentUser.name.split(" ")[0].toUpperCase(),
      xp: currentUser.xp,
      rank: 0,
      avatar: currentUser.avatar,
      avatarColor: currentUser.avatarColor,
      isCurrentUser: true,
    });
  }

  return entries.sort((a, b) => b.xp - a.xp).map((e, i) => ({ ...e, rank: i + 1 }));
}

function getDefaultDrop(quests: Quest[], claimedByUser = false): EventDrop {
  const blitzQuest = quests.find((q) => q.id === "blitz-quest");
  const metThree = (blitzQuest?.progress ?? 0) >= 3;
  return {
    id: "monad-blitz-2026",
    name: "MONAD BLITZ 2026",
    emoji: "⚡",
    total: 500,
    claimed: 382,
    requirements: [
      { label: "Attend event", met: true },
      { label: "Meet 3 people", met: metThree },
      { label: "Complete Blitz Quest", met: blitzQuest?.status === "completed" },
    ],
    claimedByUser,
  };
}

type MeetMintContextValue = {
  state: AppState;
  nearbyUsers: NearbyUser[];
  login: (opts?: { walletAddress?: string }) => void;
  logout: () => void;
  createProfile: (name: string, role: Role, interests: Interest[]) => Promise<void>;
  createEncounter: (metUserId: string) => Promise<{ encounter: Encounter; xpGained: number; completedQuests: Quest[] }>;
  claimDrop: () => Promise<void>;
  resetDemo: () => void;
  lastXPGain: number | null;
  clearLastXPGain: () => void;
  showEncounterSuccess: Encounter | null;
  setShowEncounterSuccess: (enc: Encounter | null) => void;
  dbEnabled: boolean;
};

const MeetMintContext = createContext<MeetMintContextValue | null>(null);

function getInitialState(): AppState {
  return {
    isAuthenticated: false,
    hasProfile: false,
    currentUser: null,
    encounters: [],
    quests: DEFAULT_QUESTS,
    badges: DEFAULT_BADGES,
    collection: [],
    leaderboard: buildInitialLeaderboard(null),
    eventDrop: getDefaultDrop(DEFAULT_QUESTS),
    attendedEvents: ["monad-blitz-delhi"],
  };
}

export function MeetMintProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(getInitialState);
  const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>(NEARBY_USERS);
  const [lastXPGain, setLastXPGain] = useState<number | null>(null);
  const [showEncounterSuccess, setShowEncounterSuccess] = useState<Encounter | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const dbEnabled = isDbEnabled();

  const refreshLeaderboard = useCallback(async (currentUserId?: string) => {
    if (!dbEnabled) return;
    const board = await fetchLeaderboard(currentUserId);
    if (board.length) {
      setState((s) => ({ ...s, leaderboard: board }));
    }
  }, [dbEnabled]);

  const refreshNearby = useCallback(async (excludeId?: string) => {
    if (!dbEnabled) return;
    const profiles = await fetchNearbyProfiles();
    if (profiles.length) {
      setNearbyUsers(profilesToNearby(profiles, excludeId));
    }
  }, [dbEnabled]);

  const loadUserFromDb = useCallback(async (wallet: string) => {
    if (!dbEnabled) return;

    const profile = await fetchProfileByWallet(wallet);
    if (!profile) return;

    const [encounters, quests, collection, claimed] = await Promise.all([
      fetchUserEncounters(profile.id),
      fetchUserQuests(profile.id),
      fetchUserCollection(profile.id),
      hasDropClaim(profile.id, "monad-blitz-2026"),
    ]);

    const questList = quests.length > 0 ? quests : DEFAULT_QUESTS;
    const leaderboard = await fetchLeaderboard(profile.id);

    setState((s) => ({
      ...s,
      isAuthenticated: true,
      hasProfile: true,
      connectedWallet: wallet,
      currentUser: profile,
      encounters,
      quests: questList,
      collection,
      leaderboard: leaderboard.length ? leaderboard : buildInitialLeaderboard(profile),
      eventDrop: getDefaultDrop(questList, claimed),
    }));

    await refreshNearby(profile.id);
  }, [dbEnabled, refreshNearby]);

  useEffect(() => {
    if (dbEnabled) {
      setHydrated(true);
      refreshLeaderboard();
      refreshNearby();
      return;
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setState(JSON.parse(saved) as AppState);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, [dbEnabled, refreshLeaderboard, refreshNearby]);

  useEffect(() => {
    if (!dbEnabled && hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, hydrated, dbEnabled]);

  useEffect(() => {
    if (state.connectedWallet && dbEnabled) {
      loadUserFromDb(state.connectedWallet);
    }
  }, [state.connectedWallet, dbEnabled, loadUserFromDb]);

  useEffect(() => {
    if (!dbEnabled) return;

    const unsubscribe = subscribeToRealtime(
      () => refreshLeaderboard(state.currentUser?.id),
      () => refreshLeaderboard(state.currentUser?.id)
    );

    return unsubscribe;
  }, [dbEnabled, refreshLeaderboard, state.currentUser?.id]);

  const login = useCallback((opts?: { walletAddress?: string }) => {
    const wallet = opts?.walletAddress?.toLowerCase();
    setState((s) => ({
      ...s,
      isAuthenticated: true,
      connectedWallet: wallet ?? s.connectedWallet,
    }));
  }, []);

  const logout = useCallback(() => {
    if (!dbEnabled) localStorage.removeItem(STORAGE_KEY);
    setState(getInitialState());
    setNearbyUsers(NEARBY_USERS);
  }, [dbEnabled]);

  const createProfile = useCallback(async (name: string, role: Role, interests: Interest[]) => {
    const seed = name.trim().toLowerCase();
    const wallet = state.connectedWallet?.toLowerCase();
    const userId = wallet ?? `user-${Date.now()}`;

    const user: UserProfile = {
      id: userId,
      name,
      role,
      interests,
      avatar: getAvatarUrl(wallet ?? seed),
      avatarColor: getAvatarColor(wallet ?? seed),
      xp: 0,
      level: 1,
      encounterCount: 0,
      badgeCount: 0,
      eventCount: 1,
      cityCount: 1,
      rarity: "COMMON",
      walletAddress: wallet,
      qrPayload: wallet ? `meetmint:${wallet}` : `meetmint:${userId}`,
    };

    setState((s) => ({
      ...s,
      hasProfile: true,
      currentUser: user,
      quests: DEFAULT_QUESTS,
      leaderboard: buildInitialLeaderboard(user),
    }));

    if (dbEnabled) {
      await upsertProfile(user);
      await upsertQuests(user.id, DEFAULT_QUESTS);
      await refreshLeaderboard(user.id);
      await refreshNearby(user.id);
    }
  }, [dbEnabled, state.connectedWallet, refreshLeaderboard, refreshNearby]);

  const resolveMetUser = useCallback(async (metUserId: string): Promise<UserProfile | undefined> => {
    let metUser = MOCK_USERS.find((u) => u.id === metUserId);
    if (!metUser && dbEnabled) {
      metUser = (await fetchProfileById(metUserId)) ?? undefined;
    }
    return metUser;
  }, [dbEnabled]);

  const createEncounter = useCallback(
    async (metUserId: string) => {
      const metUser = await resolveMetUser(metUserId);
      if (!metUser || !state.currentUser) {
        throw new Error("User not found");
      }

      const alreadyMet = state.encounters.some((e) => e.metUserId === metUserId);
      const isFirstEver = state.encounters.length === 0;
      const isFirstWithPerson = !alreadyMet;
      const xpGained = calculateEncounterXP(isFirstEver);

      const encounter = await createEncounterOnChain(
        state.connectedWallet ?? state.currentUser.walletAddress,
        metUserId,
        "monad-blitz-delhi",
        xpGained,
        isFirstWithPerson
      );

      const newXP = state.currentUser.xp + xpGained;
      const collectionItem: CollectionItem = {
        id: `col-${encounter.id}`,
        type: "person",
        title: metUser.name.split(" ")[0].toUpperCase(),
        subtitle: metUser.role,
        rarity: metUser.rarity,
        encounterNumber: encounter.encounterNumber,
        color: metUser.avatarColor,
        metAt: "MONAD BLITZ DELHI",
        avatarUrl: metUser.avatar,
      };

      const updatedQuests = state.quests.map((q) => {
        if (q.status === "completed") return q;
        const metIds = q.metUserIds.includes(metUserId) ? q.metUserIds : [...q.metUserIds, metUserId];

        let progress = q.progress;
        if (q.type === "meet_count" || q.type === "meet_unique") {
          progress = metIds.length;
        } else if (q.type === "meet_builders" && metUser.role === "BUILDER") {
          progress = metIds.filter((id) => {
            const u = MOCK_USERS.find((m) => m.id === id);
            return u?.role === "BUILDER";
          }).length;
        }

        const completed = progress >= q.target;
        return {
          ...q,
          metUserIds: metIds,
          progress: Math.min(progress, q.target),
          status: completed ? ("completed" as const) : q.status,
        };
      });

      const completedQuests = updatedQuests.filter(
        (q) => q.status === "completed" && state.quests.find((oq) => oq.id === q.id)?.status === "active"
      );

      let bonusXP = 0;
      completedQuests.forEach(() => {
        bonusXP += XP_REWARDS.questComplete;
      });

      const finalXP = newXP + bonusXP;
      const updatedUser: UserProfile = {
        ...state.currentUser,
        xp: finalXP,
        level: getLevelFromXP(finalXP),
        encounterCount: state.currentUser.encounterCount + 1,
        badgeCount: state.currentUser.badgeCount + completedQuests.length,
      };

      const updatedLeaderboard = buildInitialLeaderboard(updatedUser)
        .map((entry) =>
          entry.userId === updatedUser.id
            ? { ...entry, xp: finalXP, avatar: updatedUser.avatar }
            : entry
        )
        .sort((a, b) => b.xp - a.xp)
        .map((e, i) => ({ ...e, rank: i + 1 }));

      setState((s) => ({
        ...s,
        currentUser: updatedUser,
        encounters: [...s.encounters, encounter],
        quests: updatedQuests,
        collection: [...s.collection, collectionItem],
        leaderboard: updatedLeaderboard,
        eventDrop: getDefaultDrop(updatedQuests, s.eventDrop.claimedByUser),
      }));

      if (dbEnabled) {
        await upsertProfile(updatedUser);
        await insertEncounter({ ...encounter, userId: updatedUser.id });
        await upsertQuests(updatedUser.id, updatedQuests);
        await insertCollectionItem(updatedUser.id, collectionItem);
        await refreshLeaderboard(updatedUser.id);
      }

      setLastXPGain(xpGained + bonusXP);
      setShowEncounterSuccess(encounter);

      return { encounter, xpGained: xpGained + bonusXP, completedQuests };
    },
    [state.currentUser, state.encounters, state.quests, state.connectedWallet, dbEnabled, resolveMetUser, refreshLeaderboard]
  );

  const claimDrop = useCallback(async () => {
    if (!state.currentUser) return;
    const canClaim = state.eventDrop.requirements.every((r) => r.met);
    if (!canClaim || state.eventDrop.claimedByUser) return;

    if (!DEMO_MODE && state.connectedWallet) {
      try {
        await submitClaimDrop("monad-blitz-delhi");
      } catch (err) {
        console.error("Onchain claim failed:", err);
        return;
      }
    }

    if (dbEnabled) {
      await insertDropClaim(state.currentUser.id, "monad-blitz-2026");
    }

    setState((s) => {
      if (!s.currentUser) return s;
      const newXP = s.currentUser.xp + XP_REWARDS.eventDrop;
      const updatedUser = {
        ...s.currentUser,
        xp: newXP,
        level: getLevelFromXP(newXP),
        badgeCount: s.currentUser.badgeCount + 1,
      };

      if (dbEnabled) void upsertProfile(updatedUser);

      return {
        ...s,
        currentUser: updatedUser,
        eventDrop: { ...s.eventDrop, claimed: s.eventDrop.claimed + 1, claimedByUser: true },
        collection: [
          ...s.collection,
          {
            id: "drop-monad-blitz-2026",
            type: "event" as const,
            title: "MONAD BLITZ 2026",
            subtitle: `#${s.eventDrop.claimed + 1} / ${s.eventDrop.total}`,
            rarity: "LEGENDARY" as const,
            emoji: "⚡",
            color: "#836EF9",
          },
        ],
      };
    });
    setLastXPGain(XP_REWARDS.eventDrop);
  }, [state.currentUser, state.eventDrop, state.connectedWallet, dbEnabled]);

  const resetDemo = useCallback(() => {
    if (!dbEnabled) localStorage.removeItem(STORAGE_KEY);
    setState(getInitialState());
    setNearbyUsers(NEARBY_USERS);
    setLastXPGain(null);
    setShowEncounterSuccess(null);
  }, [dbEnabled]);

  const clearLastXPGain = useCallback(() => setLastXPGain(null), []);

  const value = useMemo(
    () => ({
      state,
      nearbyUsers,
      login,
      logout,
      createProfile,
      createEncounter,
      claimDrop,
      resetDemo,
      lastXPGain,
      clearLastXPGain,
      showEncounterSuccess,
      setShowEncounterSuccess,
      dbEnabled,
    }),
    [state, nearbyUsers, login, logout, createProfile, createEncounter, claimDrop, resetDemo, lastXPGain, clearLastXPGain, showEncounterSuccess, dbEnabled]
  );

  if (!hydrated) return null;

  return <MeetMintContext.Provider value={value}>{children}</MeetMintContext.Provider>;
}

export function useMeetMint() {
  const ctx = useContext(MeetMintContext);
  if (!ctx) throw new Error("useMeetMint must be used within MeetMintProvider");
  return ctx;
}
