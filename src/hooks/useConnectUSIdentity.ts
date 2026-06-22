"use client";

import { useMemo, useSyncExternalStore } from "react";
import { useLogin, useLogout, usePrivy, useWallets } from "@privy-io/react-auth";

export const onboardingIdentityStorageKey = "connectus_onboarding_identity";
export const onboardingGoalStorageKey = "connectus_onboarding_goal";
export const onboardingChoiceStorageEvent = "connectus-onboarding-choice-change";

const hasPrivyAppId = Boolean(process.env.NEXT_PUBLIC_PRIVY_APP_ID);

const identityLabels: Record<string, string> = {
  connector: "Conectora",
  explorer: "Exploradora",
  learner: "Aprendiz",
};

const goalLabels: Record<string, string> = {
  community: "Ajudar minha comunidade",
  daily: "Criar hábito",
  growth: "Evoluir minha jornada",
};

function subscribeToOnboardingChoices(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener("storage", onStoreChange);
  window.addEventListener(onboardingChoiceStorageEvent, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(onboardingChoiceStorageEvent, onStoreChange);
  };
}

function getOnboardingChoiceSnapshot() {
  if (typeof window === "undefined") {
    return "|";
  }

  return [
    window.localStorage.getItem(onboardingIdentityStorageKey) ?? "",
    window.localStorage.getItem(onboardingGoalStorageKey) ?? "",
  ].join("|");
}

function getServerOnboardingChoiceSnapshot() {
  return "|";
}

function getStoredChoice(key: string) {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(key) ?? "";
}

export function saveOnboardingChoices(identity: string, goal: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(onboardingIdentityStorageKey, identity);
  window.localStorage.setItem(onboardingGoalStorageKey, goal);
  window.dispatchEvent(new Event(onboardingChoiceStorageEvent));
}

function getInitials(displayName: string) {
  const cleanedValue = displayName.trim().replace(/^@/, "");

  if (!cleanedValue) {
    return "V";
  }

  if (cleanedValue.includes("@")) {
    return cleanedValue[0].toUpperCase();
  }

  const words = cleanedValue.split(/\s+|[._-]+/).filter(Boolean);

  if (words.length <= 1) {
    return words[0]?.[0]?.toUpperCase() ?? "V";
  }

  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

function getNameFromEmail(email: string) {
  const [name] = email.split("@");
  const normalized = name.replace(/[._-]+/g, " ").trim();

  return normalized || "Minha jornada";
}

export function useConnectUSIdentity() {
  const onboardingSnapshot = useSyncExternalStore(
    subscribeToOnboardingChoices,
    getOnboardingChoiceSnapshot,
    getServerOnboardingChoiceSnapshot,
  );
  const onboardingIdentity = getStoredChoice(onboardingIdentityStorageKey);
  const onboardingGoal = getStoredChoice(onboardingGoalStorageKey);
  const onboardingIdentityLabel = identityLabels[onboardingIdentity] ?? "";
  const onboardingGoalLabel = goalLabels[onboardingGoal] ?? "";

  if (!hasPrivyAppId) {
    const displayName = onboardingIdentityLabel || "Visitante";

    return {
      displayHandle: onboardingGoalLabel || "Sua jornada",
      displayName,
      initials: getInitials(displayName),
      isAuthenticated: false,
      login: () => undefined,
      logout: () => undefined,
      onboardingGoal,
      onboardingIdentity,
      userAddress: "",
      userEmail: "",
      userPhone: "",
    };
  }

  // NEXT_PUBLIC_PRIVY_APP_ID is stable for the lifetime of the app bundle.
  // This keeps local no-login environments from calling Privy hooks without a provider.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return usePrivyIdentity({
    onboardingGoal,
    onboardingGoalLabel,
    onboardingIdentity,
    onboardingIdentityLabel,
    onboardingSnapshot,
  });
}

function usePrivyIdentity({
  onboardingGoal,
  onboardingGoalLabel,
  onboardingIdentity,
  onboardingIdentityLabel,
  onboardingSnapshot,
}: {
  onboardingGoal: string;
  onboardingGoalLabel: string;
  onboardingIdentity: string;
  onboardingIdentityLabel: string;
  onboardingSnapshot: string;
}) {
  const { authenticated, user } = usePrivy();
  const { login } = useLogin();
  const { logout } = useLogout();
  const { wallets } = useWallets();

  return useMemo(() => {
    void onboardingSnapshot;

    const userEmail = user?.google?.email ?? user?.email?.address ?? "";
    const userPhone = user?.phone?.number ?? "";
    const accountName =
      user?.google?.name?.trim() ||
      (userEmail ? getNameFromEmail(userEmail) : "") ||
      user?.twitter?.name?.trim() ||
      user?.twitter?.username?.trim() ||
      "";
    const displayName = authenticated
      ? accountName || "Minha jornada"
      : onboardingIdentityLabel || "Visitante";
    const displayHandle = authenticated
      ? userEmail || userPhone || "Conta ativa"
      : onboardingGoalLabel || "Sua jornada";
    const userAddress = wallets[0]?.address ?? user?.wallet?.address ?? "";

    return {
      displayHandle,
      displayName,
      initials: getInitials(displayName),
      isAuthenticated: authenticated,
      login,
      logout,
      onboardingGoal,
      onboardingIdentity,
      userAddress,
      userEmail,
      userPhone,
    };
  }, [
    authenticated,
    login,
    logout,
    onboardingGoal,
    onboardingGoalLabel,
    onboardingIdentity,
    onboardingIdentityLabel,
    onboardingSnapshot,
    user,
    wallets,
  ]);
}
