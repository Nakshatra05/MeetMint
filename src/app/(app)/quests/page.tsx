"use client";

import { QuestProgress } from "@/components/game/QuestProgress";
import { BrutalCard } from "@/components/ui/BrutalCard";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { useMeetMint } from "@/providers/MeetMintProvider";
import { useRouter } from "next/navigation";

export default function QuestsPage() {
  const { state, claimDrop } = useMeetMint();
  const router = useRouter();
  const drop = state.eventDrop;

  return (
    <div className="py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-black uppercase">Today&apos;s Quests</h1>
        <p className="font-bold text-black/60 mt-1">Complete quests to earn XP and badges</p>
      </div>

      <div className="space-y-4">
        {state.quests.map((quest) => (
          <QuestProgress
            key={quest.id}
            quest={quest}
            onAction={quest.id === "blitz-quest" ? () => router.push("/explore") : undefined}
          />
        ))}
      </div>

      {/* Event Drop */}
      <section>
        <h2 className="text-xl font-black uppercase mb-4">⚡ Limited Drop</h2>
        <BrutalCard className="p-6 bg-purple/10">
          <h3 className="text-2xl font-black uppercase">{drop.name}</h3>
          <p className="font-bold mt-2">
            {drop.claimed} / {drop.total} Claimed
          </p>

          <div className="mt-4 space-y-2">
            <p className="text-xs font-black uppercase text-black/50">To Claim:</p>
            {drop.requirements.map((req) => (
              <div key={req.label} className="flex items-center gap-2 font-bold text-sm">
                <span className={`w-5 h-5 brutal-border rounded flex items-center justify-center text-xs ${req.met ? "bg-green" : "bg-white"}`}>
                  {req.met ? "✓" : "□"}
                </span>
                {req.label}
              </div>
            ))}
          </div>

          {drop.claimedByUser ? (
            <div className="mt-6 text-center font-black uppercase text-green">
              ✓ Drop Unlocked! #{drop.claimed} / {drop.total}
            </div>
          ) : (
            <BrutalButton
              className="w-full mt-6"
              variant="secondary"
              disabled={!drop.requirements.every((r) => r.met)}
              onClick={claimDrop}
            >
              Claim Drop
            </BrutalButton>
          )}
        </BrutalCard>
      </section>
    </div>
  );
}
