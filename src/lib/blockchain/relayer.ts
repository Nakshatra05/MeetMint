import {
  createPublicClient,
  createWalletClient,
  http,
  verifyTypedData,
  type Address,
  type Hash,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { monadTestnet } from "@/lib/constants";
import {
  CONTRACTS,
  ENCOUNTER_ABI,
  EVENT_ABI,
  IDENTITY_ABI,
} from "@/lib/blockchain/contracts";
import {
  EIP712_TYPES,
  MEETMINT_DOMAIN,
  RELAY_DOMAIN,
  type RelayPayload,
} from "@/lib/blockchain/eip712";

const SPONSOR_KEY = process.env.SPONSOR_PRIVATE_KEY;

export function getSponsorAccount() {
  if (!SPONSOR_KEY) throw new Error("SPONSOR_PRIVATE_KEY not configured");
  const key = SPONSOR_KEY.startsWith("0x") ? SPONSOR_KEY : `0x${SPONSOR_KEY}`;
  return privateKeyToAccount(key as `0x${string}`);
}

export function getPublicClient() {
  return createPublicClient({
    chain: monadTestnet,
    transport: http(),
  });
}

export function getSponsorWallet() {
  const account = getSponsorAccount();
  return createWalletClient({
    account,
    chain: monadTestnet,
    transport: http(),
  });
}

export async function readNonce(
  action: "identity" | "claimDrop",
  user: Address
): Promise<bigint> {
  const client = getPublicClient();
  if (action === "identity") {
    return client.readContract({
      address: CONTRACTS.identity as Address,
      abi: IDENTITY_ABI,
      functionName: "nonces",
      args: [user],
    });
  }
  return client.readContract({
    address: CONTRACTS.event as Address,
    abi: EVENT_ABI,
    functionName: "nonces",
    args: [user],
  });
}

export async function verifyAndRelay(payload: RelayPayload): Promise<Hash> {
  const wallet = getSponsorWallet();
  const publicClient = getPublicClient();

  if (payload.action === "identity") {
    const { message, signature } = payload;
    const valid = await verifyTypedData({
      address: message.user,
      domain: { ...MEETMINT_DOMAIN, verifyingContract: CONTRACTS.identity as Address },
      types: { CreateIdentity: EIP712_TYPES.CreateIdentity },
      primaryType: "CreateIdentity",
      message: {
        user: message.user,
        name: message.name,
        role: message.role,
        nonce: message.nonce,
        deadline: message.deadline,
      },
      signature,
    });
    if (!valid) throw new Error("Invalid identity signature");

    return wallet.writeContract({
      address: CONTRACTS.identity as Address,
      abi: IDENTITY_ABI,
      functionName: "createIdentityWithSig",
      args: [message.user, message.name, message.role, message.deadline, signature],
    });
  }

  if (payload.action === "encounter") {
    const { message, signature } = payload;
    const valid = await verifyTypedData({
      address: message.userA,
      domain: RELAY_DOMAIN,
      types: { CreateEncounter: EIP712_TYPES.CreateEncounter },
      primaryType: "CreateEncounter",
      message: {
        userA: message.userA,
        userB: message.userB,
        eventId: message.eventId,
        deadline: message.deadline,
      },
      signature,
    });
    if (!valid) throw new Error("Invalid encounter signature");
    if (BigInt(Math.floor(Date.now() / 1000)) > message.deadline) {
      throw new Error("Encounter signature expired");
    }

    return wallet.writeContract({
      address: CONTRACTS.encounter as Address,
      abi: ENCOUNTER_ABI,
      functionName: "createEncounter",
      args: [message.userA, message.userB, message.eventId],
    });
  }

  if (payload.action === "claimDrop") {
    const { message, signature } = payload;
    const valid = await verifyTypedData({
      address: message.user,
      domain: { ...MEETMINT_DOMAIN, verifyingContract: CONTRACTS.event as Address },
      types: { ClaimDrop: EIP712_TYPES.ClaimDrop },
      primaryType: "ClaimDrop",
      message: {
        user: message.user,
        eventId: message.eventId,
        nonce: message.nonce,
        deadline: message.deadline,
      },
      signature,
    });
    if (!valid) throw new Error("Invalid claim signature");

    return wallet.writeContract({
      address: CONTRACTS.event as Address,
      abi: EVENT_ABI,
      functionName: "claimDropWithSig",
      args: [message.user, message.eventId, message.deadline, signature],
    });
  }

  throw new Error("Unknown relay action");
}

export async function waitForTx(hash: Hash) {
  await getPublicClient().waitForTransactionReceipt({ hash });
  return hash;
}
