"use client";

import { useRouter } from "next/navigation";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { DEMO_MODE } from "@/lib/constants";
import { useMeetMint } from "@/providers/MeetMintProvider";
import { LogoutButton } from "./LogoutButton";

function DemoSignOutButton() {
  const router = useRouter();
  const { logout } = useMeetMint();

  return (
    <BrutalButton
      variant="ghost"
      size="sm"
      onClick={() => {
        logout();
        router.push("/");
      }}
    >
      Sign Out
    </BrutalButton>
  );
}

export function SignOutButton() {
  if (DEMO_MODE) {
    return <DemoSignOutButton />;
  }
  return <LogoutButton />;
}
