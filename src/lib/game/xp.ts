import { XP_REWARDS } from "../constants";

export function getLevelFromXP(xp: number): number {
  if (xp < 100) return 1;
  if (xp < 250) return 2;
  if (xp < 500) return 3;
  if (xp < 1000) return 4;
  return Math.floor(xp / 500) + 1;
}

export function getXPForNextLevel(level: number): number {
  if (level === 1) return 100;
  if (level === 2) return 250;
  if (level === 3) return 500;
  if (level === 4) return 1000;
  return level * 500;
}

export function getXPProgress(xp: number, level: number) {
  const thresholds = [0, 100, 250, 500, 1000];
  const currentThreshold = level <= 4 ? thresholds[level - 1] : (level - 1) * 500;
  const nextThreshold = getXPForNextLevel(level);
  const progress = ((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
  return Math.min(100, Math.max(0, progress));
}

export function calculateEncounterXP(isFirstEncounter: boolean): number {
  return isFirstEncounter ? XP_REWARDS.firstEncounter : XP_REWARDS.normalEncounter;
}
