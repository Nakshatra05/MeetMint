"use client";

import { motion } from "framer-motion";
import { Logo } from "@/components/branding/Logo";
import { ProfileCard } from "@/components/cards/ProfileCard";
import { EnterMeetMintButton } from "@/components/auth/EnterMeetMintButton";
import { MOCK_USERS } from "@/lib/mock/users";
import { BRAND, DEMO_MODE } from "@/lib/constants";

const floatingCards = [
  { user: MOCK_USERS[6], x: "5%", y: "15%", rotate: -8, delay: 0 },
  { user: MOCK_USERS[0], x: "70%", y: "10%", rotate: 6, delay: 0.2 },
  { user: MOCK_USERS[1], x: "75%", y: "55%", rotate: -4, delay: 0.4 },
  { user: MOCK_USERS[2], x: "8%", y: "60%", rotate: 5, delay: 0.6 },
];

const stickers = [
  { text: "+25 XP", x: "15%", y: "35%", color: "bg-green" },
  { text: "NEW ENCOUNTER", x: "60%", y: "30%", color: "bg-pink" },
  { text: "RARE", x: "80%", y: "40%", color: "bg-purple text-white" },
  { text: "MONAD BLITZ", x: "25%", y: "75%", color: "bg-yellow" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream overflow-hidden relative">
      {floatingCards.map(({ user, x, y, rotate, delay }, i) => (
        <motion.div
          key={i}
          className="absolute w-36 hidden sm:block"
          style={{ left: x, top: y, "--rotate": `${rotate}deg` } as React.CSSProperties}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ delay, duration: 0.6 }}
        >
          <div className="animate-float" style={{ animationDelay: `${delay}s` }}>
            <ProfileCard user={user} compact />
          </div>
        </motion.div>
      ))}

      {stickers.map(({ text, x, y, color }, i) => (
        <motion.span
          key={i}
          className={`absolute hidden md:inline-block px-3 py-1 text-xs font-black uppercase brutal-border brutal-shadow-sm rounded-lg sticker ${color}`}
          style={{ left: x, top: y }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8 + i * 0.1, type: "spring" }}
        >
          {text}
        </motion.span>
      ))}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12 text-center">
        <Logo size="lg" />

        <motion.div
          className="mt-12 max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-5xl sm:text-7xl font-black uppercase leading-[0.95] tracking-tight">
            Meet
            <br />
            People.
            <br />
            <span className="text-purple">Mint</span>
            <br />
            Memories.
          </h1>
          <p className="mt-6 text-lg font-bold text-black/70">
            The multiplayer social game
            <br />
            for the real world.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
          className="mt-10"
        >
          <EnterMeetMintButton />
        </motion.div>

        {!DEMO_MODE && (
          <p className="mt-4 text-sm font-bold text-black/50">
            Sign in with your MetaMask wallet
          </p>
        )}

        <p className="mt-8 text-xs font-black uppercase tracking-widest text-black/40">
          ⚡ {BRAND.poweredBy}
        </p>
      </div>
    </div>
  );
}
