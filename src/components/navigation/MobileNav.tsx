"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Trophy, Layers, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/quests", label: "Quests", icon: Trophy },
  { href: "/collection", label: "Collection", icon: Layers },
  { href: "/profile", label: "Profile", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white brutal-border border-t-3 border-x-0 border-b-0 md:hidden">
      <div className="flex justify-around py-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl font-black text-xs uppercase",
                active ? "text-purple" : "text-black/50"
              )}
            >
              <Icon size={22} strokeWidth={active ? 3 : 2} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex flex-col gap-2 w-56 shrink-0 p-4">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl font-black uppercase text-sm brutal-btn brutal-press",
              active ? "bg-yellow" : "bg-white"
            )}
          >
            <Icon size={20} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function DebugMenu({ onReset }: { onReset: () => void }) {
  return (
    <details className="fixed bottom-20 right-4 z-50 md:bottom-4">
      <summary className="text-xs font-bold text-black/30 cursor-pointer select-none">debug</summary>
      <button
        onClick={onReset}
        className="mt-1 text-xs font-black uppercase bg-red-100 brutal-border px-3 py-1 rounded-lg"
      >
        Reset Demo
      </button>
    </details>
  );
}
