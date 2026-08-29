"use client";

import { useState } from "react";
import { ProfileCard } from "@/components/cards/ProfileCard";
import { XPBar, LevelBadge } from "@/components/game/XPBar";
import { Leaderboard } from "@/components/game/Leaderboard";
import { QRProfileModal } from "@/components/social/QRProfile";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { useMeetMint } from "@/providers/MeetMintProvider";
import { truncateAddress } from "@/lib/wallet";
import { MOCK_EVENTS } from "@/lib/mock/events";

export default function ProfilePage() {
  const { state } = useMeetMint();
  const [showQR, setShowQR] = useState(false);
  const user = state.currentUser!;

  return (
    <div className="py-6 space-y-8">
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-black/50">MeetMint Passport</p>
        <h1 className="text-3xl font-black uppercase mt-1">{user.name}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <LevelBadge level={user.level} />
          {user.walletAddress && (
            <span className="text-xs font-black px-2 py-1 bg-cream brutal-border rounded-md">
              {truncateAddress(user.walletAddress)}
            </span>
          )}
        </div>
      </div>

      <XPBar xp={user.xp} level={user.level} />

      <ProfileCard user={user} showQR />

      <div className="brutal-card rounded-2xl p-5 space-y-3">
        <div className="grid grid-cols-2 gap-4 font-black">
          <div>🤝 {user.encounterCount} Encounters</div>
          <div>🎟️ {user.eventCount} Events</div>
          <div>🏆 {user.badgeCount} Badges</div>
          <div>🌎 {user.cityCount} Cities</div>
        </div>
      </div>

      <section>
        <h2 className="text-xl font-black uppercase mb-4">Events</h2>
        <div className="space-y-2">
          {MOCK_EVENTS.slice(0, 3).map((event, i) => (
            <div key={event.id} className="flex items-center gap-3 font-bold">
              <span className="text-green">{i === 0 ? "✓" : "○"}</span>
              <span className="uppercase">{event.shortName}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="flex gap-3">
        <BrutalButton className="flex-1" onClick={() => setShowQR(true)}>
          Show QR
        </BrutalButton>
        <BrutalButton variant="ghost" className="flex-1">
          Share
        </BrutalButton>
        <SignOutButton />
      </div>

      <section>
        <h2 className="text-xl font-black uppercase mb-4">Leaderboard</h2>
        <Leaderboard entries={state.leaderboard} />
      </section>

      <QRProfileModal open={showQR} onClose={() => setShowQR(false)} user={user} />
    </div>
  );
}
