import { NextResponse } from "next/server";
import type { RelayPayload } from "@/lib/blockchain/eip712";
import { verifyAndRelay, waitForTx } from "@/lib/blockchain/relayer";

export async function POST(req: Request) {
  try {
    if (!process.env.SPONSOR_PRIVATE_KEY) {
      return NextResponse.json({ error: "Sponsor not configured" }, { status: 503 });
    }

    const payload = (await req.json()) as RelayPayload;

    if (!payload?.action || !payload?.signature || !payload?.message) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const txHash = await verifyAndRelay(payload);
    await waitForTx(txHash);

    return NextResponse.json({ txHash, sponsored: true });
  } catch (err) {
    console.error("Relay error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Relay failed" },
      { status: 500 }
    );
  }
}
