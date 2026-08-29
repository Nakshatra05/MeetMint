"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { UserProfile } from "@/lib/types";
import { RarityBadge } from "../ui/BrutalBadge";
import { Avatar } from "../ui/Avatar";

type ProfileCardProps = {
  user: UserProfile;
  compact?: boolean;
  showQR?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export function ProfileCard({ user, compact, showQR, className, style }: ProfileCardProps) {
  return (
    <motion.div
      className={cn(
        "brutal-card rounded-2xl overflow-hidden",
        compact ? "p-3" : "p-5",
        className
      )}
      style={{ backgroundColor: "white", ...style }}
      whileHover={{ rotate: compact ? 0 : -1 }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-black uppercase tracking-widest text-black/50">MeetMint</span>
        {!compact && user.rarity !== "COMMON" && <RarityBadge rarity={user.rarity} />}
      </div>

      <div className="flex flex-col items-center text-center">
        <Avatar
          src={user.avatar}
          seed={user.id}
          name={user.name}
          color={user.avatarColor}
          size={compact ? "lg" : "xl"}
        />

        <h3 className={cn("font-black uppercase mt-3", compact ? "text-base" : "text-xl")}>
          {user.name.split(" ")[0]}
        </h3>
        <p className="text-sm font-bold text-black/70 uppercase">{user.role}</p>

        {!compact && (
          <>
            <div className="flex flex-wrap gap-1 justify-center mt-2">
              {user.interests.slice(0, 3).map((i) => (
                <span key={i} className="text-xs font-bold px-2 py-0.5 bg-cream brutal-border rounded-md">
                  {i}
                </span>
              ))}
            </div>

            <div className="w-full mt-4 pt-3 border-t-3 border-black grid grid-cols-2 gap-2 text-left">
              <div>
                <p className="text-xs font-bold text-black/50">LEVEL</p>
                <p className="font-black text-lg">{user.level}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-black/50">XP</p>
                <p className="font-black text-lg">{user.xp.toLocaleString()}</p>
              </div>
              <div className="col-span-2 flex gap-4 text-sm font-bold">
                <span>🤝 {user.encounterCount}</span>
                <span>🏆 {user.badgeCount}</span>
              </div>
            </div>

            {showQR && (
              <div className="mt-4 w-24 h-24 bg-white brutal-border brutal-shadow-sm rounded-xl flex items-center justify-center">
                <div className="grid grid-cols-3 gap-0.5">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className={cn("w-2 h-2", i % 2 === 0 ? "bg-black" : "bg-transparent")} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
