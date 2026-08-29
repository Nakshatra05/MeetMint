"use client";

import { QRCodeSVG } from "qrcode.react";
import { BrutalModal } from "../ui/BrutalModal";
import type { UserProfile } from "@/lib/types";
import { ProfileCard } from "../cards/ProfileCard";
import { Avatar } from "../ui/Avatar";

export function QRProfileModal({
  open,
  onClose,
  user,
}: {
  open: boolean;
  onClose: () => void;
  user: UserProfile;
}) {
  return (
    <BrutalModal open={open} onClose={onClose} title="Your QR">
      <div className="flex flex-col items-center gap-4">
        <ProfileCard user={user} compact />
        <div className="p-4 bg-white brutal-border brutal-shadow rounded-xl">
          <QRCodeSVG value={user.qrPayload} size={180} level="M" />
        </div>
        <p className="text-sm font-bold text-center text-black/60">
          Show this to someone nearby to create an encounter
        </p>
      </div>
    </BrutalModal>
  );
}

export function EncounterConfirmModal({
  open,
  onClose,
  metUser,
  onConfirm,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  metUser: UserProfile | null;
  onConfirm: () => void;
  loading?: boolean;
}) {
  if (!metUser) return null;

  return (
    <BrutalModal open={open} onClose={onClose}>
      <div className="text-center space-y-4 pt-4">
        <p className="text-sm font-black uppercase tracking-widest text-black/50">New Connection</p>
        <div className="flex justify-center">
          <Avatar
            src={metUser.avatar}
            seed={metUser.id}
            name={metUser.name}
            color={metUser.avatarColor}
            size="xl"
          />
        </div>
        <h2 className="text-2xl font-black uppercase">{metUser.name.split(" ")[0]}</h2>
        <p className="font-bold uppercase text-black/70">
          {metUser.role} · {metUser.interests[0]}
        </p>
        {metUser.bio && (
          <p className="text-sm font-bold italic text-black/60">&ldquo;{metUser.bio}&rdquo;</p>
        )}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 brutal-btn brutal-press bg-white rounded-xl py-3 font-black uppercase"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 brutal-btn brutal-press bg-green rounded-xl py-3 font-black uppercase disabled:opacity-50"
          >
            {loading ? "Connecting..." : "Connect"}
          </button>
        </div>
      </div>
    </BrutalModal>
  );
}
