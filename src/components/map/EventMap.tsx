"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { NearbyUser } from "@/lib/types";
import { LabelBadge } from "../ui/BrutalBadge";
import { Avatar } from "../ui/Avatar";

export function EventMap({
  nearbyUsers,
  onUserClick,
}: {
  nearbyUsers: NearbyUser[];
  onUserClick: (user: NearbyUser) => void;
}) {
  return (
    <div className="relative w-full aspect-square brutal-card rounded-2xl overflow-hidden bg-[#E8F4E8]">
      <div className="absolute inset-0">
        <div className="absolute top-[20%] left-[10%] w-[30%] h-[25%] bg-yellow/40 brutal-border rounded-xl" />
        <div className="absolute top-[50%] right-[15%] w-[25%] h-[20%] bg-purple/30 brutal-border rounded-xl" />
        <div className="absolute bottom-[15%] left-[25%] w-[35%] h-[22%] bg-pink/30 brutal-border rounded-xl" />
        <div className="absolute top-[35%] left-[45%] w-[15%] h-[15%] bg-blue/30 brutal-border rounded-full" />
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] border-2 border-dashed border-black/20 rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35%] h-[35%] border-2 border-dashed border-purple/40 rounded-full" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-12 h-12 bg-yellow brutal-border brutal-shadow-sm rounded-full flex items-center justify-center font-black text-sm animate-pulse-marker">
          YOU
        </div>
        <p className="text-xs font-black text-center mt-1">📍</p>
      </div>

      {nearbyUsers.map((user, i) => (
        <motion.button
          key={user.id}
          className="absolute z-10 animate-pulse-marker"
          style={{ left: `${user.mapX}%`, top: `${user.mapY}%`, transform: "translate(-50%, -50%)" }}
          onClick={() => onUserClick(user)}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ scale: 1.2 }}
        >
          <div className={cn(user.label === "RARE" && "ring-2 ring-purple ring-offset-1 rounded-2xl")}>
            <Avatar
              src={user.avatar}
              seed={user.id}
              name={user.name}
              color={user.avatarColor}
              size="sm"
            />
          </div>
        </motion.button>
      ))}
    </div>
  );
}

export function NearbyUsersList({
  users,
  onUserClick,
}: {
  users: NearbyUser[];
  onUserClick: (user: NearbyUser) => void;
}) {
  return (
    <div className="space-y-3">
      {users.map((user, i) => (
        <motion.button
          key={user.id}
          className="w-full brutal-card rounded-xl p-4 flex items-center gap-4 text-left"
          onClick={() => onUserClick(user)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          whileHover={{ x: 4 }}
        >
          <Avatar
            src={user.avatar}
            seed={user.id}
            name={user.name}
            color={user.avatarColor}
            size="md"
          />
          <div className="flex-1">
            <p className="font-black uppercase">{user.name.split(" ")[0]}</p>
            <p className="text-sm font-bold text-black/60">
              {user.role} · {user.interests[0]}
            </p>
          </div>
          {user.label && <LabelBadge label={user.label} />}
        </motion.button>
      ))}
    </div>
  );
}
