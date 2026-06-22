"use client";

import { useCallback, useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { createWalletClient, custom, type Address } from "viem";
import {
  connectUSImpactRegistryAbi,
  connectUSImpactRegistryAddress,
} from "@/lib/contracts";
import { celoMainnet, saveLastCeloRecordTx } from "@/lib/celo";

type RegisterImpactRecordInput = {
  missionTitle: string;
  xpReward: number;
  userLevel: number;
};

const friendlyError =
  "Não conseguimos registrar agora. Seu progresso continua salvo no app.";

function toPositiveBigInt(value: number, fallback: number) {
  const normalizedValue = Number.isFinite(value)
    ? Math.max(Math.trunc(value), 0)
    : fallback;

  return BigInt(normalizedValue);
}

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
        await connectedAccount.switchChain(celoMainnet.id);

        const provider = await connectedAccount.getEthereumProvider();
        const walletClient = createWalletClient({
          account: connectedAccount.address as Address,
          chain: celoMainnet,
          transport: custom(provider),
        });

        const hash = await walletClient.writeContract({
          account: connectedAccount.address as Address,
          address: connectUSImpactRegistryAddress,
          abi: connectUSImpactRegistryAbi,
          args: [
            missionTitle,
            toPositiveBigInt(xpReward, 0),
            toPositiveBigInt(userLevel, 1),
          ],
          chain: celoMainnet,
          functionName: "registerImpact",
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
