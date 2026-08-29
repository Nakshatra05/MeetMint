import type { Encounter } from "../types";

let encounterCounter = 2841;

export function generateEncounterNumber(): number {
  encounterCounter += 1;
  return encounterCounter;
}

export function createMockTxHash(): string {
  const chars = "0123456789abcdef";
  let hash = "0x";
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

export function createMockEncounter(
  userId: string,
  metUserId: string,
  eventId: string,
  xpEarned: number,
  isFirstEncounter: boolean
): Encounter {
  return {
    id: `enc-${Date.now()}`,
    encounterNumber: generateEncounterNumber(),
    userId,
    metUserId,
    eventId,
    xpEarned,
    timestamp: new Date().toISOString(),
    isFirstEncounter,
    txHash: createMockTxHash(),
    verified: true,
  };
}
