"use client";

import {
  type FormEvent,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { AvatarPicker } from "@/components/avatar/AvatarPicker";
import {
  AvatarMark,
  getAvatarProfile,
} from "@/components/avatar/AvatarMark";
import { QuestCard } from "@/components/quest/QuestCard";
import { QuestProgress } from "@/components/quest/QuestProgress";
import { RewardBadge } from "@/components/quest/RewardBadge";
import { RankingList } from "@/components/ranking/RankingList";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { formatXp } from "@/lib/formatters";
import type { Badge, Quest } from "@/types/quest";
import type { RankingEntry } from "@/types/ranking";
import type { MockUser } from "@/types/user";

type QuestDashboardProps = {
  user: MockUser;
  quests: Quest[];
  badges: Badge[];
  rankingEntries: RankingEntry[];
};

const storageKey = "connectus-quest.completed";
const storageEventName = "connectus-quest.progress-changed";
const avatarStorageKey = "connectus-quest.avatar";
const avatarStorageEventName = "connectus-quest.avatar-changed";
const displayNameStorageKey = "connectus-quest.display-name";
const displayNameStorageEventName = "connectus-quest.display-name-changed";

function getStoredQuestIdsSnapshot() {
  if (typeof window === "undefined") {
    return "[]";
  }

  return window.localStorage.getItem(storageKey) ?? "[]";
}

function subscribeToQuestProgress(onStoreChange: () => void) {
  window.addEventListener(storageEventName, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(storageEventName, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function saveQuestIds(questIds: string[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(questIds));
  window.dispatchEvent(new Event(storageEventName));
}

function getStoredAvatarSnapshot() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(avatarStorageKey) ?? "";
}

function subscribeToAvatar(onStoreChange: () => void) {
  window.addEventListener(avatarStorageEventName, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(avatarStorageEventName, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function saveAvatar(avatar: string) {
  window.localStorage.setItem(avatarStorageKey, avatar);
  window.dispatchEvent(new Event(avatarStorageEventName));
}

function getStoredDisplayNameSnapshot() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(displayNameStorageKey) ?? "";
}

function subscribeToDisplayName(onStoreChange: () => void) {
  window.addEventListener(displayNameStorageEventName, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(displayNameStorageEventName, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function normalizeDisplayName(name: string) {
  return name.trim().replace(/\s+/g, " ").slice(0, 40);
}

function saveDisplayName(displayName: string) {
  window.localStorage.setItem(displayNameStorageKey, displayName);
  window.dispatchEvent(new Event(displayNameStorageEventName));
}

function getLevelProgress(totalXp: number, baseLevel: number, levelStepXp: number) {
  const safeStep = Math.max(levelStepXp, 1);
  const completedLevelUps = Math.floor(totalXp / safeStep);
  const xpInsideLevel = totalXp % safeStep;
  const currentLevel = baseLevel + completedLevelUps;
  const progressPercent = Math.round((xpInsideLevel / safeStep) * 100);
  const xpToNextLevel = safeStep - xpInsideLevel;

  return {
    currentLevel,
    nextLevel: currentLevel + 1,
    progressPercent,
    xpToNextLevel,
  };
}

export function QuestDashboard({
  user,
  quests,
  badges,
  rankingEntries,
}: QuestDashboardProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const storedQuestIdsSnapshot = useSyncExternalStore(
    subscribeToQuestProgress,
    getStoredQuestIdsSnapshot,
    () => "[]",
  );
  const storedAvatar = useSyncExternalStore(
    subscribeToAvatar,
    getStoredAvatarSnapshot,
    () => "",
  );
  const storedDisplayName = useSyncExternalStore(
    subscribeToDisplayName,
    getStoredDisplayNameSnapshot,
    () => "",
  );

  const selectedAvatar = user.avatarOptions.includes(storedAvatar)
    ? storedAvatar
    : user.avatarId;
  const selectedAvatarProfile = getAvatarProfile(selectedAvatar);
  const displayName = normalizeDisplayName(storedDisplayName) || user.name;
  const firstName = displayName.split(" ")[0] || displayName;

  const completedQuestIds = useMemo(() => {
    try {
      const parsedValue = JSON.parse(storedQuestIdsSnapshot);

      if (Array.isArray(parsedValue)) {
        return parsedValue.filter(
          (item): item is string => typeof item === "string",
        );
      }
    } catch {
      return [];
    }

    return [];
  }, [storedQuestIdsSnapshot]);

  const completedQuests = useMemo(
    () => quests.filter((quest) => completedQuestIds.includes(quest.id)),
    [completedQuestIds, quests],
  );

  const earnedXp = completedQuests.reduce((total, quest) => total + quest.xp, 0);
  const totalXp = user.baseXp + earnedXp;
  const levelProgress = getLevelProgress(totalXp, user.level, user.nextLevelXp);
  const unlockedBadges = badges.filter((badge) => totalXp >= badge.requiredXp);
  const currentRankingUser: RankingEntry = {
    id: "current-user",
    name: displayName,
    role: user.role,
    avatar: selectedAvatar,
    xp: totalXp,
  };

  function isQuestLocked(quest: Quest) {
    return (
      quest.difficulty === "hard" &&
      !completedQuestIds.includes(quest.id) &&
      completedQuestIds.length < 2
    );
  }

  const recommendedQuests = quests
    .filter((quest) => !completedQuestIds.includes(quest.id) && !isQuestLocked(quest))
    .slice(0, 3);

  function completeQuest(questId: string) {
    if (completedQuestIds.includes(questId)) {
      return;
    }

    saveQuestIds([...completedQuestIds, questId]);
  }

  function resetProgress() {
    saveQuestIds([]);
    setSettingsOpen(false);
  }

  function handleDisplayNameSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const nextDisplayName = normalizeDisplayName(
      String(formData.get("displayName") ?? ""),
    );

    if (nextDisplayName.length > 1) {
      saveDisplayName(nextDisplayName);
    }
  }

  return (
    <div className="space-y-7">
      <section
        className="rounded-[2.25rem] bg-gradient-to-br from-[#35D07F] via-[#F5C451] to-[#6F5BFF] p-[1px] shadow-2xl shadow-black/30"
        id="home"
      >
        <div className="relative overflow-hidden rounded-[2.2rem] bg-[#0F1F2B] p-5">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(53,208,127,0.18),transparent_34%),radial-gradient(circle_at_0%_36%,rgba(245,196,81,0.1),transparent_34%),radial-gradient(circle_at_100%_62%,rgba(111,91,255,0.2),transparent_36%)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-6 top-20 h-px bg-gradient-to-r from-transparent via-[#35D07F]/70 to-transparent"
          />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs font-black uppercase tracking-[0.16em] text-[#F5C451]">
                ConnectUS Impact Network
              </p>
              <h1 className="mt-2 font-serif text-4xl font-black leading-9 tracking-normal text-[#F5F7FA]">
                {displayName}
              </h1>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#D8E1E8]">
                Oi, {firstName}. Voce entrou na organizacao futurista que
                transforma tecnologia humana em impacto real.
              </p>
            </div>
            <button
              aria-expanded={settingsOpen}
              aria-label="Abrir configuracoes"
              className="grid size-10 shrink-0 place-items-center rounded-full border border-white/10 bg-[#08121C] font-mono text-[10px] font-black text-[#F5C451] shadow-sm transition hover:border-[#35D07F]"
              onClick={() => setSettingsOpen((current) => !current)}
              type="button"
            >
              <span aria-hidden="true">SET</span>
            </button>
          </div>

          {settingsOpen ? (
            <div
              aria-label="Configuracoes"
              className="relative mt-4 rounded-3xl border border-white/10 bg-[#08121C]/85 p-4 shadow-sm"
              role="dialog"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-serif text-base font-black text-[#F5F7FA]">
                    Configuracoes da base
                  </h2>
                  <p className="mt-1 text-xs font-semibold leading-5 text-[#D8E1E8]">
                    Use apenas para recomeçar a demo no navegador atual.
                  </p>
                </div>
                <button
                  aria-label="Fechar configuracoes"
                  className="rounded-full px-2 text-sm font-black text-[#F5F7FA]"
                  onClick={() => setSettingsOpen(false)}
                  type="button"
                >
                  ×
                </button>
              </div>
              <Button className="mt-3 w-full" onClick={resetProgress} variant="secondary">
                Resetar progresso
              </Button>
            </div>
          ) : null}

          <div className="relative mt-6 flex items-center gap-4">
            <AvatarMark avatarId={selectedAvatar} size="lg" />
            <div className="min-w-0 flex-1">
              <p className="mb-2 truncate text-xs font-black uppercase tracking-[0.12em] text-[#35D07F]">
                {selectedAvatarProfile.name}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-3xl border border-[#6F5BFF]/45 bg-[#141C32]/80 p-3">
                  <p className="text-[11px] font-black uppercase text-[#C9C2FF]">
                    Nível
                  </p>
                  <p className="font-mono text-2xl font-black text-[#F5F7FA]">
                    {levelProgress.currentLevel}
                  </p>
                </div>
                <div className="rounded-3xl border border-[#F5C451]/45 bg-[#2C240F]/80 p-3">
                  <p className="text-[11px] font-black uppercase text-[#FFE6A1]">
                    Impacto
                  </p>
                  <p className="font-mono text-2xl font-black text-[#F5F7FA]">
                    {formatXp(totalXp)}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs font-bold text-[#9FB2BE]">
                {user.handle} · {user.streakDays} dias de sequência · {user.role}
              </p>
            </div>
          </div>

          <div className="relative mt-5">
            <QuestProgress
              label={`Proximo nivel de agencia: ${levelProgress.nextLevel}`}
              tone="light"
              value={levelProgress.progressPercent}
            />
            <p className="mt-2 text-xs font-bold text-[#35D07F]">
              Faltam {formatXp(levelProgress.xpToNextLevel)} de energia para o
              próximo nível.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-[#0F1F2B]/90 p-4 shadow-lg shadow-black/25">
        <div className="mb-4">
          <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-[#F5C451]">
            Continue sua jornada de impacto
          </p>
          <h2 className="mt-1 font-serif text-2xl font-black tracking-normal text-[#F5F7FA]">
            Protocolos recomendados para agora
          </h2>
        </div>
        {recommendedQuests.length > 0 ? (
          <div className="space-y-3">
            {recommendedQuests.map((quest) => (
              <article
                className="flex items-center gap-3 rounded-3xl border border-white/10 bg-[#08121C] p-3 transition duration-200 hover:border-[#35D07F]/45"
                key={quest.id}
              >
                <div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-[#0F1F2B] shadow-inner">
                  <span className="font-mono text-[11px] font-black tracking-[0.12em] text-[#F5C451]">
                    {quest.signal}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-black text-[#F5F7FA]">
                    {quest.title}
                  </h3>
                  <p className="text-xs font-black text-[#F5C451]">
                    +{quest.xp} energia
                  </p>
                </div>
                <Button
                  aria-label={`Fazer recomendada: ${quest.title}`}
                  className="min-h-10 px-3 text-xs"
                  onClick={() => completeQuest(quest.id)}
                >
                  Fazer
                </Button>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-[#35D07F]/45 bg-[#102A26] p-4 text-center">
            <p className="font-mono text-xs font-black tracking-[0.18em] text-[#F5C451]">
              ALL CLEAR
            </p>
            <h3 className="mt-2 font-serif text-base font-black text-[#F5F7FA]">
              Todos os protocolos disponiveis foram ativados
            </h3>
            <p className="mt-1 text-sm font-semibold text-[#D8E1E8]">
              Uma rodada de impacto pronta para demonstrar.
            </p>
          </div>
        )}
      </section>

      <section className="grid grid-cols-3 gap-3">
        <StatCard
          detail="na sessao"
          label="Energia"
          tone="green"
          value={`+${formatXp(earnedXp)}`}
        />
        <StatCard
          detail="concluídas"
          label="Quests"
          tone="gold"
          value={`${completedQuestIds.length}/${quests.length}`}
        />
        <StatCard
          detail="ativas"
          label="Insignias"
          tone="blue"
          value={`${unlockedBadges.length}`}
        />
      </section>

      <section className="scroll-mt-4" id="missoes">
        <div className="mb-4">
          <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-[#F5C451]">
            Quests de Impacto
          </p>
          <h2 className="mt-1 text-center font-serif text-3xl font-black tracking-normal text-[#F5F7FA]">
            Escolha o proximo protocolo social
          </h2>
        </div>
        <div className="grid gap-4">
          {quests.map((quest) => {
            const completed = completedQuestIds.includes(quest.id);

            return (
              <QuestCard
                completed={completed}
                key={quest.id}
                locked={isQuestLocked(quest)}
                onComplete={completeQuest}
                quest={quest}
              />
            );
          })}
        </div>
      </section>

      <section className="scroll-mt-4">
        <div className="mb-4">
          <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-[#F5C451]">
            Insignias
          </p>
          <h2 className="mt-1 text-center font-serif text-3xl font-black tracking-normal text-[#F5F7FA]">
            Reconhecimentos da rede
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {badges.map((badge) => (
            <RewardBadge
              badge={badge}
              key={badge.id}
              unlocked={totalXp >= badge.requiredXp}
            />
          ))}
        </div>
      </section>

      <section className="scroll-mt-4" id="ranking">
        <div className="mb-4">
          <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-[#F5C451]">
            Hall
          </p>
          <h2 className="mt-1 text-center font-serif text-3xl font-black tracking-normal text-[#F5F7FA]">
            Hall dos Agentes
          </h2>
          <p className="mt-2 text-center text-sm font-semibold text-[#D8E1E8]">
            {displayName} entra no hall com a energia real desta sessão.
          </p>
        </div>
        <RankingList entries={rankingEntries} currentUser={currentRankingUser} />
      </section>

      <section className="scroll-mt-4 pb-2" id="perfil">
        <div className="rounded-[2.25rem] bg-gradient-to-br from-[#35D07F] via-[#F5C451] to-[#6F5BFF] p-[1px] shadow-xl shadow-black/25">
          <div className="relative overflow-hidden rounded-[2.2rem] bg-[#0F1F2B] p-5">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(53,208,127,0.15),transparent_32%),radial-gradient(circle_at_90%_28%,rgba(111,91,255,0.18),transparent_34%)]"
            />
            <div className="relative flex items-center gap-4">
              <AvatarMark avatarId={selectedAvatar} size="md" />
              <div className="min-w-0 flex-1">
                <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-[#F5C451]">
                  Identidade do Agente
                </p>
                <h2 className="truncate font-serif text-3xl font-black tracking-normal text-[#F5F7FA]">
                  {displayName}
                </h2>
                <p className="text-sm font-semibold text-[#D8E1E8]">
                  {selectedAvatarProfile.name}
                </p>
              </div>
            </div>

            <form
              className="relative mt-5 rounded-3xl border border-white/10 bg-[#08121C]/80 p-4"
              onSubmit={handleDisplayNameSubmit}
            >
              <label
                className="font-mono text-xs font-black uppercase tracking-[0.14em] text-[#F5C451]"
                htmlFor="displayName"
              >
                Nome de agente
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-[#0F1F2B] px-4 py-3 text-sm font-bold text-[#F5F7FA] outline-none transition placeholder:text-[#60707A] focus:border-[#35D07F] focus:ring-4 focus:ring-[#35D07F]/15"
                  defaultValue={displayName}
                  id="displayName"
                  key={displayName}
                  maxLength={40}
                  name="displayName"
                  placeholder="Seu nome na rede"
                />
                <Button className="px-4" type="submit">
                  Salvar
                </Button>
              </div>
              <p className="mt-2 text-xs font-semibold leading-5 text-[#D8E1E8]">
                Esse nome aparece na base e no Hall dos Agentes.
              </p>
            </form>

            <div className="relative mt-5">
              <p className="mb-3 font-mono text-xs font-black uppercase tracking-[0.14em] text-[#F5C451]">
                Escolha sua especialidade
              </p>
              <AvatarPicker
                onSelect={saveAvatar}
                options={user.avatarOptions}
                selectedAvatar={selectedAvatar}
              />
            </div>

            <div className="relative mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-3xl border border-[#35D07F]/35 bg-[#102A26] p-4">
                <p className="text-xs font-black uppercase text-[#35D07F]">
                  Energia de Impacto
                </p>
                <p className="mt-1 font-mono text-2xl font-black text-[#F5F7FA]">
                  {formatXp(totalXp)}
                </p>
              </div>
              <div className="rounded-3xl border border-[#F5C451]/35 bg-[#2C240F] p-4">
                <p className="text-xs font-black uppercase text-[#F5C451]">
                  Nível atual
                </p>
                <p className="mt-1 font-mono text-2xl font-black text-[#F5F7FA]">
                  {levelProgress.currentLevel}
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-[#08121C] p-4">
                <p className="text-xs font-black uppercase text-[#9FB2BE]">
                  Quests
                </p>
                <p className="mt-1 font-mono text-2xl font-black text-[#F5F7FA]">
                  {completedQuestIds.length}/{quests.length}
                </p>
              </div>
              <div className="rounded-3xl border border-[#6F5BFF]/35 bg-[#211A4D] p-4">
                <p className="text-xs font-black uppercase text-[#C9C2FF]">
                  Insignias
                </p>
                <p className="mt-1 font-mono text-2xl font-black text-[#F5F7FA]">
                  {unlockedBadges.length}/{badges.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
