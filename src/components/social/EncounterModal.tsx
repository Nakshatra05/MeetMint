"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { BrutalButton } from "../ui/BrutalButton";
import { AnimatedXP } from "../game/XPBar";
import { getUserById } from "@/lib/mock/users";
import type { Encounter } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { BLITZ_EVENT } from "@/lib/constants";

export function EncounterSuccess({
  encounter,
  onClose,
  onViewCard,
}: {
  encounter: Encounter;
  onClose: () => void;
  onViewCard: () => void;
}) {
  const metUser = getUserById(encounter.metUserId);

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FFE566", "#836EF9", "#FF6B9D", "#4ADE80"],
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
    >
      <motion.div
        initial={{ scale: 0.5, rotate: -5 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="brutal-card rounded-2xl p-8 max-w-md w-full text-center bg-yellow"
      >
        <motion.p
          className="text-4xl mb-2"
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ repeat: 2, duration: 0.5 }}
        >
          ⚡
        </motion.p>
        <h1 className="text-3xl font-black uppercase">New Encounter!</h1>
        <p className="text-xl font-black uppercase mt-4">
          You met {metUser?.name.split(" ")[0]}
        </p>
        <AnimatedXP
          value={encounter.xpEarned}
          className="text-2xl font-black text-green block mt-2"
        />
        <p className="font-black uppercase mt-4">New Card Added</p>
        <div className="my-6 border-t-3 border-b-3 border-black py-3">
          <p className="font-black uppercase">{BLITZ_EVENT.shortName}</p>
          <p className="font-bold text-sm">{formatDate(BLITZ_EVENT.date)}</p>
        </div>
        <div className="flex flex-col gap-3">
          <BrutalButton onClick={onViewCard} variant="secondary">
            View Card
          </BrutalButton>
          <BrutalButton onClick={onClose} variant="ghost">
            Keep Exploring
          </BrutalButton>
        </div>
      </motion.div>
    </motion.div>
  );
}
