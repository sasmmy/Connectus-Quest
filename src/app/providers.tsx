"use client";

import { PrivyProvider, type PrivyClientConfig } from "@privy-io/react-auth";
import { celoMainnet } from "@/lib/celo";
import { isPrivyAppIdConfigured } from "@/lib/privy";

type ProvidersProps = {
  children: React.ReactNode;
};

const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

const privyConfig: PrivyClientConfig = {
  appearance: {
    accentColor: "#35D07F",
    landingHeader: "Entre no ConnectUS Quest",
    loginMessage: "Salve sua jornada de impacto com uma conta simples.",
    showWalletLoginFirst: false,
    theme: "#080C18",
    walletChainType: "ethereum-only",
  },
  defaultChain: celoMainnet,
  embeddedWallets: {
    ethereum: {
      createOnLogin: "users-without-wallets",
    },
    showWalletUIs: true,
  },
  loginMethods: ["email", "google", "sms"],
  supportedChains: [celoMainnet],
};

export function Providers({ children }: ProvidersProps) {
  const configuredPrivyAppId = privyAppId?.trim() ?? "";

  if (!isPrivyAppIdConfigured(configuredPrivyAppId)) {
    return <>{children}</>;
  }

  return (
    <PrivyProvider appId={configuredPrivyAppId} config={privyConfig}>
      {children}
    </PrivyProvider>
  );
}
