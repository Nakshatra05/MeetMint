import { DEMO_MODE } from "../constants";
import { hasContractsConfigured, submitIdentity } from "./write";

export async function createIdentity(
  name: string,
  role: string
): Promise<{ tokenId: number; txHash?: string }> {
  if (DEMO_MODE || !hasContractsConfigured()) {
    await new Promise((r) => setTimeout(r, 800));
    return { tokenId: Math.floor(Math.random() * 10000) };
  }

  const txHash = await submitIdentity(name, role);
  return { tokenId: 0, txHash };
}
