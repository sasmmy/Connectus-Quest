"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { formatXp } from "@/lib/formatters";
import type { Badge, Quest } from "@/types/quest";
import type { RankingEntry } from "@/types/ranking";
import type { MockUser } from "@/types/user";

type QuestStateConfig = {
  badges: Badge[];
  quests: Quest[];
  rankingEntries: RankingEntry[];
  user: MockUser;
};

type ProfileState = {
  avatarId: string;
  handle: string;
  name: string;
};

const storagePrefix = "connectus-quest.";
const completedStorageKey = `${storagePrefix}completed`;
const avatarStorageKey = `${storagePrefix}avatar`;
const displayNameStorageKey = `${storagePrefix}display-name`;
const handleStorageKey = `${storagePrefix}handle`;
const storageEventName = "connectus-quest:storage";

function getStoredString(key: string, fallback: string) {
  if (typeof window === "undefined") {
    return fallback;
  }

  return window.localStorage.getItem(key) || fallback;
}

function getStoredCompletedQuestIds() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const parsedValue = JSON.parse(
      window.localStorage.getItem(completedStorageKey) ?? "[]",
    );

    if (Array.isArray(parsedValue)) {
      return parsedValue.filter(
        (item): item is string => typeof item === "string",
      );
    }
  } catch {
    return [];
  }

  return [];
}

function saveCompletedQuestIds(questIds: string[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(completedStorageKey, JSON.stringify(questIds));
}

function emitStorageChange() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(storageEventName));
}

function subscribeToQuestStorage(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener("storage", onStoreChange);
  window.addEventListener(storageEventName, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(storageEventName, onStoreChange);
  };
}

function getQuestStorageSnapshot() {
  if (typeof window === "undefined") {
    return "server";
  }

  return [
    window.localStorage.getItem(completedStorageKey) ?? "[]",
    window.localStorage.getItem(avatarStorageKey) ?? "",
    window.localStorage.getItem(displayNameStorageKey) ?? "",
    window.localStorage.getItem(handleStorageKey) ?? "",
  ].join("|");
}

function getServerQuestStorageSnapshot() {
  return "server";
}

function getLevelProgress(totalXp: number, baseLevel: number, levelStepXp: number) {
  const safeStep = Math.max(levelStepXp, 1);
  const completedLevelUps = Math.floor(totalXp / safeStep);
  const xpInsideLevel = totalXp % safeStep;
  const currentLevel = baseLevel + completedLevelUps;
  const progressPercent = Math.round((xpInsideLevel / safeStep) * 100);

  return {
    currentLevel,
    nextLevel: currentLevel + 1,
    progressPercent,
    xpInsideLevel,
    xpToNextLevel: safeStep - xpInsideLevel,
  };
}

function normalizeName(value: string, fallback: string) {
  const normalized = value.trim().replace(/\s+/g, " ").slice(0, 40);

  return normalized.length > 1 ? normalized : fallback;
}

function normalizeHandle(value: string, fallback: string) {
  const normalized = value.trim().replace(/\s+/g, "").slice(0, 24);

  if (normalized.length < 2) {
    return fallback;
  }

  return normalized.startsWith("@") ? normalized : `@${normalized}`;
}

export function useConnectUSQuest({
  badges,
  quests,
  rankingEntries,
  user,
}: QuestStateConfig) {
  const storageSnapshot = useSyncExternalStore(
    subscribeToQuestStorage,
    getQuestStorageSnapshot,
    getServerQuestStorageSnapshot,
  );
  const profile = useMemo<ProfileState>(() => {
    void storageSnapshot;

    const storedAvatar = getStoredString(avatarStorageKey, user.avatarId);

    return {
      avatarId: user.avatarOptions.includes(storedAvatar)
        ? storedAvatar
        : user.avatarId,
      handle: normalizeHandle(
        getStoredString(handleStorageKey, user.handle),
        user.handle,
      ),
      name: normalizeName(
        getStoredString(displayNameStorageKey, user.name),
        user.name,
      ),
    };
  }, [storageSnapshot, user]);
  const completedQuestIds = useMemo<string[]>(() => {
    void storageSnapshot;

    const validQuestIds = new Set(quests.map((quest) => quest.id));

    return getStoredCompletedQuestIds().filter((questId) =>
      validQuestIds.has(questId),
    );
  }, [quests, storageSnapshot]);
  const [message, setMessage] = useState("");

  const completedQuests = useMemo(
    () => quests.filter((quest) => completedQuestIds.includes(quest.id)),
    [completedQuestIds, quests],
  );
  const earnedXp = completedQuests.reduce((total, quest) => total + quest.xp, 0);
  const totalXp = user.baseXp + earnedXp;
  const levelProgress = getLevelProgress(totalXp, user.level, user.nextLevelXp);

  function isQuestLocked(quest: Quest) {
    return (
      quest.difficulty === "hard" &&
      !completedQuestIds.includes(quest.id) &&
      completedQuestIds.length < 2
    );
  }

  function isBadgeUnlocked(badge: Badge) {
    if (badge.id === "first-step") {
      return completedQuestIds.length >= 1;
    }

    if (badge.id === "community-signal") {
      return completedQuestIds.length >= 2 || totalXp >= badge.requiredXp;
    }

    if (badge.id === "impact-builder") {
      return totalXp >= badge.requiredXp || levelProgress.currentLevel >= user.level + 1;
    }

    return totalXp >= badge.requiredXp;
  }

  const unlockedBadges = badges.filter(isBadgeUnlocked);
  const recommendedQuests = quests
    .filter((quest) => !completedQuestIds.includes(quest.id) && !isQuestLocked(quest))
    .slice(0, 3);

  const currentRankingUser: RankingEntry = {
    avatar: profile.avatarId,
    id: "current-user",
    name: profile.name,
    role: user.role,
    xp: totalXp,
  };

  const ranking = [...rankingEntries, currentRankingUser].sort(
    (left, right) => right.xp - left.xp,
  );

  function completeQuest(questId: string) {
    const quest = quests.find((item) => item.id === questId);

    if (!quest || completedQuestIds.includes(questId) || isQuestLocked(quest)) {
      return;
    }

    const nextQuestIds = [...completedQuestIds, questId];
    saveCompletedQuestIds(nextQuestIds);
    emitStorageChange();
    setMessage(`Quest concluida: +${formatXp(quest.xp)} XP`);
  }

  function updateProfile(nextProfile: Partial<ProfileState>) {
    const nextState = {
      ...profile,
      ...nextProfile,
    };
    const normalizedProfile = {
      avatarId: user.avatarOptions.includes(nextState.avatarId)
        ? nextState.avatarId
        : user.avatarId,
      handle: normalizeHandle(nextState.handle, user.handle),
      name: normalizeName(nextState.name, user.name),
    };

    window.localStorage.setItem(displayNameStorageKey, normalizedProfile.name);
    window.localStorage.setItem(handleStorageKey, normalizedProfile.handle);
    window.localStorage.setItem(avatarStorageKey, normalizedProfile.avatarId);
    emitStorageChange();
    setMessage("Perfil atualizado");

    return normalizedProfile;
  }

  function resetProgress() {
    Object.keys(window.localStorage)
      .filter((key) => key.startsWith(storagePrefix))
      .forEach((key) => window.localStorage.removeItem(key));

    emitStorageChange();
    setMessage("Progresso ConnectUS resetado");
  }

  return {
    badges,
    completedQuestIds,
    completedQuests,
    completeQuest,
    currentRankingUser,
    earnedXp,
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
    storageReady: storageSnapshot !== "server",
    totalXp,
    unlockedBadges,
    updateProfile,
    user,
  };
}
