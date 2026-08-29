import { defineChain } from "viem";

export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export const monadTestnet = defineChain({
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testnet-rpc.monad.xyz"] },
  },
  blockExplorers: {
    default: { name: "MonadVision", url: "https://testnet.monadvision.com" },
  },
});

/** @deprecated use monadTestnet */
export const MONAD_TESTNET = monadTestnet;

export const XP_REWARDS = {
  firstEncounter: 50,
  normalEncounter: 25,
  questComplete: 100,
  attendEvent: 100,
  eventDrop: 250,
} as const;

export const ROLES = [
  "BUILDER",
  "CREATOR",
  "FOUNDER",
  "DESIGNER",
  "RESEARCHER",
  "DEVELOPER",
] as const;

export const INTERESTS = [
  "WEB3",
  "AI",
  "GAMING",
  "STARTUPS",
  "DESIGN",
] as const;

export const BLITZ_EVENT = {
  id: "monad-blitz-delhi",
  name: "Monad Blitz Delhi",
  shortName: "MONAD BLITZ",
  city: "DELHI",
  date: "2026-08-29",
  participants: 82,
  encounters: 147,
  quests: 5,
  drops: 3,
  emoji: "⚡",
} as const;

export const BRAND = {
  name: "MeetMint",
  tagline: "Meet people. Mint memories.",
  poweredBy: "POWERED BY MONAD",
} as const;
