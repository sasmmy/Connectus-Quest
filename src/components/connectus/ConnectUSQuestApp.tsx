"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { AvatarMark } from "@/components/avatar/AvatarMark";
import { CeloAccountCard, CeloLoginChip } from "@/components/celo/CeloAccountCard";
import {
  SecureImpactRecord,
  SecureRecordsSummary,
} from "@/components/celo/SecureImpactRecord";
import { BottomNav, type BottomNavItem } from "@/components/layout/BottomNav";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { QuestCard } from "@/components/quest/QuestCard";
import { QuestProgress } from "@/components/quest/QuestProgress";
import { RewardBadge } from "@/components/quest/RewardBadge";
import { RankingList } from "@/components/ranking/RankingList";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { mockBadges, mockQuests } from "@/data/mockQuests";
import { mockRanking } from "@/data/mockRanking";
import { mockUser } from "@/data/mockUser";
import { useConnectUSIdentity } from "@/hooks/useConnectUSIdentity";
import { useConnectUSQuest } from "@/hooks/useConnectUSQuest";
import { formatXp } from "@/lib/formatters";
import type { Quest, QuestCategory } from "@/types/quest";
import type { RankingEntry } from "@/types/ranking";

type ActiveScreen = "home" | "quests" | "ranking" | "profile";
type QuestFilter = "all" | "daily" | "social" | "learn";

type ConnectUSQuestAppProps = {
  initialScreen?: ActiveScreen;
};

const onboardingStorageKey = "onboarding_completed";
const onboardingStorageEvent = "connectus-onboarding-change";

function subscribeToOnboardingStorage(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener("storage", onStoreChange);
  window.addEventListener(onboardingStorageEvent, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(onboardingStorageEvent, onStoreChange);
  };
}

function getOnboardingSnapshot() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(onboardingStorageKey) === "true";
}

function getServerOnboardingSnapshot() {
  return false;
}

const navItems: BottomNavItem[] = [
  { icon: "home", id: "home", label: "Início" },
  { icon: "quests", id: "quests", label: "Missões" },
  { icon: "ranking", id: "ranking", label: "Comunidade" },
  { icon: "profile", id: "profile", label: "Perfil" },
];

const questFilters: Array<{ id: QuestFilter; label: string }> = [
  { id: "all", label: "Todas" },
  { id: "daily", label: "Diárias" },
  { id: "social", label: "Sociais" },
  { id: "learn", label: "Aprender" },
];

type ImpactStats = {
  communityActions: number;
  completedMissions: number;
  sharedOpportunities: number;
};

function getJourneyTitle(level: number) {
  if (level >= 6) {
    return "Líder Comunitária";
  }

  if (level >= 5) {
    return "Agente de Impacto";
  }

  if (level >= 4) {
    return "Conectora";
  }

  return "Exploradora";
}

function getMissionsToNextMilestone(completedCount: number) {
  const milestones = [1, 3, 5, 8, 12];
  const nextMilestone = milestones.find((milestone) => milestone > completedCount);

  return Math.max((nextMilestone ?? completedCount + 3) - completedCount, 1);
}

function getImpactStats(completedQuests: Quest[]): ImpactStats {
  return {
    communityActions: completedQuests.filter((quest) =>
      ["community", "impact"].includes(quest.category),
    ).length,
    completedMissions: completedQuests.length,
    sharedOpportunities: completedQuests.filter(
      (quest) => quest.id === "share-opportunity",
    ).length,
  };
}

export function ConnectUSQuestApp({
  initialScreen = "home",
}: ConnectUSQuestAppProps) {
  const router = useRouter();
  const questState = useConnectUSQuest({
    badges: mockBadges,
    quests: mockQuests,
    rankingEntries: mockRanking,
    user: mockUser,
  });
  const {
    badges,
    completedQuestIds,
    completedQuests,
    completeQuest,
    currentRankingUser,
    isBadgeUnlocked,
    isQuestLocked,
    levelProgress,
    message,
    profile,
    quests,
    ranking,
    resetProgress,
    setMessage,
    storageReady,
    totalXp,
    unlockedBadges,
    user,
  } = questState;
  const identity = useConnectUSIdentity();

  const [activeScreen, setActiveScreen] = useState<ActiveScreen>(initialScreen);
  const onboardingCompleted = useSyncExternalStore(
    subscribeToOnboardingStorage,
    getOnboardingSnapshot,
    getServerOnboardingSnapshot,
  );

  useEffect(() => {
    if (!message) {
      return;
    }

    const timer = window.setTimeout(() => setMessage(""), 2200);

    return () => window.clearTimeout(timer);
  }, [message, setMessage]);

  const displayProfile = {
    ...profile,
    handle: identity.displayHandle,
    name: identity.displayName,
  };
  const firstName = identity.displayName.split(" ")[0] || identity.displayName;
  const completedCount = completedQuestIds.length;
  const currentRank =
    ranking.findIndex((entry) => entry.id === currentRankingUser.id) + 1;
  const displayRankingUser = {
    ...currentRankingUser,
    name: identity.displayName,
  };
  const dailyQuest =
    quests.find((quest) => quest.id === "share-opportunity") ?? quests[0];
  const xpInsideLevel = levelProgress.xpInsideLevel;
  const xpGoal = xpInsideLevel + levelProgress.xpToNextLevel;
  const journeyTitle = getJourneyTitle(levelProgress.currentLevel);
  const nextMilestoneMissions = getMissionsToNextMilestone(completedCount);
  const impactStats = useMemo(
    () => getImpactStats(completedQuests),
    [completedQuests],
  );

  const summaryStats = useMemo(
    () => [
      {
        detail: "concluídas",
        label: "Missões",
        tone: "green" as const,
        value: `${completedCount}/${quests.length}`,
      },
      {
        detail: "desbloqueadas",
        label: "Conquistas",
        tone: "gold" as const,
        value: `${unlockedBadges.length}`,
      },
      {
        detail: "posição",
        label: "Comunidade",
        tone: "blue" as const,
        value: `#${currentRank}`,
      },
    ],
    [completedCount, currentRank, quests.length, unlockedBadges.length],
  );

  function activateScreen(screen: string) {
    setActiveScreen(screen as ActiveScreen);
    window.requestAnimationFrame(() => {
      window.scrollTo({ behavior: "smooth", top: 0 });
    });
  }

  function completeOnboarding() {
    window.localStorage.setItem(onboardingStorageKey, "true");
    window.dispatchEvent(new Event(onboardingStorageEvent));
    setActiveScreen("home");

    if (window.location.pathname !== "/") {
      router.push("/");
    }
  }

  if (!storageReady) {
    return <LoadingShell />;
  }

  if (!onboardingCompleted) {
    return <OnboardingFlow onComplete={completeOnboarding} />;
  }

  return (
    <div className="min-h-[100dvh] bg-[#060913] text-[#F7F7FF]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(53,208,127,0.16),transparent_30%),radial-gradient(circle_at_88%_8%,rgba(34,211,238,0.10),transparent_26%)]" />
      <div className="relative mx-auto min-h-[100dvh] w-full max-w-md overflow-hidden bg-[#080C18]/98 shadow-[0_24px_70px_rgba(0,0,0,0.45)] sm:border-x sm:border-white/10">
        <AppHeader />

        {message ? (
          <div className="fixed left-1/2 top-20 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-2xl border border-[#35D07F]/35 bg-[#101523]/96 px-4 py-3 text-sm font-extrabold text-[#BDF7D6] shadow-[0_14px_36px_rgba(0,0,0,0.28)] backdrop-blur-xl">
            {message}
          </div>
        ) : null}

        <main className="relative z-10 space-y-4 px-4 pb-[calc(5.8rem+env(safe-area-inset-bottom))] pt-2">
          {activeScreen === "home" ? (
            <HomeScreen
              completedQuestIds={completedQuestIds}
              currentLevel={levelProgress.currentLevel}
              dailyQuest={dailyQuest}
              firstName={firstName}
              impactStats={impactStats}
              isDailyQuestCompleted={completedQuestIds.includes(dailyQuest.id)}
              isDailyQuestLocked={isQuestLocked(dailyQuest)}
              journeyTitle={journeyTitle}
              levelProgressPercent={levelProgress.progressPercent}
              nextLevel={levelProgress.nextLevel}
              nextMilestoneMissions={nextMilestoneMissions}
              onCompleteQuest={completeQuest}
              profile={displayProfile}
              summaryStats={summaryStats}
              xpGoal={xpGoal}
              xpInsideLevel={xpInsideLevel}
              xpToNextLevel={levelProgress.xpToNextLevel}
            />
          ) : null}

          {activeScreen === "quests" ? (
            <QuestsScreen
              completedQuestIds={completedQuestIds}
              isQuestLocked={isQuestLocked}
              onCompleteQuest={completeQuest}
              quests={quests}
              userLevel={levelProgress.currentLevel}
            />
          ) : null}

          {activeScreen === "ranking" ? (
            <RankingScreen
              currentRankingUser={displayRankingUser}
              currentRank={currentRank}
              entries={mockRanking}
              totalXp={totalXp}
            />
          ) : null}

          {activeScreen === "profile" ? (
            <ProfileScreen
              badges={badges}
              completedCount={completedCount}
              currentLevel={levelProgress.currentLevel}
              currentRank={currentRank}
              impactStats={impactStats}
              isBadgeUnlocked={isBadgeUnlocked}
              isAuthenticated={identity.isAuthenticated}
              journeyTitle={journeyTitle}
              levelProgressPercent={levelProgress.progressPercent}
              nextMilestoneMissions={nextMilestoneMissions}
              onLogout={identity.logout}
              onResetProgress={resetProgress}
              profile={displayProfile}
              questsCount={quests.length}
              streakDays={user.streakDays}
              totalXp={totalXp}
              unlockedBadges={unlockedBadges}
              xpGoal={xpGoal}
              xpInsideLevel={xpInsideLevel}
            />
          ) : null}
        </main>

        <BottomNav
          activeId={activeScreen}
          items={navItems}
          onSelect={activateScreen}
        />
      </div>
    </div>
  );
}

function AppHeader() {
  return (
    <header className="sticky top-0 z-30 bg-[#080C18]/86 px-5 pb-2.5 pt-4 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 text-left">
          <p className="truncate text-lg font-black tracking-normal text-white">
            ConnectUS Quest
          </p>
          <p className="mt-0.5 inline-flex items-center gap-1.5 rounded-full bg-white/[0.05] px-2.5 py-1 text-[11px] font-semibold text-[#A7A8C8]">
            <CeloOrbitMark />
            powered by Celo
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <CeloLoginChip />
          <button
            aria-label="Notificações"
            className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.05] text-[#A7A8C8] transition active:scale-95"
            type="button"
          >
            <BellIcon />
          </button>
        </div>
      </div>
    </header>
  );
}

function HomeScreen({
  completedQuestIds,
  currentLevel,
  dailyQuest,
  firstName,
  impactStats,
  isDailyQuestCompleted,
  isDailyQuestLocked,
  journeyTitle,
  levelProgressPercent,
  nextLevel,
  nextMilestoneMissions,
  onCompleteQuest,
  profile,
  summaryStats,
  xpGoal,
  xpInsideLevel,
  xpToNextLevel,
}: {
  completedQuestIds: string[];
  currentLevel: number;
  dailyQuest: Quest;
  firstName: string;
  impactStats: ImpactStats;
  isDailyQuestCompleted: boolean;
  isDailyQuestLocked: boolean;
  journeyTitle: string;
  levelProgressPercent: number;
  nextLevel: number;
  nextMilestoneMissions: number;
  onCompleteQuest: (questId: string) => void;
  profile: { avatarId: string; handle: string; name: string };
  summaryStats: Array<{
    detail: string;
    label: string;
    tone: "green" | "gold" | "blue";
    value: string;
  }>;
  xpGoal: number;
  xpInsideLevel: number;
  xpToNextLevel: number;
}) {
  return (
    <>
      <section className="rounded-[1.75rem] border border-white/10 bg-[#101523] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.22)]">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-3xl font-black leading-9 text-white">
              Oi, {firstName} 👋
            </h1>
            <p className="mt-2 max-w-[15rem] text-sm font-medium leading-5 text-[#A7A8C8]">
              Você está evoluindo como {journeyTitle}.
            </p>
          </div>
          <AvatarMark avatarId={profile.avatarId} label={profile.name} size="md" />
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-[#35D07F]/20 bg-[#0F1A20] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.22)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#BDF7D6]">
              {journeyTitle}
            </p>
            <h2 className="mt-1 text-3xl font-black text-white">
              Nível {currentLevel}
            </h2>
            <p className="mt-1 text-sm font-medium text-[#A7A8C8]">
              {formatXp(xpInsideLevel)} / {formatXp(xpGoal)} XP
            </p>
          </div>
          <div className="rounded-full bg-[#FBCC5C]/12 px-3 py-1.5 text-sm font-extrabold text-[#FFE7A3]">
            ⚡
          </div>
        </div>
        <div className="mt-4">
          <QuestProgress value={levelProgressPercent} />
        </div>
        <p className="mt-3 text-xs font-medium text-[#A7A8C8]">
          Faltam {formatXp(xpToNextLevel)} XP para o nível {nextLevel}.
        </p>
        <p className="mt-1 text-xs font-medium text-[#8F96B3]">
          Faltam {nextMilestoneMissions} missões para alcançar o próximo marco.
        </p>
      </section>

      <DailyQuestCard
        completed={isDailyQuestCompleted}
        currentLevel={currentLevel}
        locked={isDailyQuestLocked}
        onComplete={onCompleteQuest}
        quest={dailyQuest}
      />

      <ImpactSection impactStats={impactStats} />

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-white">Seu progresso</h2>
          <p className="text-xs font-medium text-[#8F96B3]">
            {completedQuestIds.length > 0
              ? "Continue evoluindo"
              : "Comece pela missão do dia"}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {summaryStats.map((stat) => (
            <StatCard
              detail={stat.detail}
              key={stat.label}
              label={stat.label}
              tone={stat.tone}
              value={stat.value}
            />
          ))}
        </div>
      </section>
    </>
  );
}

function DailyQuestCard({
  completed,
  currentLevel,
  locked,
  onComplete,
  quest,
}: {
  completed: boolean;
  currentLevel: number;
  locked: boolean;
  onComplete: (questId: string) => void;
  quest: Quest;
}) {
  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-[#101523] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.22)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#35D07F]">Missão do dia</p>
          <h2 className="mt-1 text-2xl font-black leading-8 text-white">
            {quest.title}
          </h2>
          <p className="mt-2 text-sm font-medium leading-5 text-[#A7A8C8]">
            Cada ação fortalece sua comunidade.
          </p>
        </div>
        <div className="rounded-full bg-[#FBCC5C]/12 px-3 py-1.5 text-sm font-extrabold text-[#FFE7A3]">
          +{quest.xp} XP
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-xs font-medium text-[#8F96B3]">
          {completed ? "Missão concluída" : "Você ganha XP ao concluir."}
        </p>
        <Button
          className="px-5"
          disabled={completed || locked}
          onClick={() => onComplete(quest.id)}
          variant={completed || locked ? "secondary" : "primary"}
        >
          {completed ? "Concluída" : "Concluir missão"}
        </Button>
      </div>
      {completed ? (
        <div className="mt-4">
          <SecureImpactRecord
            missionTitle={quest.title}
            userLevel={currentLevel}
            xpReward={quest.xp}
          />
        </div>
      ) : null}
    </section>
  );
}

function ImpactSection({ impactStats }: { impactStats: ImpactStats }) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-black text-white">Seu Impacto</h2>
        <p className="mt-1 text-sm font-medium text-[#8F96B3]">
          Cada ação fortalece sua comunidade.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        <StatCard
          detail="missões"
          label="Feitas"
          tone="green"
          value={`${impactStats.completedMissions}`}
        />
        <StatCard
          detail="oportunidades"
          label="Compart."
          tone="gold"
          value={`${impactStats.sharedOpportunities}`}
        />
        <StatCard
          detail="ações"
          label="Comunidade"
          tone="blue"
          value={`${impactStats.communityActions}`}
        />
      </div>
    </section>
  );
}

function QuestsScreen({
  completedQuestIds,
  isQuestLocked,
  onCompleteQuest,
  quests,
  userLevel,
}: {
  completedQuestIds: string[];
  isQuestLocked: (quest: Quest) => boolean;
  onCompleteQuest: (questId: string) => void;
  quests: Quest[];
  userLevel: number;
}) {
  const [activeFilter, setActiveFilter] = useState<QuestFilter>("all");
  const filteredQuests = quests.filter((quest) =>
    matchesQuestFilter(quest, activeFilter),
  );

  return (
    <>
      <PageIntro
        subtitle="Complete missões simples e ganhe XP."
        title="Missões"
      />

      <div className="flex gap-2 overflow-x-auto pb-1">
        {questFilters.map((filter) => {
          const active = filter.id === activeFilter;

          return (
            <button
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                active
                  ? "border-[#35D07F]/45 bg-[#35D07F]/14 text-[#BDF7D6]"
                  : "border-white/10 bg-white/[0.04] text-[#A7A8C8]"
              }`}
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              type="button"
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {filteredQuests.map((quest) => (
          <QuestCard
            completed={completedQuestIds.includes(quest.id)}
            key={quest.id}
            locked={isQuestLocked(quest)}
            onComplete={onCompleteQuest}
            quest={quest}
            userLevel={userLevel}
          />
        ))}
      </div>
    </>
  );
}

function RankingScreen({
  currentRankingUser,
  currentRank,
  entries,
  totalXp,
}: {
  currentRankingUser: RankingEntry;
  currentRank: number;
  entries: RankingEntry[];
  totalXp: number;
}) {
  return (
    <>
      <PageIntro
        subtitle="Veja pessoas evoluindo juntas em impacto."
        title="Pessoas em destaque"
      />
      <section className="grid grid-cols-2 gap-3">
        <StatCard
          detail="sua posição"
          label="Comunidade"
          tone="blue"
          value={`#${currentRank}`}
        />
        <StatCard
          detail="energia total"
          label="Seu XP"
          tone="green"
          value={formatXp(totalXp)}
        />
      </section>
      <RankingList currentUser={currentRankingUser} entries={entries} />
    </>
  );
}

function ProfileScreen({
  badges,
  completedCount,
  currentLevel,
  currentRank,
  impactStats,
  isBadgeUnlocked,
  isAuthenticated,
  journeyTitle,
  levelProgressPercent,
  nextMilestoneMissions,
  onLogout,
  onResetProgress,
  profile,
  questsCount,
  streakDays,
  totalXp,
  unlockedBadges,
  xpGoal,
  xpInsideLevel,
}: {
  badges: typeof mockBadges;
  completedCount: number;
  currentLevel: number;
  currentRank: number;
  impactStats: ImpactStats;
  isBadgeUnlocked: (badge: (typeof mockBadges)[number]) => boolean;
  isAuthenticated: boolean;
  journeyTitle: string;
  levelProgressPercent: number;
  nextMilestoneMissions: number;
  onLogout: () => void;
  onResetProgress: () => void;
  profile: { avatarId: string; handle: string; name: string };
  questsCount: number;
  streakDays: number;
  totalXp: number;
  unlockedBadges: typeof mockBadges;
  xpGoal: number;
  xpInsideLevel: number;
}) {
  return (
    <>
      <section className="rounded-[1.75rem] border border-white/10 bg-[#101523] p-5 text-center shadow-[0_16px_40px_rgba(0,0,0,0.22)]">
        <div className="flex justify-center">
          <AvatarMark avatarId={profile.avatarId} label={profile.name} size="lg" />
        </div>
        <h1 className="mt-4 text-3xl font-black text-white">{profile.name}</h1>
        <p className="mt-1 text-sm font-medium text-[#A7A8C8]">
          {profile.handle} · {journeyTitle}
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 text-left">
          <StatCard
            detail="nível atual"
            label="Nível"
            tone="blue"
            value={`${currentLevel}`}
          />
          <StatCard
            detail="energia de impacto"
            label="XP"
            tone="green"
            value={formatXp(totalXp)}
          />
        </div>
        <div className="mt-5 text-left">
          <QuestProgress
            label={`${formatXp(xpInsideLevel)} / ${formatXp(xpGoal)} XP`}
            value={levelProgressPercent}
          />
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-white/10 bg-[#101523] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.22)]">
        <SectionTitle
          subtitle={`Você está evoluindo como ${journeyTitle}.`}
          title="Minha Jornada"
        />
        <div className="mt-4 rounded-3xl bg-white/[0.04] p-4">
          <p className="text-sm font-semibold leading-6 text-white">
            Faltam {nextMilestoneMissions} missões para alcançar o próximo
            marco.
          </p>
          <p className="mt-1 text-xs font-medium leading-5 text-[#8F96B3]">
            Cada ação registrada ajuda a mostrar sua evolução e o impacto que
            você está construindo.
          </p>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          <StatCard
            detail="missões"
            label="Feitas"
            tone="green"
            value={`${impactStats.completedMissions}`}
          />
          <StatCard
            detail="oportunidades"
            label="Compart."
            tone="gold"
            value={`${impactStats.sharedOpportunities}`}
          />
          <StatCard
            detail="ações"
            label="Comunidade"
            tone="blue"
            value={`${impactStats.communityActions}`}
          />
        </div>
      </section>

      <section className="grid grid-cols-3 gap-2.5">
        <StatCard
          detail="concluídas"
          label="Missões"
          tone="green"
          value={`${completedCount}/${questsCount}`}
        />
        <StatCard
          detail="seguidos"
          label="Dias"
          tone="gold"
          value={`${streakDays}`}
        />
        <StatCard
          detail="posição"
          label="Comunidade"
          tone="blue"
          value={`#${currentRank}`}
        />
      </section>

      <section className="space-y-3">
        <SectionTitle
          subtitle={
            unlockedBadges.length > 0
              ? "Suas conquistas mais recentes."
              : "Conclua missões para desbloquear novas conquistas."
          }
          title="Conquistas"
        />
        {unlockedBadges.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {unlockedBadges.map((badge) => (
              <RewardBadge badge={badge} key={badge.id} unlocked />
            ))}
          </div>
        ) : (
          <EmptyState body="Conclua sua primeira missão do dia." />
        )}
      </section>

      <section className="space-y-3">
        <SectionTitle subtitle="Tudo que você pode desbloquear." title="Coleção" />
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

      <p className="rounded-3xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center text-xs font-medium text-[#8F96B3]">
        Tecnologia Celo nos bastidores.
      </p>

      <section className="space-y-3">
        <SectionTitle
          subtitle="Tecnologia Celo nos bastidores para preparar sua jornada para futuras recompensas."
          title="Conta e segurança"
        />
        <CeloAccountCard />
      </section>

      <SecureRecordsSummary />

      {isAuthenticated ? (
        <Button className="w-full" onClick={onLogout} variant="ghost">
          Sair da conta
        </Button>
      ) : null}

      <Button className="w-full" onClick={onResetProgress} variant="secondary">
        Recomeçar progresso
      </Button>
    </>
  );
}

function matchesQuestFilter(quest: Quest, filter: QuestFilter) {
  const socialCategories = new Set<QuestCategory>(["community", "impact"]);
  const learnCategories = new Set<QuestCategory>(["learn", "builder"]);

  if (filter === "daily") {
    return quest.id === "share-opportunity" || quest.difficulty === "easy";
  }

  if (filter === "social") {
    return socialCategories.has(quest.category);
  }

  if (filter === "learn") {
    return learnCategories.has(quest.category);
  }

  return true;
}

function PageIntro({ subtitle, title }: { subtitle: string; title: string }) {
  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-[#101523] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.2)]">
      <h1 className="text-3xl font-black text-white">{title}</h1>
      <p className="mt-2 text-sm font-medium leading-5 text-[#A7A8C8]">
        {subtitle}
      </p>
    </section>
  );
}

function SectionTitle({
  subtitle,
  title,
}: {
  subtitle: string;
  title: string;
}) {
  return (
    <div>
      <h2 className="text-lg font-black text-white">{title}</h2>
      <p className="mt-1 text-sm font-medium text-[#8F96B3]">{subtitle}</p>
    </div>
  );
}

function EmptyState({ body }: { body: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-center">
      <p className="text-sm font-medium leading-6 text-[#A7A8C8]">{body}</p>
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

function LoadingShell() {
  return (
    <div className="min-h-[100dvh] bg-[#060913] text-[#F7F7FF]">
      <div className="mx-auto grid min-h-[100dvh] w-full max-w-md place-items-center px-4">
        <section className="w-full rounded-[1.75rem] border border-white/10 bg-[#101523] p-6 text-center shadow-[0_16px_40px_rgba(0,0,0,0.22)]">
          <p className="text-lg font-black text-white">ConnectUS Quest</p>
          <p className="mt-1 inline-flex items-center justify-center gap-1.5 text-[11px] font-semibold text-[#A7A8C8]">
            <CeloOrbitMark />
            powered by Celo
          </p>
          <div className="mx-auto mt-5 h-3 w-40 overflow-hidden rounded-full bg-white/[0.08]">
            <div className="h-full w-2/3 rounded-full bg-[#35D07F] motion-safe:animate-pulse" />
          </div>
          <p className="mt-4 text-sm font-medium text-[#A7A8C8]">
            Carregando seu progresso.
          </p>
        </section>
      </div>
    </div>
  );
}

function BellIcon() {
  return (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M15 18a3 3 0 0 1-6 0M18 9.8c0-3.4-2.1-5.8-6-5.8S6 6.4 6 9.8c0 4.9-2 5.5-2 7.2h16c0-1.7-2-2.3-2-7.2Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}
