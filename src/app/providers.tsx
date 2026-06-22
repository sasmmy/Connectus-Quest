"use client";

import { PrivyProvider, type PrivyClientConfig } from "@privy-io/react-auth";
import { celoMainnet } from "@/lib/celo";

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
    showWalletUIs: false,
  },
  loginMethods: ["email", "google", "sms"],
  supportedChains: [celoMainnet],
};

export function Providers({ children }: ProvidersProps) {
  if (!privyAppId) {
    return <>{children}</>;
  }

  return (
    <PrivyProvider appId={privyAppId} config={privyConfig}>
      {children}
    </PrivyProvider>
  );
}
