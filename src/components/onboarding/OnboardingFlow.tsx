"use client";

import { useState } from "react";
import { CeloLoginAction } from "@/components/celo/CeloAccountCard";
import { saveOnboardingChoices } from "@/hooks/useConnectUSIdentity";
import { Button } from "@/components/ui/Button";

type OnboardingFlowProps = {
  onComplete: () => void;
};

type IdentityOption = {
  id: string;
  title: string;
  description: string;
  initials: string;
};

type GoalOption = {
  id: string;
  title: string;
  description: string;
};

const identityOptions: IdentityOption[] = [
  {
    id: "explorer",
    title: "Explorador de impacto",
    description: "Quero começar com ações simples.",
    initials: "SE",
  },
  {
    id: "connector",
    title: "Conector da comunidade",
    description: "Quero aproximar pessoas e oportunidades.",
    initials: "CO",
  },
  {
    id: "learner",
    title: "Aprendiz em evolução",
    description: "Quero aprender e ganhar ritmo.",
    initials: "AP",
  },
];

const goalOptions: GoalOption[] = [
  {
    id: "daily",
    title: "Criar hábito",
    description: "Fazer pequenas missões todos os dias.",
  },
  {
    id: "community",
    title: "Ajudar minha comunidade",
    description: "Compartilhar apoio, recursos e oportunidades.",
  },
  {
    id: "growth",
    title: "Evoluir minha jornada",
    description: "Ganhar XP, níveis e conquistas.",
  },
];

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [identity, setIdentity] = useState(identityOptions[0].id);
  const [goal, setGoal] = useState(goalOptions[0].id);

  const progress = ((step + 1) / 4) * 100;

  function nextStep() {
    setStep((currentStep) => currentStep + 1);
  }

  function completeFlow() {
    saveOnboardingChoices(identity, goal);
    onComplete();
  }

  function selectIdentity(nextIdentity: string) {
    setIdentity(nextIdentity);
    saveOnboardingChoices(nextIdentity, goal);
  }

  function selectGoal(nextGoal: string) {
    setGoal(nextGoal);
    saveOnboardingChoices(identity, nextGoal);
  }

  function previousStep() {
    setStep((currentStep) => Math.max(0, currentStep - 1));
  }

  return (
    <div className="min-h-[100dvh] bg-[#060913] text-[#F7F7FF]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(53,208,127,0.16),transparent_30%),radial-gradient(circle_at_86%_8%,rgba(34,211,238,0.1),transparent_26%)]" />
      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-md flex-col overflow-hidden bg-[#080C18]/98 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 shadow-[0_24px_70px_rgba(0,0,0,0.45)] sm:border-x sm:border-white/10">
        <header className="flex items-center justify-between gap-3">
          <div>
            <p className="text-lg font-black text-white">ConnectUS Quest</p>
            <p className="mt-0.5 inline-flex items-center gap-1.5 rounded-full bg-white/[0.05] px-2.5 py-1 text-[11px] font-semibold text-[#A7A8C8]">
              <CeloOrbitMark />
              powered by Celo
            </p>
          </div>
          <button
            className="rounded-full px-3 py-2 text-sm font-semibold text-[#A7A8C8] transition hover:bg-white/[0.06] hover:text-white"
            onClick={completeFlow}
            type="button"
          >
            Pular por enquanto
          </button>
        </header>

        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
          <div
            className="h-full rounded-full bg-[#35D07F] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <main className="flex flex-1 flex-col justify-center py-6">
          {step === 0 ? <WelcomeStep /> : null}
          {step === 1 ? (
            <IdentityStep
              identity={identity}
              onSelectIdentity={selectIdentity}
            />
          ) : null}
          {step === 2 ? (
            <GoalStep goal={goal} onSelectGoal={selectGoal} />
          ) : null}
          {step === 3 ? <MissionUnlockedStep /> : null}
        </main>

        <footer className="grid gap-3">
          {step === 3 ? (
            <>
              <CeloLoginAction
                className="w-full"
                fallbackToComplete
                label="Entrar e salvar minha jornada"
                onComplete={completeFlow}
              />
              <Button className="w-full" onClick={completeFlow} variant="secondary">
                Continuar sem entrar
              </Button>
            </>
          ) : (
            <Button className="w-full" onClick={nextStep}>
              Continuar
            </Button>
          )}
          {step > 0 && step < 3 ? (
            <Button className="w-full" onClick={previousStep} variant="ghost">
              Voltar
            </Button>
          ) : null}
        </footer>
      </div>
    </div>
  );
}

function WelcomeStep() {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-[#101523] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.22)]">
      <div className="grid size-16 place-items-center rounded-3xl bg-[#35D07F]/14 text-3xl">
        ✦
      </div>
      <h1 className="mt-6 text-4xl font-black leading-10 text-white">
        Sua jornada de impacto começa aqui.
      </h1>
      <p className="mt-4 text-base font-medium leading-7 text-[#A7A8C8]">
        Complete missões simples, ganhe XP e acompanhe seu progresso na
        comunidade.
      </p>
      <div className="mt-6 grid grid-cols-3 gap-2.5">
        <MiniStat label="XP" value="+100" />
        <MiniStat label="Nível" value="3" />
        <MiniStat label="Missão" value="1ª" />
      </div>
    </section>
  );
}

function IdentityStep({
  identity,
  onSelectIdentity,
}: {
  identity: string;
  onSelectIdentity: (identity: string) => void;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-3xl font-black text-white">Escolha sua identidade</h1>
        <p className="mt-2 text-sm font-medium leading-6 text-[#A7A8C8]">
          Por enquanto, usamos iniciais. Depois essa etapa pode receber Ready
          Player Me ou avatar por selfie.
        </p>
      </div>

      <div className="space-y-3">
        {identityOptions.map((option) => {
          const selected = option.id === identity;

          return (
            <button
              aria-pressed={selected}
              className={`flex w-full items-center gap-3 rounded-3xl border p-4 text-left transition ${
                selected
                  ? "border-[#35D07F]/45 bg-[#35D07F]/[0.08]"
                  : "border-white/10 bg-[#101523]/88"
              }`}
              key={option.id}
              onClick={() => onSelectIdentity(option.id)}
              type="button"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#35D07F] to-[#22D3EE] text-sm font-black text-white">
                {option.initials}
              </span>
              <span className="min-w-0">
                <span className="block text-base font-extrabold text-white">
                  {option.title}
                </span>
                <span className="mt-1 block text-sm font-medium text-[#A7A8C8]">
                  {option.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FutureAvatarCard title="Ready Player Me" />
        <FutureAvatarCard title="Avatar por selfie" />
      </div>
    </section>
  );
}

function GoalStep({
  goal,
  onSelectGoal,
}: {
  goal: string;
  onSelectGoal: (goal: string) => void;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-3xl font-black text-white">Qual é seu objetivo?</h1>
        <p className="mt-2 text-sm font-medium leading-6 text-[#A7A8C8]">
          Isso ajuda o app a sugerir missões melhores no futuro.
        </p>
      </div>

      <div className="space-y-3">
        {goalOptions.map((option) => {
          const selected = option.id === goal;

          return (
            <button
              aria-pressed={selected}
              className={`w-full rounded-3xl border p-4 text-left transition ${
                selected
                  ? "border-[#35D07F]/45 bg-[#35D07F]/[0.08]"
                  : "border-white/10 bg-[#101523]/88"
              }`}
              key={option.id}
              onClick={() => onSelectGoal(option.id)}
              type="button"
            >
              <span className="block text-base font-extrabold text-white">
                {option.title}
              </span>
              <span className="mt-1 block text-sm font-medium leading-5 text-[#A7A8C8]">
                {option.description}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function MissionUnlockedStep() {
  return (
    <section className="rounded-[2rem] border border-[#35D07F]/28 bg-[#101523] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.22)]">
      <p className="text-sm font-semibold text-[#35D07F]">
        Primeira missão desbloqueada
      </p>
      <h1 className="mt-2 text-3xl font-black leading-9 text-white">
        Compartilhe uma oportunidade
      </h1>
      <p className="mt-3 text-sm font-medium leading-6 text-[#A7A8C8]">
        Envie um curso, evento ou vaga para alguém que pode aproveitar.
      </p>
      <div className="mt-6 flex items-center justify-between rounded-3xl bg-white/[0.05] p-4">
        <span className="text-sm font-semibold text-[#A7A8C8]">
          Recompensa inicial
        </span>
        <span className="rounded-full bg-[#FBCC5C]/12 px-3 py-1.5 text-sm font-extrabold text-[#FFE7A3]">
          +100 XP
        </span>
      </div>
      <p className="mt-5 text-xs font-medium leading-5 text-[#8F96B3]">
        Seu progresso fica salvo automaticamente neste dispositivo.
      </p>
    </section>
  );
}

function FutureAvatarCard({ title }: { title: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-white/12 bg-white/[0.035] p-4">
      <p className="text-sm font-extrabold text-white">{title}</p>
      <p className="mt-1 text-xs font-medium text-[#8F96B3]">Preparado para o futuro</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/[0.05] p-3 text-center">
      <p className="text-lg font-black text-white">{value}</p>
      <p className="mt-0.5 text-[11px] font-medium text-[#8F96B3]">{label}</p>
    </div>
  );
}

function CeloOrbitMark() {
  return (
    <span aria-hidden="true" className="relative inline-block size-3.5 shrink-0">
      <span className="absolute left-0 top-1 size-2 rounded-full border border-[#35D07F] bg-[#35D07F]/16" />
      <span className="absolute right-0 top-0 size-1.5 rounded-full border border-[#FBCC5C] bg-[#FBCC5C]/16" />
      <span className="absolute bottom-0 right-1 size-1 rounded-full border border-[#22D3EE] bg-[#22D3EE]/16" />
    </span>
  );
}
