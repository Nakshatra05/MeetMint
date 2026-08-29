/** Generate a consistent display-picture URL from a seed (name, id, or wallet). */
export function getAvatarUrl(seed: string): string {
  const normalized = seed.trim().toLowerCase().replace(/\s+/g, "-");
  return `https://api.dicebear.com/9.x/notionists/png?seed=${encodeURIComponent(normalized)}&size=256`;
}

/** Accent ring color derived from seed for neo-brutalist borders */
export function getAvatarColor(seed: string): string {
  const colors = ["#836EF9", "#FF6B9D", "#4ADE80", "#FBBF24", "#FB923C", "#60A5FA", "#FFE566"];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}
