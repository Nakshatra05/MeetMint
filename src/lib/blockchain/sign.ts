import { signTypedData } from "@wagmi/core";
import type { Address, Hash } from "viem";
import { wagmiConfig } from "@/lib/wagmi/config";
import { CONTRACTS } from "./contracts";
import {
  EIP712_TYPES,
  MEETMINT_DOMAIN,
  RELAY_DOMAIN,
  getDeadline,
  type ClaimDropMessage,
  type EncounterMessage,
  type IdentityMessage,
  type RelayPayload,
  type RelayResponse,
} from "./eip712";

async function readNonce(action: "identity" | "claimDrop", user: Address): Promise<bigint> {
  const res = await fetch(`/api/relay/nonce?action=${action}&user=${user}`);
  if (!res.ok) return 0n;
  const data = (await res.json()) as { nonce: string };
  return BigInt(data.nonce);
}

export async function signCreateIdentity(user: Address, name: string, role: string) {
  const deadline = getDeadline();
  const nonce = await readNonce("identity", user);
  const message: IdentityMessage = { user, name, role, nonce, deadline };

  const signature = await signTypedData(wagmiConfig, {
    domain: { ...MEETMINT_DOMAIN, verifyingContract: CONTRACTS.identity as Address },
    types: { CreateIdentity: EIP712_TYPES.CreateIdentity },
    primaryType: "CreateIdentity",
    message,
  });

  return { signature, message };
}

export async function signCreateEncounter(userA: Address, userB: Address, eventId: string) {
  const deadline = getDeadline();
  const message: EncounterMessage = { userA, userB, eventId, deadline };

  const signature = await signTypedData(wagmiConfig, {
    domain: RELAY_DOMAIN,
    types: { CreateEncounter: EIP712_TYPES.CreateEncounter },
    primaryType: "CreateEncounter",
    message,
  });

  return { signature, message };
}

export async function signClaimDrop(user: Address, eventId: string) {
  const deadline = getDeadline();
  const nonce = await readNonce("claimDrop", user);
  const message: ClaimDropMessage = { user, eventId, nonce, deadline };

  const signature = await signTypedData(wagmiConfig, {
    domain: { ...MEETMINT_DOMAIN, verifyingContract: CONTRACTS.event as Address },
    types: { ClaimDrop: EIP712_TYPES.ClaimDrop },
    primaryType: "ClaimDrop",
    message,
  });

  return { signature, message };
}

export async function relayTransaction(payload: RelayPayload): Promise<RelayResponse> {
  const res = await fetch("/api/relay", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(err.error || "Relay failed");
  }

  return res.json() as Promise<RelayResponse>;
}
