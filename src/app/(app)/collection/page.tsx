"use client";

import { useState } from "react";
import { CollectionCard } from "@/components/cards/EncounterCard";
import { useMeetMint } from "@/providers/MeetMintProvider";
import { cn } from "@/lib/utils";

type Tab = "people" | "events" | "badges";

export default function CollectionPage() {
  const { state } = useMeetMint();
  const [tab, setTab] = useState<Tab>("people");

  const people = state.collection.filter((c) => c.type === "person");
  const events = state.collection.filter((c) => c.type === "event");
  const badges = state.badges.filter((b) => b.unlockedAt || state.quests.some((q) => q.status === "completed" && q.rewardBadge?.includes(b.name.split(" ")[0]?.toUpperCase() || "")));

  const stats = {
    people: people.length,
    events: events.length + (state.currentUser?.eventCount || 0),
    badges: state.currentUser?.badgeCount || 0,
  };

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "people", label: "People", count: stats.people },
    { id: "events", label: "Events", count: stats.events },
    { id: "badges", label: "Badges", count: stats.badges },
  ];

  return (
    <div className="py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-black uppercase">My Collection</h1>
        <div className="flex gap-4 mt-3 text-sm font-black uppercase">
          <span>{stats.people} People</span>
          <span>{stats.events} Events</span>
          <span>{stats.badges} Badges</span>
        </div>
      </div>

      <div className="flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "px-4 py-2 font-black uppercase text-sm brutal-border brutal-shadow-sm rounded-xl brutal-press",
              tab === t.id ? "bg-yellow" : "bg-white"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "people" && (
        people.length === 0 ? (
          <div className="brutal-card rounded-2xl p-12 text-center">
            <p className="text-4xl mb-4">🤝</p>
            <p className="font-black uppercase text-xl">No encounters yet</p>
            <p className="font-bold text-black/60 mt-2">Scan someone&apos;s QR to start your collection</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {people.map((item) => (
              <CollectionCard key={item.id} item={item} />
            ))}
          </div>
        )
      )}

      {tab === "events" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {events.length > 0 ? (
            events.map((item) => <CollectionCard key={item.id} item={item} />)
          ) : (
            <CollectionCard
              item={{
                id: "blitz-attended",
                type: "event",
                title: "MONAD BLITZ",
                subtitle: "DELHI 2026",
                rarity: "EPIC",
                emoji: "⚡",
                color: "#836EF9",
              }}
            />
          )}
        </div>
      )}

      {tab === "badges" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {state.badges.map((badge) => {
            const unlocked = state.quests.some(
              (q) => q.status === "completed" && q.rewardBadge?.toLowerCase().includes(badge.name.split(" ")[0].toLowerCase())
            ) || badge.id === "first-meet" && state.encounters.length > 0;
            return (
              <div
                key={badge.id}
                className={cn(
                  "brutal-card rounded-xl p-4 aspect-square flex flex-col items-center justify-center text-center",
                  !unlocked && "opacity-40 grayscale"
                )}
              >
                <span className="text-4xl">{badge.emoji}</span>
                <p className="font-black uppercase text-sm mt-2">{badge.name}</p>
                <p className="text-xs font-bold text-black/60">{badge.description}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
