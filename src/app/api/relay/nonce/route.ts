import { NextResponse } from "next/server";
import type { Address } from "viem";
import { readNonce } from "@/lib/blockchain/relayer";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");
  const user = searchParams.get("user") as Address | null;

  if (!user || (action !== "identity" && action !== "claimDrop")) {
    return NextResponse.json({ error: "Invalid params" }, { status: 400 });
  }

  try {
    const nonce = await readNonce(action, user);
    return NextResponse.json({ nonce: nonce.toString() });
  } catch (err) {
    console.error("Nonce read error:", err);
    return NextResponse.json({ nonce: "0" });
  }
}
