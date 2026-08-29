import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { monadTestnet } from "@/lib/constants";

export const wagmiConfig = createConfig({
  chains: [monadTestnet],
  connectors: [
    injected({
      target: "metaMask",
    }),
  ],
  transports: {
    [monadTestnet.id]: http(),
  },
  ssr: true,
});
