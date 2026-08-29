"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { getXPProgress, getXPForNextLevel } from "@/lib/game/xp";

export function XPBar({ xp, level }: { xp: number; level: number }) {
  const progress = getXPProgress(xp, level);
  const nextLevel = getXPForNextLevel(level);

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs font-black uppercase mb-1">
        <span>Level {level}</span>
        <span>{xp.toLocaleString()} / {nextLevel.toLocaleString()} XP</span>
      </div>
      <div className="h-4 brutal-border rounded-lg overflow-hidden bg-white">
        <motion.div
          className="h-full bg-green"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export function AnimatedXP({ value, className }: { value: number; className?: string }) {
  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const display = useTransform(spring, (v) => `+${Math.round(v)} XP`);

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return (
    <motion.span
      className={className}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <motion.span>{display}</motion.span>
    </motion.span>
  );
}

export function LevelBadge({ level }: { level: number }) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow brutal-border brutal-shadow-sm rounded-xl font-black text-sm uppercase">
      ⭐ Level {level}
    </span>
  );
}
