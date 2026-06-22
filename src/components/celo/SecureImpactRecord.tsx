"use client";

import { useEffect, useState } from "react";
import { useLogin, usePrivy, useWallets } from "@privy-io/react-auth";
import { useCeloImpactRecord } from "@/hooks/useCeloImpactRecord";
import {
  celoRecordStorageEvent,
  getCeloExplorerTxUrl,
  getLastCeloRecordTx,
  shortenAddress,
} from "@/lib/celo";
import { isPrivyAppIdConfigured } from "@/lib/privy";
import { Button } from "@/components/ui/Button";

type SecureImpactRecordProps = {
  missionTitle: string;
  xpReward: number;
  userLevel: number;
};

const hasPrivyAppId = isPrivyAppIdConfigured();

export function SecureImpactRecord(props: SecureImpactRecordProps) {
  if (!hasPrivyAppId) {
    return <SecureImpactUnavailable />;
  }

  return <ConnectedSecureImpactRecord {...props} />;
}

export function SecureRecordsSummary() {
  const [lastTxHash, setLastTxHash] = useState("");

  useEffect(() => {
    function syncLastRecord() {
      setLastTxHash(getLastCeloRecordTx());
    }

    syncLastRecord();
    window.addEventListener("storage", syncLastRecord);
    window.addEventListener(celoRecordStorageEvent, syncLastRecord);

    return () => {
      window.removeEventListener("storage", syncLastRecord);
      window.removeEventListener(celoRecordStorageEvent, syncLastRecord);
    };
  }, []);

  return (
    <section className="relative overflow-hidden rounded-[1.75rem] border border-[#22D3EE]/20 bg-[linear-gradient(145deg,rgba(34,211,238,0.12),rgba(16,21,35,0.96))] p-5 shadow-[0_16px_42px_rgba(0,0,0,0.25)]">
      <div className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full bg-[#22D3EE]/10 blur-2xl" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white">Registros seguros</h2>
          <p className="mt-2 text-sm font-medium leading-5 text-[#A7A8C8]">
            Seu progresso continua salvo no app mesmo sem registro.
          </p>
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-full border border-[#22D3EE]/20 bg-[#22D3EE]/12 text-xs font-black text-[#B8F3FF]">
          OK
        </span>
      </div>

      {lastTxHash ? (
        <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.055] p-4">
          <p className="text-xs font-semibold text-[#8F96B3]">
            Último registro
          </p>
          <p className="mt-1 text-sm font-extrabold text-white">
            {shortenAddress(lastTxHash)}
          </p>
          <a
            className="mt-3 inline-flex rounded-full border border-[#22D3EE]/30 bg-[#22D3EE]/12 px-3 py-2 text-xs font-extrabold text-[#B8F3FF] transition hover:border-[#22D3EE]/50 hover:bg-[#22D3EE]/18"
            href={getCeloExplorerTxUrl(lastTxHash)}
            rel="noreferrer"
            target="_blank"
          >
            Ver registro seguro
          </a>
        </div>
      ) : (
        <p className="mt-4 rounded-3xl border border-white/10 bg-white/[0.045] p-4 text-sm font-medium leading-5 text-[#A7A8C8]">
          Conclua uma missão e escolha registrar sua conquista com segurança.
        </p>
      )}
    </section>
  );
}

function ConnectedSecureImpactRecord({
  missionTitle,
  xpReward,
  userLevel,
}: SecureImpactRecordProps) {
  const { authenticated, ready } = usePrivy();
  const { wallets } = useWallets();
  const { login } = useLogin();
  const { error, isRegistering, registerImpactRecord, txHash } =
    useCeloImpactRecord();

  if (!ready) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-4">
        <div className="h-20 rounded-2xl bg-white/[0.04] motion-safe:animate-pulse" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="rounded-3xl border border-[#35D07F]/22 bg-[linear-gradient(145deg,rgba(53,208,127,0.12),rgba(255,255,255,0.035))] p-4">
        <p className="text-sm font-black text-white">
          Registrar conquista segura
        </p>
        <p className="mt-1 text-xs font-medium leading-5 text-[#A7A8C8]">
          Entre para guardar essa conquista com mais segurança.
        </p>
        <Button className="mt-3 min-h-9 px-4 text-xs" onClick={() => login()}>
          Entrar e registrar
        </Button>
      </div>
    );
  }

  if (wallets.length === 0) {
    return (
      <div className="rounded-3xl border border-[#22D3EE]/20 bg-[linear-gradient(145deg,rgba(34,211,238,0.12),rgba(255,255,255,0.035))] p-4">
        <p className="text-sm font-black text-white">
          Registrar conquista segura
        </p>
        <p className="mt-1 text-xs font-medium leading-5 text-[#A7A8C8]">
          Estamos preparando sua conta. Tente novamente em instantes.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-[#22D3EE]/20 bg-[linear-gradient(145deg,rgba(34,211,238,0.12),rgba(255,255,255,0.035))] p-4">
      <p className="text-sm font-black text-white">
        {txHash ? "Conquista registrada" : "Registrar conquista segura"}
      </p>
      <p className="mt-1 text-xs font-medium leading-5 text-[#A7A8C8]">
        Sua missão concluída pode receber um registro seguro.
      </p>

      {txHash ? (
        <a
          className="mt-3 inline-flex rounded-full border border-[#22D3EE]/30 bg-[#22D3EE]/12 px-3 py-2 text-xs font-extrabold text-[#B8F3FF] transition hover:border-[#22D3EE]/50 hover:bg-[#22D3EE]/18"
          href={getCeloExplorerTxUrl(txHash)}
          rel="noreferrer"
          target="_blank"
        >
          Ver registro seguro
        </a>
      ) : (
        <Button
          className="mt-3 min-h-9 px-4 text-xs shadow-[0_10px_24px_rgba(53,208,127,0.18)]"
          disabled={isRegistering}
          onClick={() =>
            registerImpactRecord({
              missionTitle,
              userLevel,
              xpReward,
            })
          }
        >
          {isRegistering ? "Registrando..." : "Registrar conquista segura"}
        </Button>
      )}

      {error ? (
        <p className="mt-3 text-xs font-semibold leading-5 text-[#FFE7A3]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SecureImpactUnavailable() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-4">
      <p className="text-sm font-black text-white">
        Registrar conquista segura
      </p>
      <p className="mt-1 text-xs font-medium leading-5 text-[#A7A8C8]">
        Esse registro ainda não está configurado neste ambiente. Seu progresso
        continua salvo no app.
      </p>
    </div>
  );
}
