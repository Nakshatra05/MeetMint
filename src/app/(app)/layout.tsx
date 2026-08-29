"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/branding/Logo";
import { MobileNav, DesktopNav, DebugMenu } from "@/components/navigation/MobileNav";
import { useMeetMint } from "@/providers/MeetMintProvider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { state, resetDemo } = useMeetMint();

  useEffect(() => {
    if (!state.isAuthenticated) {
      router.push("/");
    } else if (!state.hasProfile) {
      router.push("/onboarding");
    }
  }, [state.isAuthenticated, state.hasProfile, router]);

  if (!state.isAuthenticated || !state.hasProfile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-cream flex">
      <DesktopNav />
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-cream/90 backdrop-blur-sm px-4 py-3 flex items-center justify-between md:hidden brutal-border border-x-0 border-t-0">
          <Logo size="sm" />
        </header>
        <main className="flex-1 pb-24 md:pb-8 px-4 md:px-8 max-w-4xl mx-auto w-full">
          {children}
        </main>
        <MobileNav />
        <DebugMenu onReset={resetDemo} />
      </div>
    </div>
  );
}
