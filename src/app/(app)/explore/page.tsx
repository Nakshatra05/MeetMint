"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { QrCode, ScanLine } from "lucide-react";
import { EventMap, NearbyUsersList } from "@/components/map/EventMap";
import { ProfileCard } from "@/components/cards/ProfileCard";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { BrutalModal } from "@/components/ui/BrutalModal";
import { QRScanner } from "@/components/social/QRScanner";
import { QRProfileModal, EncounterConfirmModal } from "@/components/social/QRProfile";
import { EncounterSuccess } from "@/components/social/EncounterModal";
import { Leaderboard } from "@/components/game/Leaderboard";
import { useMeetMint } from "@/providers/MeetMintProvider";
import { getUserByQrPayload } from "@/lib/mock/users";
import type { NearbyUser, UserProfile } from "@/lib/types";
import { BLITZ_EVENT } from "@/lib/constants";
import { RarityBadge } from "@/components/ui/BrutalBadge";

export default function ExplorePage() {
  const router = useRouter();
  const {
    state,
    nearbyUsers,
    createEncounter,
    showEncounterSuccess,
    setShowEncounterSuccess,
  } = useMeetMint();

  const [selectedUser, setSelectedUser] = useState<NearbyUser | UserProfile | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [confirmUser, setConfirmUser] = useState<UserProfile | null>(null);
  const [connecting, setConnecting] = useState(false);

  const handleScan = (payload: string) => {
    setShowScanner(false);
    const user = getUserByQrPayload(payload);
    if (user && user.id !== state.currentUser?.id) {
      const alreadyMet = state.encounters.some((e) => e.metUserId === user.id);
      if (alreadyMet) {
        router.push(`/encounter/${state.encounters.find((e) => e.metUserId === user.id)?.id}`);
        return;
      }
      setConfirmUser(user);
    }
  };

  const handleConnect = async () => {
    if (!confirmUser) return;
    setConnecting(true);
    try {
      await createEncounter(confirmUser.id);
      setConfirmUser(null);
    } finally {
      setConnecting(false);
    }
  };

  const encounterCount = BLITZ_EVENT.encounters + state.encounters.length;

  return (
    <div className="py-6 space-y-8">
      {/* Event Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-3xl">{BLITZ_EVENT.emoji}</span>
          <div>
            <h1 className="text-2xl font-black uppercase">{BLITZ_EVENT.shortName}</h1>
            <p className="font-black uppercase text-purple">{BLITZ_EVENT.city}</p>
          </div>
        </div>
        <div className="flex gap-4 mt-3 text-sm font-black uppercase">
          <span>{BLITZ_EVENT.participants} Explorers</span>
          <span>{encounterCount} Encounters</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <BrutalButton className="flex-1" onClick={() => setShowScanner(true)}>
          <ScanLine size={20} /> Scan to Meet
        </BrutalButton>
        <BrutalButton variant="secondary" onClick={() => setShowQR(true)}>
          <QrCode size={20} /> Show QR
        </BrutalButton>
      </div>

      {/* Map */}
      <EventMap nearbyUsers={nearbyUsers} onUserClick={setSelectedUser} />

      {/* Nearby */}
      <section>
        <h2 className="text-xl font-black uppercase mb-1">People Nearby</h2>
        <p className="text-sm font-bold text-black/60 mb-4">{nearbyUsers.length} Explorers</p>
        <NearbyUsersList users={nearbyUsers} onUserClick={setSelectedUser} />
      </section>

      {/* Mini leaderboard */}
      <section>
        <h2 className="text-xl font-black uppercase mb-4">Live Leaderboard</h2>
        <Leaderboard entries={state.leaderboard.slice(0, 5)} />
      </section>

      {/* User profile modal */}
      <BrutalModal
        open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      >
        {selectedUser && (
          <div className="space-y-4 pt-4">
            <ProfileCard user={selectedUser} />
            {selectedUser.rarity !== "COMMON" && (
              <div className="text-center">
                <RarityBadge rarity={selectedUser.rarity} />
                <p className="font-black uppercase text-sm mt-1">Rare Encounter</p>
              </div>
            )}
            <BrutalButton
              className="w-full"
              onClick={() => {
                setSelectedUser(null);
                setConfirmUser(selectedUser);
              }}
            >
              View Card
            </BrutalButton>
          </div>
        )}
      </BrutalModal>

      <QRProfileModal
        open={showQR}
        onClose={() => setShowQR(false)}
        user={state.currentUser!}
      />

      <QRScanner open={showScanner} onClose={() => setShowScanner(false)} onScan={handleScan} />

      <EncounterConfirmModal
        open={!!confirmUser}
        onClose={() => setConfirmUser(null)}
        metUser={confirmUser}
        onConfirm={handleConnect}
        loading={connecting}
      />

      <AnimatePresence>
        {showEncounterSuccess && (
          <EncounterSuccess
            encounter={showEncounterSuccess}
            onClose={() => setShowEncounterSuccess(null)}
            onViewCard={() => {
              setShowEncounterSuccess(null);
              router.push(`/encounter/${showEncounterSuccess.id}`);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
