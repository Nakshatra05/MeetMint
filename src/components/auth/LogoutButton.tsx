"use client";

import { useRouter } from "next/navigation";
import { useAccount, useDisconnect } from "wagmi";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { useMeetMint } from "@/providers/MeetMintProvider";

export function LogoutButton() {
  const router = useRouter();
  const { logout: meetMintLogout } = useMeetMint();
  const { disconnect } = useDisconnect();
  const { isConnected } = useAccount();

  const handleLogout = () => {
    meetMintLogout();
    if (isConnected) {
      disconnect();
    }
    router.push("/");
  };

  return (
    <BrutalButton variant="ghost" size="sm" onClick={handleLogout}>
      Disconnect
    </BrutalButton>
  );
}
