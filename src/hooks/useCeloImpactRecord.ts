"use client";

import { useCallback, useRef, useState } from "react";
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
const walletConfirmationTimeoutMs = 5 * 60 * 1000;

function toPositiveBigInt(value: number, fallback: number) {
  const normalizedValue = Number.isFinite(value)
    ? Math.max(Math.trunc(value), 0)
    : fallback;

  return BigInt(normalizedValue);
}

async function withWalletTimeout<T>(operation: Promise<T>) {
  let timeoutId: number | undefined;

  try {
    return await Promise.race([
      operation,
      new Promise<never>((_, reject) => {
        timeoutId = window.setTimeout(() => {
          reject(new Error("Wallet confirmation timed out"));
        }, walletConfirmationTimeoutMs);
      }),
    ]);
  } finally {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
  }
}

export function useCeloImpactRecord() {
  const { authenticated, ready } = usePrivy();
  const { wallets } = useWallets();
  const registeringRef = useRef(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");

  const registerImpactRecord = useCallback(
    async ({ missionTitle, xpReward, userLevel }: RegisterImpactRecordInput) => {
      if (registeringRef.current) {
        return "";
      }

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

      registeringRef.current = true;
      setIsRegistering(true);

      try {
        await withWalletTimeout(connectedAccount.switchChain(celoMainnet.id));

        const provider = await withWalletTimeout(
          connectedAccount.getEthereumProvider(),
        );
        const walletClient = createWalletClient({
          account: connectedAccount.address as Address,
          chain: celoMainnet,
          transport: custom(provider),
        });

        const hash = await withWalletTimeout(
          walletClient.writeContract({
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
          }),
        );

        setTxHash(hash);
        saveLastCeloRecordTx(hash);

        return hash;
      } catch {
        setError(friendlyError);
        return "";
      } finally {
        registeringRef.current = false;
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
