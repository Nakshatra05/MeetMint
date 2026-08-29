import {
  writeContract,
  waitForTransactionReceipt,
  simulateContract,
} from "@wagmi/core";
import type { Address, Hash } from "viem";
import { wagmiConfig } from "@/lib/wagmi/config";
import {
  CONTRACTS,
  ENCOUNTER_ABI,
  IDENTITY_ABI,
  EVENT_ABI,
} from "./contracts";

export function hasContractsConfigured(): boolean {
  return Boolean(CONTRACTS.encounter && CONTRACTS.identity);
}

export async function submitIdentity(name: string, role: string): Promise<Hash> {
  if (!CONTRACTS.identity) throw new Error("Identity contract not configured");

  const hash = await writeContract(wagmiConfig, {
    address: CONTRACTS.identity as Address,
    abi: IDENTITY_ABI,
    functionName: "createIdentity",
    args: [name, role],
  });

  await waitForTransactionReceipt(wagmiConfig, { hash });
  return hash;
}

export async function submitEncounter(
  userA: Address,
  userB: Address,
  eventId: string
): Promise<Hash> {
  if (!CONTRACTS.encounter) throw new Error("Encounter contract not configured");

  const { request } = await simulateContract(wagmiConfig, {
    address: CONTRACTS.encounter as Address,
    abi: ENCOUNTER_ABI,
    functionName: "createEncounter",
    args: [userA, userB, eventId],
  });

  const hash = await writeContract(wagmiConfig, request);
  await waitForTransactionReceipt(wagmiConfig, { hash });
  return hash;
}

export async function submitClaimDrop(eventId: string): Promise<Hash> {
  if (!CONTRACTS.event) throw new Error("Event contract not configured");

  const hash = await writeContract(wagmiConfig, {
    address: CONTRACTS.event as Address,
    abi: EVENT_ABI,
    functionName: "claimDrop",
    args: [eventId],
  });

  await waitForTransactionReceipt(wagmiConfig, { hash });
  return hash;
}
