"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/lib/wagmi/config";
import { MeetMintProvider } from "./MeetMintProvider";
import { WalletAuthBridge } from "@/components/auth/WalletAuthBridge";

const queryClient = new QueryClient();

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <MeetMintProvider>
          <WalletAuthBridge />
          {children}
        </MeetMintProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
