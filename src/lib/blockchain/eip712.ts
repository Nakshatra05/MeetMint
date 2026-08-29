import type { Address, Hash } from "viem";
import { monadTestnet } from "@/lib/constants";

export const MEETMINT_DOMAIN = {
  name: "MeetMint",
  version: "1",
  chainId: monadTestnet.id,
} as const;

export const RELAY_DOMAIN = {
  ...MEETMINT_DOMAIN,
  verifyingContract: "0x0000000000000000000000000000000000000000" as Address,
} as const;

export const DEADLINE_SECONDS = 60 * 60; // 1 hour

export function getDeadline(): bigint {
  return BigInt(Math.floor(Date.now() / 1000) + DEADLINE_SECONDS);
}

export type RelayAction = "identity" | "encounter" | "claimDrop";

export type IdentityMessage = {
  user: Address;
  name: string;
  role: string;
  nonce: bigint;
  deadline: bigint;
};

export type EncounterMessage = {
  userA: Address;
  userB: Address;
  eventId: string;
  deadline: bigint;
};

export type ClaimDropMessage = {
  user: Address;
  eventId: string;
  nonce: bigint;
  deadline: bigint;
};

export const EIP712_TYPES = {
  CreateIdentity: [
    { name: "user", type: "address" },
    { name: "name", type: "string" },
    { name: "role", type: "string" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" },
  ],
  CreateEncounter: [
    { name: "userA", type: "address" },
    { name: "userB", type: "address" },
    { name: "eventId", type: "string" },
    { name: "deadline", type: "uint256" },
  ],
  ClaimDrop: [
    { name: "user", type: "address" },
    { name: "eventId", type: "string" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" },
  ],
} as const;

export type RelayPayload =
  | {
      action: "identity";
      signature: Hash;
      message: IdentityMessage;
    }
  | {
      action: "encounter";
      signature: Hash;
      message: EncounterMessage;
    }
  | {
      action: "claimDrop";
      signature: Hash;
      message: ClaimDropMessage;
    };

export type RelayResponse = {
  txHash: Hash;
  sponsored: true;
};
