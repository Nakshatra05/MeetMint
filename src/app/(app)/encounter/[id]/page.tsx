"use client";

import { useParams, useRouter } from "next/navigation";
import { EncounterCard } from "@/components/cards/EncounterCard";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { useMeetMint } from "@/providers/MeetMintProvider";
import { getUserById } from "@/lib/mock/users";
import { formatDate } from "@/lib/utils";
import { BLITZ_EVENT } from "@/lib/constants";

export default function EncounterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { state } = useMeetMint();

  const encounter = state.encounters.find((e) => e.id === params.id);
  const metUser = encounter ? getUserById(encounter.metUserId) : null;

  if (!encounter || !metUser) {
    return (
      <div className="py-12 text-center">
        <p className="font-black uppercase">Encounter not found</p>
        <BrutalButton className="mt-4" onClick={() => router.push("/explore")}>
          Back to Explore
        </BrutalButton>
      </div>
    );
  }

  const tags = [
    encounter.isFirstEncounter ? "⚡ FIRST ENCOUNTER" : "🤝 ENCOUNTER",
    `🛠 ${metUser.role}`,
    `🌐 ${metUser.interests[0]}`,
  ];

  return (
    <div className="py-6 space-y-6">
      <EncounterCard
        encounterNumber={encounter.encounterNumber}
        metName={metUser.name.split(" ")[0].toUpperCase()}
        metRole={metUser.role}
        eventName={BLITZ_EVENT.name.toUpperCase()}
        date={formatDate(encounter.timestamp)}
        tags={tags}
        verified={encounter.verified}
        txHash={encounter.txHash}
      />

      <div className="flex gap-3 max-w-sm mx-auto">
        <BrutalButton variant="ghost" className="flex-1" onClick={() => router.push("/collection")}>
          View Collection
        </BrutalButton>
        <BrutalButton className="flex-1" onClick={() => router.push("/explore")}>
          Keep Exploring
        </BrutalButton>
      </div>
    </div>
  );
}
