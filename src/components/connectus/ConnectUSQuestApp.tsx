"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AvatarMark, getAvatarProfile } from "@/components/avatar/AvatarMark";
import { AvatarPicker } from "@/components/avatar/AvatarPicker";
import { QuestCard } from "@/components/quest/QuestCard";
import { QuestProgress } from "@/components/quest/QuestProgress";
import { RewardBadge } from "@/components/quest/RewardBadge";
import { RankingList } from "@/components/ranking/RankingList";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { mockBadges, mockQuests } from "@/data/mockQuests";
import { mockRanking } from "@/data/mockRanking";
import { mockUser } from "@/data/mockUser";
import { formatXp } from "@/lib/formatters";
import { useConnectUSQuest } from "@/hooks/useConnectUSQuest";
import type { Quest } from "@/types/quest";

type ActiveScreen = "base" | "quests" | "hall" | "agent";

type ConnectUSQuestAppProps = {
  initialScreen?: ActiveScreen;
};

const navItems: Array<{
  id: ActiveScreen;
  label: string;
  signal: string;
}> = [
  { id: "base", label: "Base", signal: "01" },
  { id: "quests", label: "Quests", signal: "02" },
  { id: "hall", label: "Hall", signal: "03" },
  { id: "agent", label: "Agente", signal: "04" },
];

export function ConnectUSQuestApp({
  initialScreen = "base",
}: ConnectUSQuestAppProps) {
  const questState = useConnectUSQuest({
    badges: mockBadges,
    quests: mockQuests,
    rankingEntries: mockRanking,
    user: mockUser,
  });
  const {
    badges,
    completedQuestIds,
    completeQuest,
    currentRankingUser,
    isBadgeUnlocked,
    isQuestLocked,
    levelProgress,
    message,
    profile,
    quests,
    ranking,
    recommendedQuests,
    resetProgress,
    setMessage,
    storageReady,
    totalXp,
    unlockedBadges,
    updateProfile,
    user,
  } = questState;

  const [activeScreen, setActiveScreen] = useState<ActiveScreen>(initialScreen);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    if (!message) {
      return;
    }

    const timer = window.setTimeout(() => setMessage(""), 2400);

    return () => window.clearTimeout(timer);
  }, [message, setMessage]);

  const profileData = getAvatarProfile(profile.avatarId);
  const completedCount = completedQuestIds.length;
  const currentRank =
    ranking.findIndex((entry) => entry.id === currentRankingUser.id) + 1;
  const completedQuestPercent = Math.round(
    (completedCount / Math.max(quests.length, 1)) * 100,
  );
  const nextStepCopy =
    levelProgress.xpToNextLevel === user.nextLevelXp
      ? "Novo ciclo aberto para o proximo nivel."
      : `Faltam ${formatXp(levelProgress.xpToNextLevel)} XP para subir.`;

  const baseStats = useMemo(
    () => [
      {
        detail: "Energia de impacto total",
        label: "Energia",
        tone: "green" as const,
        value: `${formatXp(totalXp)} XP`,
      },
      {
        detail: "Operacoes concluidas",
        label: "Quests",
        tone: "blue" as const,
        value: `${completedCount}/${quests.length}`,
      },
      {
        detail: "Insignias desbloqueadas",
        label: "Insignias",
        tone: "gold" as const,
        value: `${unlockedBadges.length}/${badges.length}`,
      },
    ],
    [badges.length, completedCount, quests.length, totalXp, unlockedBadges.length],
  );

  function activateScreen(screen: ActiveScreen) {
    setActiveScreen(screen);
    window.requestAnimationFrame(() => {
      window.scrollTo({ behavior: "smooth", top: 0 });
    });
  }

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    updateProfile({
      handle: String(formData.get("handle") ?? profile.handle),
      name: String(formData.get("name") ?? profile.name),
    });
  }

  function selectAvatar(avatarId: string) {
    updateProfile({ avatarId });
  }

  function handleReset() {
    resetProgress();
    setSettingsOpen(false);
    activateScreen("base");
  }

  if (!storageReady) {
    return <LoadingShell />;
  }

  return (
    <div className="min-h-[100dvh] bg-[#05070D] text-[#F0F0FF] sm:bg-[linear-gradient(120deg,#05070D_0%,#0A0A12_45%,#11152B_100%)]">
      <div className="mx-auto min-h-[100dvh] w-full max-w-md overflow-hidden border-x border-[#1E1E3A] bg-[#0A0A12] shadow-[0_0_60px_rgba(124,58,237,0.2)]">
        <div className="relative min-h-[100dvh] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#261A5A_0%,rgba(10,10,18,0)_34%),linear-gradient(180deg,rgba(6,182,212,0.08),rgba(10,10,18,0)_28%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:28px_28px] opacity-20" />

          <header className="sticky top-0 z-40 border-b border-[#1E1E3A]/80 bg-[#0A0A12]/86 px-4 py-4 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <button
                className="min-w-0 text-left"
                onClick={() => activateScreen("base")}
                type="button"
              >
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#06B6D4]">
                  ConnectUS
                </p>
                <h1 className="truncate font-serif text-2xl font-black tracking-normal text-[#F0F0FF]">
                  Quest
                </h1>
              </button>

              <div className="flex items-center gap-2">
                <button
                  aria-label="Abrir configuracoes"
                  className="grid size-11 place-items-center rounded-2xl border border-[#1E1E3A] bg-[#12121E] text-lg font-black text-[#8888AA] shadow-sm transition hover:border-[#7C3AED] hover:text-[#F0F0FF]"
                  onClick={() => setSettingsOpen(true)}
                  type="button"
                >
                  ⚙
                </button>
                <button
                  aria-label="Abrir ficha do agente"
                  className="rounded-2xl border border-[#1E1E3A] bg-[#12121E] p-1 transition hover:border-[#35D07F]"
                  onClick={() => activateScreen("agent")}
                  type="button"
                >
                  <AvatarMark avatarId={profile.avatarId} size="sm" />
                </button>
              </div>
            </div>
          </header>

          {message ? (
            <div className="fixed left-1/2 top-20 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-3xl border border-[#35D07F]/50 bg-[#102A26]/95 px-4 py-3 text-sm font-black text-[#F0F0FF] shadow-[0_0_24px_rgba(53,208,127,0.25)] backdrop-blur-xl">
              {message}
            </div>
          ) : null}

          {settingsOpen ? (
            <SettingsPanel
              onClose={() => setSettingsOpen(false)}
              onReset={handleReset}
            />
          ) : null}

          <main className="relative z-10 space-y-5 px-4 pb-32 pt-4">
            {activeScreen === "base" ? (
              <>
                <section className="relative overflow-hidden rounded-[2rem] border border-[#1E1E3A] bg-[#12121E]/95 p-5 shadow-[0_0_35px_rgba(124,58,237,0.18)]">
                  <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[#A855F7] to-transparent" />
                  <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#35D07F] via-[#06B6D4] to-[#A855F7]" />

                  <div className="flex items-start gap-4">
                    <AvatarMark avatarId={profile.avatarId} size="lg" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#06B6D4]">
                        Agente ativo
                      </p>
                      <h2 className="mt-1 truncate font-serif text-3xl font-black leading-8 text-[#F0F0FF]">
                        {profile.name}
                      </h2>
                      <p className="mt-1 truncate text-sm font-semibold text-[#8888AA]">
                        {profile.handle}
                      </p>
                      <div className="mt-3 rounded-2xl border border-[#35D07F]/30 bg-[#0A0A12]/70 px-3 py-2">
                        <p className="text-xs font-black text-[#35D07F]">
                          {profileData.name}
                        </p>
                        <p className="mt-0.5 text-[11px] font-semibold leading-4 text-[#8888AA]">
                          {profileData.title}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-3xl border border-[#1E1E3A] bg-[#0A0A12] p-4">
                      <p className="text-[11px] font-black uppercase text-[#8888AA]">
                        Nivel
                      </p>
                      <p className="mt-1 font-mono text-3xl font-black text-[#F5C451]">
                        {levelProgress.currentLevel}
                      </p>
                    </div>
                    <div className="rounded-3xl border border-[#1E1E3A] bg-[#0A0A12] p-4">
                      <p className="text-[11px] font-black uppercase text-[#8888AA]">
                        Energia
                      </p>
                      <p className="mt-1 font-mono text-3xl font-black text-[#35D07F]">
                        {formatXp(totalXp)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <QuestProgress
                      label={`Nivel ${levelProgress.currentLevel} para ${levelProgress.nextLevel}`}
                      value={levelProgress.progressPercent}
                      tone="dark"
                    />
                    <p className="mt-3 text-sm font-semibold leading-6 text-[#C9C2FF]">
                      Sua jornada de impacto continua. {nextStepCopy}
                    </p>
                  </div>
                </section>

                <section className="space-y-3">
                  <SectionHeader
                    kicker="Operacoes recomendadas"
                    title="Continue sua jornada de impacto"
                  />
                  {recommendedQuests.length > 0 ? (
                    <div className="space-y-3">
                      {recommendedQuests.map((quest) => (
                        <CompactQuestCard
                          completed={completedQuestIds.includes(quest.id)}
                          key={quest.id}
                          locked={isQuestLocked(quest)}
                          onComplete={completeQuest}
                          quest={quest}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      body="Todas as quests disponiveis foram concluidas. A rede ja sente seu impacto."
                      title="Ciclo completo"
                    />
                  )}
                </section>

                <div className="grid grid-cols-3 gap-3">
                  {baseStats.map((stat) => (
                    <StatCard
                      detail={stat.detail}
                      key={stat.label}
                      label={stat.label}
                      tone={stat.tone}
                      value={stat.value}
                    />
                  ))}
                </div>

                <section className="space-y-3">
                  <SectionHeader
                    kicker="Recompensas"
                    title="Insignias desbloqueadas"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    {badges.slice(0, 2).map((badge) => (
                      <RewardBadge
                        badge={badge}
                        key={badge.id}
                        unlocked={isBadgeUnlocked(badge)}
                      />
                    ))}
                  </div>
                </section>
              </>
            ) : null}

            {activeScreen === "quests" ? (
              <>
                <section className="rounded-[2rem] border border-[#1E1E3A] bg-[#12121E]/95 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#06B6D4]">
                    Quests de impacto
                  </p>
                  <h2 className="mt-2 font-serif text-3xl font-black text-[#F0F0FF]">
                    Operacoes que movem a rede
                  </h2>
                  <p className="mt-2 text-sm font-semibold leading-6 text-[#8888AA]">
                    Complete uma vez, ganhe XP uma vez. Seu nivel, hall e
                    insignias atualizam no instante.
                  </p>
                  <div className="mt-5">
                    <QuestProgress
                      label={`${completedCount} de ${quests.length} quests concluidas`}
                      value={completedQuestPercent}
                      tone="dark"
                    />
                  </div>
                </section>

                <div className="space-y-4">
                  {quests.map((quest) => (
                    <QuestCard
                      completed={completedQuestIds.includes(quest.id)}
                      key={quest.id}
                      locked={isQuestLocked(quest)}
                      onComplete={completeQuest}
                      quest={quest}
                    />
                  ))}
                </div>
              </>
            ) : null}

            {activeScreen === "hall" ? (
              <>
                <section className="rounded-[2rem] border border-[#1E1E3A] bg-gradient-to-br from-[#12121E] to-[#0A0A12] p-5 shadow-[0_0_35px_rgba(245,196,81,0.12)]">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#F5C451]">
                    Hall dos Agentes
                  </p>
                  <h2 className="mt-2 font-serif text-3xl font-black text-[#F0F0FF]">
                    Top impactadores
                  </h2>
                  <p className="mt-2 text-sm font-semibold leading-6 text-[#8888AA]">
                    Sua posicao reage ao XP real salvo no seu progresso.
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-3xl border border-[#F5C451]/30 bg-[#2A210E] p-4">
                      <p className="text-[11px] font-black uppercase text-[#F5C451]">
                        Posicao
                      </p>
                      <p className="mt-1 font-mono text-3xl font-black text-[#F0F0FF]">
                        #{currentRank}
                      </p>
                    </div>
                    <div className="rounded-3xl border border-[#35D07F]/30 bg-[#102A26] p-4">
                      <p className="text-[11px] font-black uppercase text-[#35D07F]">
                        Seu XP
                      </p>
                      <p className="mt-1 font-mono text-3xl font-black text-[#F0F0FF]">
                        {formatXp(totalXp)}
                      </p>
                    </div>
                  </div>
                </section>

                <RankingList
                  currentUser={currentRankingUser}
                  entries={mockRanking}
                />
              </>
            ) : null}

            {activeScreen === "agent" ? (
              <>
                <section className="rounded-[2rem] border border-[#1E1E3A] bg-[#12121E]/95 p-5">
                  <div className="flex flex-col items-center text-center">
                    <AvatarMark avatarId={profile.avatarId} size="lg" />
                    <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-[#06B6D4]">
                      Ficha do agente
                    </p>
                    <h2 className="mt-1 font-serif text-3xl font-black text-[#F0F0FF]">
                      {profile.name}
                    </h2>
                    <p className="mt-1 text-sm font-semibold text-[#8888AA]">
                      {profile.handle}
                    </p>
                  </div>

                  <form className="mt-6 space-y-4" onSubmit={saveProfile}>
                    <label className="block">
                      <span className="text-xs font-black uppercase tracking-[0.12em] text-[#8888AA]">
                        Nome publico
                      </span>
                      <input
                        className="mt-2 w-full rounded-2xl border border-[#1E1E3A] bg-[#0A0A12] px-4 py-3 text-sm font-bold text-[#F0F0FF] outline-none transition placeholder:text-[#55557A] focus:border-[#7C3AED] focus:shadow-[0_0_20px_rgba(168,85,247,0.25)]"
                        defaultValue={profile.name}
                        key={`name-${profile.name}`}
                        maxLength={40}
                        name="name"
                        onBlur={(event) =>
                          updateProfile({ name: event.currentTarget.value })
                        }
                        placeholder="Seu nome de agente"
                      />
                    </label>

                    <label className="block">
                      <span className="text-xs font-black uppercase tracking-[0.12em] text-[#8888AA]">
                        Handle
                      </span>
                      <input
                        className="mt-2 w-full rounded-2xl border border-[#1E1E3A] bg-[#0A0A12] px-4 py-3 text-sm font-bold text-[#F0F0FF] outline-none transition placeholder:text-[#55557A] focus:border-[#35D07F] focus:shadow-[0_0_20px_rgba(53,208,127,0.22)]"
                        defaultValue={profile.handle}
                        key={`handle-${profile.handle}`}
                        maxLength={24}
                        name="handle"
                        onBlur={(event) =>
                          updateProfile({ handle: event.currentTarget.value })
                        }
                        placeholder="@seu.handle"
                      />
                    </label>

                    <Button className="w-full" type="submit">
                      Salvar identidade
                    </Button>
                  </form>
                </section>

                <section className="space-y-3">
                  <SectionHeader
                    kicker="Especialidade"
                    title="Escolha seu avatar"
                  />
                  <AvatarPicker
                    onSelect={selectAvatar}
                    options={user.avatarOptions}
                    selectedAvatar={profile.avatarId}
                  />
                </section>

                <section className="space-y-3">
                  <SectionHeader kicker="Resumo" title="Estatisticas" />
                  <div className="grid grid-cols-2 gap-3">
                    <StatCard
                      detail="Energia acumulada"
                      label="XP total"
                      tone="green"
                      value={`${formatXp(totalXp)} XP`}
                    />
                    <StatCard
                      detail="Nivel atual"
                      label="Nivel"
                      tone="blue"
                      value={`${levelProgress.currentLevel}`}
                    />
                    <StatCard
                      detail="Quests concluidas"
                      label="Quests"
                      tone="gold"
                      value={`${completedCount}/${quests.length}`}
                    />
                    <StatCard
                      detail="Insignias ativas"
                      label="Insignias"
                      tone="green"
                      value={`${unlockedBadges.length}/${badges.length}`}
                    />
                  </div>
                </section>

                <section className="space-y-3">
                  <SectionHeader kicker="Colecao" title="Insignias" />
                  <div className="grid grid-cols-2 gap-3">
                    {badges.map((badge) => (
                      <RewardBadge
                        badge={badge}
                        key={badge.id}
                        unlocked={isBadgeUnlocked(badge)}
                      />
                    ))}
                  </div>
                </section>
              </>
            ) : null}
          </main>

          <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-[#1E1E3A]/90 bg-[#0A0A12]/92 px-3 pb-4 pt-3 backdrop-blur-xl">
            <div className="grid grid-cols-4 gap-2 rounded-[1.7rem] border border-[#1E1E3A] bg-[#12121E]/95 p-2 shadow-[0_0_28px_rgba(124,58,237,0.18)]">
              {navItems.map((item) => {
                const active = activeScreen === item.id;

                return (
                  <button
                    aria-current={active ? "page" : undefined}
                    className={`rounded-2xl px-2 py-2 text-center transition duration-200 active:scale-95 ${
                      active
                        ? "bg-gradient-to-br from-[#7C3AED] to-[#A855F7] text-[#F0F0FF] shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                        : "text-[#8888AA] hover:bg-white/5 hover:text-[#F0F0FF]"
                    }`}
                    key={item.id}
                    onClick={() => activateScreen(item.id)}
                    type="button"
                  >
                    <span className="block font-mono text-[11px] font-black">
                      {item.signal}
                    </span>
                    <span className="mt-1 block text-[11px] font-black">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div>
      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#06B6D4]">
        {kicker}
      </p>
      <h2 className="mt-1 font-serif text-2xl font-black tracking-normal text-[#F0F0FF]">
        {title}
      </h2>
    </div>
  );
}

function CompactQuestCard({
  completed,
  locked,
  onComplete,
  quest,
}: {
  completed: boolean;
  locked: boolean;
  onComplete: (questId: string) => void;
  quest: Quest;
}) {
  return (
    <article className="rounded-3xl border border-[#1E1E3A] bg-[#12121E]/95 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#7C3AED]/70 hover:shadow-[0_0_20px_rgba(168,85,247,0.18)]">
      <div className="flex items-center gap-3">
        <div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-[#06B6D4]/40 bg-[#081525] font-mono text-xs font-black tracking-[0.16em] text-[#06B6D4]">
          {quest.signal}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-serif text-lg font-black text-[#F0F0FF]">
            {quest.title}
          </h3>
          <p className="mt-0.5 text-xs font-semibold text-[#8888AA]">
            +{formatXp(quest.xp)} XP de impacto
          </p>
        </div>
        <Button
          className="min-h-10 px-3 text-xs"
          disabled={completed || locked}
          onClick={() => onComplete(quest.id)}
          variant={completed || locked ? "secondary" : "primary"}
        >
          {completed ? "Feita" : locked ? "Bloq." : "Concluir"}
        </Button>
      </div>
    </article>
  );
}

function EmptyState({ body, title }: { body: string; title: string }) {
  return (
    <div className="rounded-3xl border border-[#1E1E3A] bg-[#12121E]/86 p-5 text-center">
      <p className="font-serif text-xl font-black text-[#F0F0FF]">{title}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-[#8888AA]">
        {body}
      </p>
    </div>
  );
}

function LoadingShell() {
  return (
    <div className="min-h-[100dvh] bg-[#05070D] text-[#F0F0FF] sm:bg-[linear-gradient(120deg,#05070D_0%,#0A0A12_45%,#11152B_100%)]">
      <div className="mx-auto grid min-h-[100dvh] w-full max-w-md place-items-center border-x border-[#1E1E3A] bg-[#0A0A12] px-4">
        <section className="w-full rounded-[2rem] border border-[#1E1E3A] bg-[#12121E] p-6 text-center shadow-[0_0_40px_rgba(168,85,247,0.18)]">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#06B6D4]">
            ConnectUS Quest
          </p>
          <h1 className="mt-2 font-serif text-3xl font-black text-[#F0F0FF]">
            Inicializando base
          </h1>
          <div className="mx-auto mt-5 h-3 w-40 overflow-hidden rounded-full bg-[#0A0A12] p-1 ring-1 ring-[#1E1E3A]">
            <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-[#35D07F] via-[#06B6D4] to-[#A855F7] shadow-[0_0_18px_rgba(168,85,247,0.4)] motion-safe:animate-pulse" />
          </div>
          <p className="mt-4 text-sm font-semibold text-[#8888AA]">
            Carregando seu progresso local.
          </p>
        </section>
      </div>
    </div>
  );
}

function SettingsPanel({
  onClose,
  onReset,
}: {
  onClose: () => void;
  onReset: () => void;
}) {
  return (
    <div className="absolute inset-0 z-50 bg-[#05070D]/80 px-4 pt-24 backdrop-blur-md">
      <section className="rounded-[2rem] border border-[#1E1E3A] bg-[#12121E] p-5 shadow-[0_0_40px_rgba(168,85,247,0.24)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#06B6D4]">
              Configuracoes
            </p>
            <h2 className="mt-1 font-serif text-2xl font-black text-[#F0F0FF]">
              Controle da simulacao
            </h2>
          </div>
          <button
            className="rounded-2xl border border-[#1E1E3A] bg-[#0A0A12] px-3 py-2 text-xs font-black text-[#8888AA] transition hover:border-[#7C3AED] hover:text-[#F0F0FF]"
            onClick={onClose}
            type="button"
          >
            Fechar
          </button>
        </div>

        <p className="mt-4 text-sm font-semibold leading-6 text-[#8888AA]">
          O reset apaga somente os dados salvos pelo ConnectUS Quest neste
          navegador: perfil, avatar e quests concluidas.
        </p>

        <Button className="mt-5 w-full" onClick={onReset} variant="secondary">
          Resetar progresso
        </Button>
      </section>
    </div>
  );
}
