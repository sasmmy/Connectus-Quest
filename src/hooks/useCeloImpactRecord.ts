"use client";

import { useCallback, useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { createWalletClient, custom, type Address, type Hex } from "viem";
import {
  celoTestnet,
  encodeImpactRecord,
  saveLastCeloRecordTx,
} from "@/lib/celo";

type RegisterImpactRecordInput = {
  missionTitle: string;
  xpReward: number;
  userLevel: number;
};

const friendlyError =
  "Não conseguimos registrar agora. Seu progresso continua salvo no app.";

export function useCeloImpactRecord() {
  const { authenticated, ready } = usePrivy();
  const { wallets } = useWallets();
  const [isRegistering, setIsRegistering] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");

  const registerImpactRecord = useCallback(
    async ({ missionTitle, xpReward, userLevel }: RegisterImpactRecordInput) => {
      setError("");
      setTxHash("");

      if (!ready || !authenticated) {
        setError("Entre com sua conta para registrar essa conquista.");
        return "";
      }

      const connectedAccount =
        wallets.find((wallet) => wallet.walletClientType === "privy") ??
        wallets[0];

      if (!connectedAccount) {
        setError("Estamos preparando sua conta. Tente novamente em instantes.");
        return "";
      }

      setIsRegistering(true);

      try {
        await connectedAccount.switchChain(celoTestnet.id);

        const provider = await connectedAccount.getEthereumProvider();
        const walletClient = createWalletClient({
          account: connectedAccount.address as Address,
          chain: celoTestnet,
          transport: custom(provider),
        });
        const timestamp = new Date().toISOString();
        const metadata = [
          "ConnectUS Quest",
          "missão concluída",
          missionTitle,
          `+${xpReward} XP`,
          `nível ${userLevel}`,
          timestamp,
        ].join(" | ");
        const data = encodeImpactRecord(metadata);
        const hash = await walletClient.sendTransaction({
          account: connectedAccount.address as Address,
          chain: celoTestnet,
          data: data as Hex,
          to: connectedAccount.address as Address,
          value: BigInt(0),
        });

        setTxHash(hash);
        saveLastCeloRecordTx(hash);

        return hash;
      } catch {
        setError(friendlyError);
        return "";
      } finally {
        setIsRegistering(false);
      }
    },
    [authenticated, ready, wallets],
  );

  return {
    error,
    isRegistering,
    registerImpactRecord,
    txHash,
  };
}
