export type QuestCategory = "learn" | "community" | "impact" | "builder";

export type QuestDifficulty = "easy" | "medium" | "hard";

export type Quest = {
  id: string;
  signal: string;
  title: string;
  subtitle: string;
  description: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  xp: number;
  reward: string;
  cta: string;
};

export type Badge = {
  id: string;
  icon: string;
  title: string;
  description: string;
  requirement: string;
  accent: "green" | "gold" | "blue" | "ink";
  requiredXp: number;
};
