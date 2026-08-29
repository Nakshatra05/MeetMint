import Image from "next/image";
import { cn } from "@/lib/utils";
import { getAvatarUrl } from "@/lib/avatars";

const sizes = {
  xs: "w-8 h-8",
  sm: "w-10 h-10",
  md: "w-12 h-12",
  lg: "w-20 h-20",
  xl: "w-24 h-24",
};

type AvatarProps = {
  src?: string;
  seed: string;
  name?: string;
  color?: string;
  size?: keyof typeof sizes;
  className?: string;
  ring?: boolean;
};

export function Avatar({
  src,
  seed,
  name,
  color = "#FFE566",
  size = "md",
  className,
  ring = true,
}: AvatarProps) {
  const url = src || getAvatarUrl(seed);

  return (
    <div
      className={cn(
        "relative rounded-2xl overflow-hidden shrink-0 bg-white",
        ring && "brutal-border",
        sizes[size],
        className
      )}
      style={ring ? { boxShadow: `0 0 0 3px ${color}` } : undefined}
    >
      <Image
        src={url}
        alt={name ?? seed}
        fill
        className="object-cover"
        unoptimized
      />
    </div>
  );
}
