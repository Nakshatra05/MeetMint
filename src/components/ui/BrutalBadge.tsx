import { cn } from "@/lib/utils";
import type { Rarity } from "@/lib/types";

const rarityStyles: Record<Rarity, string> = {
  COMMON: "bg-white text-black",
  RARE: "bg-purple text-white",
  EPIC: "bg-pink text-white",
  LEGENDARY: "bg-yellow text-black",
};

export function BrutalBadge({
  children,
  rarity,
  className,
}: {
  children: React.ReactNode;
  rarity?: Rarity;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block px-2 py-0.5 text-xs font-black uppercase brutal-border brutal-shadow-sm rounded-md",
        rarity ? rarityStyles[rarity] : "bg-white text-black",
        className
      )}
    >
      {children}
    </span>
  );
}

export function RarityBadge({ rarity }: { rarity: Rarity }) {
  const labels: Record<Rarity, string> = {
    COMMON: "COMMON",
    RARE: "🟣 RARE",
    EPIC: "✨ EPIC",
    LEGENDARY: "⭐ LEGENDARY",
  };
  return <BrutalBadge rarity={rarity}>{labels[rarity]}</BrutalBadge>;
}

export function LabelBadge({ label }: { label: "HOT" | "RARE" | "NEW" }) {
  const styles = {
    HOT: "bg-orange text-black",
    RARE: "bg-purple text-white",
    NEW: "bg-green text-black",
  };
  const icons = { HOT: "🔥", RARE: "🟣", NEW: "⚡" };
  return (
    <span className={cn("inline-block px-2 py-0.5 text-xs font-black uppercase brutal-border brutal-shadow-sm rounded-md", styles[label])}>
      {icons[label]} {label}
    </span>
  );
}
