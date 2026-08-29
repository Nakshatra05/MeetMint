"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount, useConnect, useSwitchChain } from "wagmi";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { DEMO_MODE, monadTestnet } from "@/lib/constants";
import { useMeetMint } from "@/providers/MeetMintProvider";

function DemoEnterButton() {
  const router = useRouter();
  const { login, state } = useMeetMint();

  const handleEnter = () => {
    login();
    router.push(state.hasProfile ? "/explore" : "/onboarding");
  };

  return (
    <BrutalButton size="lg" onClick={handleEnter}>
      Enter MeetMint →
    </BrutalButton>
  );
}

function MetaMaskEnterButton() {
  const router = useRouter();
  const { connectAsync, connectors, isPending, error } = useConnect();
  const { switchChainAsync } = useSwitchChain();
  const { isConnected, address, chainId } = useAccount();
  const { state } = useMeetMint();
  const [connectError, setConnectError] = useState<string | null>(null);

  const metaMask =
    connectors.find((c) => c.id === "metaMaskSDK") ??
    connectors.find((c) => c.id === "injected") ??
    connectors[0];

  // Switch to Monad testnet after connect
  useEffect(() => {
    if (isConnected && chainId !== monadTestnet.id) {
      switchChainAsync({ chainId: monadTestnet.id }).catch(() => {});
    }
  }, [isConnected, chainId, switchChainAsync]);

  // Redirect once wallet + app state are synced
  useEffect(() => {
    if (isConnected && address && state.isAuthenticated) {
      router.push(state.hasProfile ? "/explore" : "/onboarding");
    }
  }, [isConnected, address, state.isAuthenticated, state.hasProfile, router]);

  const handleConnect = async () => {
    setConnectError(null);
    try {
      if (!metaMask) {
        setConnectError("MetaMask not found. Install the extension.");
        return;
      }
      await connectAsync({ connector: metaMask, chainId: monadTestnet.id });
    } catch (err) {
      setConnectError(err instanceof Error ? err.message : "Connection failed");
    }
  };

  const label = isPending ? "Connecting..." : "Connect MetaMask →";

  return (
    <div className="flex flex-col items-center gap-3">
      <BrutalButton size="lg" onClick={handleConnect} disabled={isPending}>
        {label}
      </BrutalButton>
      {(connectError || error) && (
        <p className="text-sm font-bold text-orange max-w-xs">
          {connectError || error?.message}
        </p>
      )}
      <p className="text-xs font-bold text-black/40 uppercase">
        Monad Testnet · MetaMask only
      </p>
    </div>
  );
}

export function EnterMeetMintButton() {
  if (DEMO_MODE) {
    return <DemoEnterButton />;
  }
  return <MetaMaskEnterButton />;
}
