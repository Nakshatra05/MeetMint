export const SPONSORED_TX =
  process.env.NEXT_PUBLIC_SPONSORED_TX === "true" ||
  Boolean(process.env.SPONSOR_PRIVATE_KEY);

export const IDENTITY_ABI = [
  {
    name: "createIdentity",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "name", type: "string" },
      { name: "role", type: "string" },
    ],
    outputs: [{ name: "tokenId", type: "uint256" }],
  },
  {
    name: "createIdentityWithSig",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "user", type: "address" },
      { name: "name", type: "string" },
      { name: "role", type: "string" },
      { name: "deadline", type: "uint256" },
      { name: "signature", type: "bytes" },
    ],
    outputs: [{ name: "tokenId", type: "uint256" }],
  },
  {
    name: "nonces",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

export const ENCOUNTER_ABI = [
  {
    name: "createEncounter",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "userA", type: "address" },
      { name: "userB", type: "address" },
      { name: "eventId", type: "string" },
    ],
    outputs: [{ name: "encounterId", type: "uint256" }],
  },
  {
    name: "EncounterCreated",
    type: "event",
    inputs: [
      { name: "encounterId", type: "uint256", indexed: true },
      { name: "userA", type: "address", indexed: true },
      { name: "userB", type: "address", indexed: true },
    ],
  },
] as const;

export const BADGE_ABI = [
  {
    name: "awardBadge",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "user", type: "address" },
      { name: "badgeId", type: "string" },
    ],
    outputs: [],
  },
] as const;

export const EVENT_ABI = [
  {
    name: "claimDrop",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "eventId", type: "string" }],
    outputs: [],
  },
  {
    name: "claimDropWithSig",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "user", type: "address" },
      { name: "eventId", type: "string" },
      { name: "deadline", type: "uint256" },
      { name: "signature", type: "bytes" },
    ],
    outputs: [],
  },
  {
    name: "nonces",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

export const CONTRACTS = {
  identity: process.env.NEXT_PUBLIC_IDENTITY_CONTRACT || "",
  encounter: process.env.NEXT_PUBLIC_ENCOUNTER_CONTRACT || "",
  badge: process.env.NEXT_PUBLIC_BADGE_CONTRACT || "",
  event: process.env.NEXT_PUBLIC_EVENT_CONTRACT || "",
};
