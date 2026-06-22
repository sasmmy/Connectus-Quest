"use client";

import { useLogin, usePrivy, useWallets, type User } from "@privy-io/react-auth";
import { Button } from "@/components/ui/Button";
import { getCeloExplorerAddressUrl, shortenAddress } from "@/lib/celo";

type LoginActionProps = {
  className?: string;
  fallbackToComplete?: boolean;
  label?: string;
  onComplete?: () => void;
  variant?: "primary" | "secondary" | "ghost";
};

const hasPrivyAppId = Boolean(process.env.NEXT_PUBLIC_PRIVY_APP_ID);

export function CeloAccountCard() {
  if (!hasPrivyAppId) {
    return <CeloAccountFallback />;
  }

  return <ConnectedCeloAccountCard />;
}

export function CeloLoginChip() {
  if (!hasPrivyAppId) {
    return (
      <button
        className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-extrabold text-[#A7A8C8]"
        title="Entrada segura ainda não configurada neste ambiente"
        type="button"
      >
        Entrar
      </button>
    );
  }

  return <ConnectedCeloLoginChip />;
}

export function CeloLoginAction({
  className = "",
  fallbackToComplete = false,
  label = "Entrar e continuar",
  onComplete,
  variant = "primary",
}: LoginActionProps) {
  if (!hasPrivyAppId) {
    return (
      <Button
        className={className}
        onClick={fallbackToComplete ? onComplete : undefined}
        title="Entrada segura ainda não configurada neste ambiente"
        variant={variant}
      >
        {label}
      </Button>
    );
  }

  return (
    <ConnectedCeloLoginAction
      className={className}
      label={label}
      onComplete={onComplete}
      variant={variant}
    />
  );
}

function ConnectedCeloAccountCard() {
  const { authenticated, ready, user } = usePrivy();
  const { ready: accountsReady, wallets } = useWallets();
  const { login } = useLogin();
  const address = wallets[0]?.address ?? user?.wallet?.address;
  const entryMethod = getEntryMethod(user);

  if (!ready) {
    return (
      <AccountShell>
        <div className="h-24 rounded-3xl bg-white/[0.04] motion-safe:animate-pulse" />
      </AccountShell>
    );
  }

  if (!authenticated) {
    return (
      <AccountShell>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-lg font-black text-white">
              Entre para salvar sua jornada
            </p>
            <p className="mt-2 text-sm font-medium leading-5 text-[#A7A8C8]">
              Sua conta cria uma identidade segura para acompanhar seu progresso.
            </p>
          </div>
          <SecureOrbit />
        </div>
        <Button className="mt-5 w-full" onClick={() => login()}>
          Entrar e continuar
        </Button>
      </AccountShell>
    );
  }

  return (
    <AccountShell>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-black text-white">Conta ativa</p>
          <p className="mt-2 text-sm font-medium leading-5 text-[#A7A8C8]">
            Sua jornada está conectada com segurança pela Celo.
          </p>
        </div>
        <SecureOrbit active />
      </div>

      <div className="mt-5 grid gap-2">
        <AccountDetail label="Entrada" value={entryMethod} />
        <AccountDetail
          label="Registro"
          value={accountsReady && address ? shortenAddress(address) : "Preparando"}
        />
      </div>

      {address ? (
        <a
          className="mt-4 inline-flex rounded-full border border-[#22D3EE]/25 bg-[#22D3EE]/10 px-3 py-2 text-xs font-extrabold text-[#B8F3FF] transition hover:border-[#22D3EE]/45 hover:bg-[#22D3EE]/15"
          href={getCeloExplorerAddressUrl(address)}
          rel="noreferrer"
          target="_blank"
        >
          Ver registro seguro
        </a>
      ) : null}
    </AccountShell>
  );
}

function ConnectedCeloLoginChip() {
  const { authenticated, ready } = usePrivy();
  const { login } = useLogin();

  return (
    <button
      className={`rounded-full border px-3 py-2 text-xs font-extrabold transition active:scale-95 ${
        authenticated
          ? "border-[#35D07F]/30 bg-[#35D07F]/12 text-[#BDF7D6]"
          : "border-white/10 bg-white/[0.05] text-[#F7F7FF] hover:border-[#35D07F]/30"
      }`}
      disabled={!ready || authenticated}
      onClick={() => login()}
      type="button"
    >
      {authenticated ? "Conta ativa" : "Entrar"}
    </button>
  );
}

function ConnectedCeloLoginAction({
  className = "",
  label = "Entrar e continuar",
  onComplete,
  variant = "primary",
}: LoginActionProps) {
  const { login } = useLogin({
    onComplete: () => {
      onComplete?.();
    },
  });

  return (
    <Button className={className} onClick={() => login()} variant={variant}>
      {label}
    </Button>
  );
}

function CeloAccountFallback() {
  return (
    <AccountShell>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-black text-white">
            Entre para salvar sua jornada
          </p>
          <p className="mt-2 text-sm font-medium leading-5 text-[#A7A8C8]">
            Entrada segura ainda não configurada neste ambiente. Você pode
            continuar usando o app normalmente.
          </p>
        </div>
        <SecureOrbit />
      </div>
    </AccountShell>
  );
}

function AccountShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-[1.75rem] border border-[#35D07F]/16 bg-[#101523] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.22)]">
      {children}
    </section>
  );
}

function AccountDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/[0.04] px-4 py-3">
      <span className="text-xs font-semibold text-[#8F96B3]">{label}</span>
      <span className="truncate text-sm font-extrabold text-white">{value}</span>
    </div>
  );
}

function SecureOrbit({ active = false }: { active?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`relative grid size-12 shrink-0 place-items-center rounded-full border ${
        active
          ? "border-[#35D07F]/35 bg-[#35D07F]/12 shadow-[0_0_24px_rgba(53,208,127,0.18)]"
          : "border-white/10 bg-white/[0.04]"
      }`}
    >
      <span className="size-4 rounded-full border-2 border-[#35D07F]" />
      <span className="absolute right-3 top-3 size-2 rounded-full bg-[#FBCC5C]" />
      <span className="absolute bottom-3 left-3 size-1.5 rounded-full bg-[#22D3EE]" />
    </span>
  );
}

function getEntryMethod(user: User | null) {
  if (!user) {
    return "Conta";
  }

  if (user.google?.email) {
    return "Google";
  }

  if (user.email?.address) {
    return "E-mail";
  }

  if (user.phone?.number) {
    return "Telefone";
  }

  return "Conta";
}
