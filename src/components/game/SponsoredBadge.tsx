"use client";

import { BrutalBadge } from "@/components/ui/BrutalBadge";
import { SPONSORED_TX } from "@/lib/blockchain/contracts";
import { DEMO_MODE } from "@/lib/constants";

export function SponsoredBadge() {
  if (DEMO_MODE || !SPONSORED_TX) return null;

  return (
    <BrutalBadge className="bg-green text-black text-[10px]">
      ⚡ GAS SPONSORED
    </BrutalBadge>
  );
}
