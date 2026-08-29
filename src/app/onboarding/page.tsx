"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { ProfileCard } from "@/components/cards/ProfileCard";
import { ROLES, INTERESTS } from "@/lib/constants";
import { useMeetMint } from "@/providers/MeetMintProvider";
import type { Role, Interest } from "@/lib/types";
import { createIdentity } from "@/lib/blockchain/identity";
import { getAvatarUrl, getAvatarColor } from "@/lib/avatars";
import { cn } from "@/lib/utils";

export default function OnboardingPage() {
  const router = useRouter();
  const { createProfile, state } = useMeetMint();
  const [step, setStep] = useState<"form" | "creating" | "done">("form");
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role | null>(null);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [previewUser, setPreviewUser] = useState<ReturnType<typeof buildPreview> | null>(null);

  function buildPreview() {
    if (!name || !role) return null;
    const seed = name.trim().toLowerCase();
    return {
      id: "preview",
      name,
      role,
      interests,
      avatar: getAvatarUrl(seed),
      avatarColor: getAvatarColor(seed),
      xp: 0,
      level: 1,
      encounterCount: 0,
      badgeCount: 0,
      eventCount: 1,
      cityCount: 1,
      rarity: "COMMON" as const,
      qrPayload: "meetmint:preview",
    };
  }

  const toggleInterest = (i: Interest) => {
    setInterests((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  };

  const handleCreate = async () => {
    if (!name || !role) return;
    setStep("creating");
    setPreviewUser(buildPreview());
    try {
      await createIdentity(name, role);
    } catch (err) {
      console.error("Identity mint failed (continuing locally):", err);
    }
    await createProfile(name, role, interests);
    setStep("done");
    await new Promise((r) => setTimeout(r, 2000));
    router.push("/explore");
  };

  if (!state.isAuthenticated) {
    router.push("/");
    return null;
  }

  if (step === "creating" || step === "done") {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.5, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          {previewUser && <ProfileCard user={previewUser} />}
          <motion.p
            className="text-center font-black uppercase text-xl mt-6"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            {step === "creating" ? "Creating your card..." : "Welcome to MeetMint!"}
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream p-6 max-w-lg mx-auto">
      <h1 className="text-3xl font-black uppercase mt-8">Build Your Card</h1>
      <p className="font-bold text-black/60 mt-2">What&apos;s your name?</p>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nakshatra"
        className="w-full mt-4 px-4 py-4 text-xl font-black uppercase brutal-border brutal-shadow-sm rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple"
      />

      <p className="font-black uppercase mt-8 mb-3">Choose your vibe:</p>
      <div className="flex flex-wrap gap-2">
        {ROLES.map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={cn(
              "px-4 py-2 font-black uppercase text-sm brutal-border brutal-shadow-sm rounded-xl brutal-press",
              role === r ? "bg-purple text-white" : "bg-white"
            )}
          >
            {r}
          </button>
        ))}
      </div>

      <p className="font-black uppercase mt-8 mb-3">Your interests:</p>
      <div className="flex flex-wrap gap-2">
        {INTERESTS.map((i) => (
          <button
            key={i}
            onClick={() => toggleInterest(i)}
            className={cn(
              "px-4 py-2 font-black uppercase text-sm brutal-border brutal-shadow-sm rounded-xl brutal-press",
              interests.includes(i) ? "bg-yellow" : "bg-white"
            )}
          >
            {i}
          </button>
        ))}
      </div>

      <BrutalButton
        className="w-full mt-10"
        size="lg"
        disabled={!name || !role}
        onClick={handleCreate}
      >
        Create My Card →
      </BrutalButton>
    </div>
  );
}
