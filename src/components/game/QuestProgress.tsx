"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Quest } from "@/lib/types";
import { BrutalButton } from "../ui/BrutalButton";
import { MOCK_USERS } from "@/lib/mock/users";

export function QuestProgress({ quest, onAction }: { quest: Quest; onAction?: () => void }) {
  const progressPct = (quest.progress / quest.target) * 100;
  const isComplete = quest.status === "completed";

  return (
    <div className={cn("brutal-card rounded-2xl p-5", isComplete && "bg-green/20")}>
      <div className="flex items-start gap-3">
        <span className="text-3xl">{quest.emoji}</span>
        <div className="flex-1">
          <h3 className="font-black uppercase text-lg">{quest.title}</h3>
          <p className="text-sm font-bold text-black/70 mt-1">{quest.description}</p>
        </div>
      </div>

      {quest.id === "blitz-quest" && (
        <div className="mt-4 space-y-2">
          {["arjun", "riya", "dev"].map((id) => {
            const user = MOCK_USERS.find((u) => u.id === id);
            const met = quest.metUserIds.includes(id);
            return (
              <div key={id} className="flex items-center gap-2 font-bold text-sm">
                <span className={cn("w-5 h-5 brutal-border rounded flex items-center justify-center text-xs", met ? "bg-green" : "bg-white")}>
                  {met ? "✓" : "□"}
                </span>
                <span className="uppercase">{user?.name.split(" ")[0]}</span>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4">
        <div className="flex justify-between text-sm font-black mb-1">
          <span>{quest.progress} / {quest.target}</span>
          {isComplete && <span className="text-green">COMPLETE!</span>}
        </div>
        <div className="h-3 brutal-border rounded-lg overflow-hidden bg-white">
          <motion.div
            className="h-full bg-purple"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t-3 border-black">
        <p className="text-xs font-black uppercase text-black/50 mb-1">Reward</p>
        <p className="font-black">+{quest.rewardXP} XP</p>
        {quest.rewardBadge && <p className="font-bold text-sm">🏆 {quest.rewardBadge}</p>}
      </div>

      {onAction && !isComplete && (
        <BrutalButton className="w-full mt-4" onClick={onAction}>
          Keep Exploring
        </BrutalButton>
      )}

      {isComplete && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mt-4 text-center font-black uppercase text-green"
        >
          ✓ Quest Complete!
        </motion.div>
      )}
    </div>
  );
}
