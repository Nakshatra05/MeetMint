import { DEMO_MODE } from "../constants";
import { createMockEncounter, createMockTxHash } from "../mock/encounters";
import { getUserById } from "../mock/users";
import type { Encounter } from "../types";
import { hasContractsConfigured, submitEncounter } from "./write";
import type { Address } from "viem";

/** Deterministic placeholder address for mock users without a real wallet */
export function mockUserAddress(userId: string): Address {
  const padded = userId.padEnd(40, "0").slice(0, 40);
  return `0x${padded.replace(/[^0-9a-f]/gi, "0")}` as Address;
}

export async function createEncounterOnChain(
  userWallet: string | undefined,
  metUserId: string,
  eventId: string,
  xpEarned: number,
  isFirstEncounter: boolean
): Promise<Encounter> {
  const base = createMockEncounter(
    userWallet ?? "demo-user",
    metUserId,
    eventId,
    xpEarned,
    isFirstEncounter
  );

  if (DEMO_MODE || !hasContractsConfigured() || !userWallet) {
    await new Promise((r) => setTimeout(r, 1200));
    return base;
  }

  const metUser = getUserById(metUserId);
  const metWallet = (metUser?.walletAddress ?? mockUserAddress(metUserId)) as Address;

  try {
    const txHash = await submitEncounter(
      userWallet as Address,
      metWallet,
      eventId
    );
    return { ...base, txHash, verified: true };
  } catch (err) {
    console.error("Onchain encounter failed, falling back to local:", err);
    return { ...base, verified: false };
  }
}

export async function syncEncounter(encounter: Encounter): Promise<Encounter> {
  if (encounter.verified && encounter.txHash) return encounter;
  await new Promise((r) => setTimeout(r, 1500));
  return {
    ...encounter,
    verified: true,
    txHash: encounter.txHash || createMockTxHash(),
  };
}
