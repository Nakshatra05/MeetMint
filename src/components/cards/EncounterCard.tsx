"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { CollectionItem } from "@/lib/types";
import { RarityBadge } from "../ui/BrutalBadge";
import { Avatar } from "../ui/Avatar";

export function CollectionCard({ item }: { item: CollectionItem }) {
  const rotation = item.rarity === "LEGENDARY" ? 2 : item.rarity === "RARE" ? -1 : 0;

  return (
    <motion.div
      className={cn(
        "brutal-card rounded-xl p-4 aspect-[3/4] flex flex-col items-center justify-between cursor-pointer",
        item.rarity === "LEGENDARY" && "bg-yellow/30",
        item.rarity === "EPIC" && "bg-pink/20",
        item.rarity === "RARE" && "bg-purple/20"
      )}
      style={{ rotate: rotation }}
      whileHover={{ scale: 1.05, rotate: rotation + 3 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {item.emoji && <span className="text-2xl">{item.emoji}</span>}
      {item.type === "person" && item.avatarUrl ? (
        <Avatar src={item.avatarUrl} seed={item.title} name={item.title} color={item.color} size="lg" />
      ) : (
        <div
          className="w-16 h-16 rounded-xl brutal-border flex items-center justify-center font-black text-white text-xl"
          style={{ backgroundColor: item.color }}
        >
          {item.emoji ?? item.title.slice(0, 2)}
        </div>
      )}
      <div className="text-center">
        <p className="font-black uppercase">{item.title}</p>
        <p className="text-xs font-bold text-black/60 uppercase">{item.subtitle}</p>
        {item.encounterNumber && (
          <p className="text-xs font-black mt-1">#{item.encounterNumber}</p>
        )}
      </div>
      {item.rarity !== "COMMON" && <RarityBadge rarity={item.rarity} />}
    </motion.div>
  );
}

export function EncounterCard({
  encounterNumber,
  metName,
  metRole,
  eventName,
  date,
  tags,
  verified,
  txHash,
}: {
  encounterNumber: number;
  metName: string;
  metRole: string;
  eventName: string;
  date: string;
  tags: string[];
  verified: boolean;
  txHash?: string;
}) {
  return (
    <div className="brutal-card rounded-2xl p-6 max-w-sm mx-auto">
      <p className="text-xs font-black uppercase text-black/50 mb-4">Encounter #{encounterNumber}</p>
      <h2 className="text-3xl font-black uppercase">{metName}</h2>
      <p className="font-bold uppercase text-black/70">{metRole}</p>

      <div className="my-6 pt-4 border-t-3 border-black">
        <p className="text-xs font-black uppercase text-black/50">Met At</p>
        <p className="font-black uppercase">{eventName}</p>
        <p className="font-bold text-sm">{date}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag) => (
          <span key={tag} className="text-xs font-black px-2 py-1 bg-cream brutal-border rounded-md">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2 font-black text-sm">
        {verified ? (
          <>
            <span className="text-green">✓ VERIFIED ON MONAD</span>
          </>
        ) : (
          <span className="text-orange animate-pulse">SYNCING ENCOUNTER...</span>
        )}
      </div>

      {txHash && verified && (
        <a
          href={`https://testnet.monadvision.com/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-bold underline mt-2 inline-block"
        >
          View transaction →
        </a>
      )}
    </div>
  );
}
