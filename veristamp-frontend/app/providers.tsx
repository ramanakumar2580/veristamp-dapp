"use client";

import {
  RainbowKitProvider,
  getDefaultConfig,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;
const alchemyRpcUrl = process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL!;

if (!projectId || !alchemyRpcUrl) {
  throw new Error("Missing environment variables for WalletConnect or Alchemy");
}

export const config = getDefaultConfig({
  appName: "VeriStamp",
  projectId: projectId,
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(alchemyRpcUrl),
  },
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#3b82f6",
            borderRadius: "medium",
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
