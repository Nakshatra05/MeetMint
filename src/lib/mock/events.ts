import { BLITZ_EVENT } from "../constants";
import type { GameEvent } from "../types";

export const MOCK_EVENTS: GameEvent[] = [
  BLITZ_EVENT,
  {
    id: "ethindia",
    name: "ETHIndia",
    shortName: "ETHINDIA",
    city: "BANGALORE",
    date: "2025-12-15",
    participants: 1200,
    encounters: 3400,
    quests: 8,
    drops: 5,
    emoji: "🇮🇳",
  },
  {
    id: "devcon",
    name: "Devcon",
    shortName: "DEVCON",
    city: "BANGKOK",
    date: "2025-11-12",
    participants: 6000,
    encounters: 12000,
    quests: 12,
    drops: 8,
    emoji: "🌏",
  },
];

export { BLITZ_EVENT };
