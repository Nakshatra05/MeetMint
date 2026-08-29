"use client";

import { useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import { DEMO_MODE } from "@/lib/constants";
import { useMeetMint } from "@/providers/MeetMintProvider";

/** Syncs MetaMask wallet session ↔ MeetMint app state. */
export function WalletAuthBridge() {
  const { address, isConnected } = useAccount();
  const { login, logout, state } = useMeetMint();
  const hadWalletSession = useRef(false);

  useEffect(() => {
    if (DEMO_MODE) return;

    if (isConnected && address) {
      login({ walletAddress: address });
      hadWalletSession.current = true;
      return;
    }

    if (hadWalletSession.current || (state.isAuthenticated && state.connectedWallet)) {
      logout();
      hadWalletSession.current = false;
    }
  }, [isConnected, address, login, logout, state.isAuthenticated, state.connectedWallet]);

  return null;
}
