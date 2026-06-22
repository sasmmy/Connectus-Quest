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
import { Button } from "@/components/ui/Button";

type SecureImpactRecordProps = {
  missionTitle: string;
  xpReward: number;
  userLevel: number;
};

const hasPrivyAppId = Boolean(process.env.NEXT_PUBLIC_PRIVY_APP_ID);

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
    <section className="rounded-[1.75rem] border border-[#22D3EE]/16 bg-[#101523] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.22)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white">Registros seguros</h2>
          <p className="mt-2 text-sm font-medium leading-5 text-[#A7A8C8]">
            Seu progresso continua salvo no app mesmo sem registro.
          </p>
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#22D3EE]/12 text-[#B8F3FF]">
          ✓
        </span>
      </div>

      {lastTxHash ? (
        <div className="mt-4 rounded-3xl bg-white/[0.04] p-4">
          <p className="text-xs font-semibold text-[#8F96B3]">
            Último registro
          </p>
          <p className="mt-1 text-sm font-extrabold text-white">
            {shortenAddress(lastTxHash)}
          </p>
          <a
            className="mt-3 inline-flex rounded-full border border-[#22D3EE]/25 bg-[#22D3EE]/10 px-3 py-2 text-xs font-extrabold text-[#B8F3FF] transition hover:border-[#22D3EE]/45 hover:bg-[#22D3EE]/15"
            href={getCeloExplorerTxUrl(lastTxHash)}
            rel="noreferrer"
            target="_blank"
          >
            Ver registro seguro
          </a>
        </div>
      ) : (
        <p className="mt-4 rounded-3xl bg-white/[0.04] p-4 text-sm font-medium leading-5 text-[#A7A8C8]">
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
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
        <div className="h-20 rounded-2xl bg-white/[0.04] motion-safe:animate-pulse" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="rounded-3xl border border-[#35D07F]/16 bg-[#35D07F]/[0.06] p-4">
        <p className="text-sm font-black text-white">
          Salve sua conquista com segurança
        </p>
        <p className="mt-1 text-xs font-medium leading-5 text-[#A7A8C8]">
          Entre para preparar sua jornada para recompensas futuras.
        </p>
        <Button className="mt-3 min-h-9 px-4 text-xs" onClick={() => login()}>
          Entrar e salvar
        </Button>
      </div>
    );
  }

  if (wallets.length === 0) {
    return (
      <div className="rounded-3xl border border-[#22D3EE]/16 bg-[#22D3EE]/[0.055] p-4">
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
    <div className="rounded-3xl border border-[#22D3EE]/16 bg-[#22D3EE]/[0.055] p-4">
      <p className="text-sm font-black text-white">
        {txHash ? "Conquista registrada" : "Registrar conquista segura"}
      </p>
      <p className="mt-1 text-xs font-medium leading-5 text-[#A7A8C8]">
        Essa missão pode gerar um registro simples com tecnologia Celo.
      </p>

      {txHash ? (
        <a
          className="mt-3 inline-flex rounded-full border border-[#22D3EE]/25 bg-[#22D3EE]/10 px-3 py-2 text-xs font-extrabold text-[#B8F3FF] transition hover:border-[#22D3EE]/45 hover:bg-[#22D3EE]/15"
          href={getCeloExplorerTxUrl(txHash)}
          rel="noreferrer"
          target="_blank"
        >
          Ver registro seguro
        </a>
      ) : (
        <Button
          className="mt-3 min-h-9 px-4 text-xs"
          disabled={isRegistering}
          onClick={() =>
            registerImpactRecord({
              missionTitle,
              userLevel,
              xpReward,
            })
          }
        >
          {isRegistering ? "Registrando..." : "Registrar agora"}
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
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-sm font-black text-white">
        Salve sua conquista com segurança
      </p>
      <p className="mt-1 text-xs font-medium leading-5 text-[#A7A8C8]">
        Entrada segura ainda não configurada neste ambiente. Seu progresso
        continua salvo no app.
      </p>
    </div>
  );
}
