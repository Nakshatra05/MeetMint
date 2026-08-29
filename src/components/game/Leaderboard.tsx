"use client";

import { motion } from "framer-motion";
import type { LeaderboardEntry } from "@/lib/types";
import { Avatar } from "../ui/Avatar";

const medals = ["🥇", "🥈", "🥉"];

export function Leaderboard({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <div className="space-y-3">
      {entries.slice(0, 8).map((entry, i) => (
        <motion.div
          key={entry.userId}
          layout
          className={`brutal-card rounded-xl p-4 flex items-center gap-4 ${
            entry.isCurrentUser ? "bg-yellow/30 ring-2 ring-black" : ""
          } ${i < 3 ? "p-5" : ""}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <span className={`font-black ${i < 3 ? "text-2xl" : "text-lg"} w-8`}>
            {i < 3 ? medals[i] : entry.rank}
          </span>
          <Avatar
            src={entry.avatar}
            seed={entry.userId}
            name={entry.name}
            color={entry.avatarColor}
            size={i < 3 ? "md" : "sm"}
          />
          <div className="flex-1">
            <p className={`font-black uppercase ${i < 3 ? "text-xl" : "text-base"}`}>
              {entry.name}
              {entry.isCurrentUser && " (YOU)"}
            </p>
          </div>
          <p className={`font-black ${i < 3 ? "text-xl" : "text-base"}`}>
            {entry.xp.toLocaleString()} XP
          </p>
        </motion.div>
      ))}
      <p className="text-center text-xs font-black uppercase text-black/50 mt-2">
        ● Updated Live
      </p>
    </div>
  );
}
