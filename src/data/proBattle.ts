export type TournamentCategory = "FPS" | "MOBA" | "Battle Royale";

export type Tournament = {
  id: string;
  title: string;
  game: string;
  category: TournamentCategory;
  image: string;
  prize: string;
  players: number;
  totalSlots: number;
  slotsLeft: number;
  endsAt: string;
  featured?: boolean;
};

export type Match = {
  id: string;
  result: "WIN" | "LOSS";
  score: string;
  opponent: string;
  avatar: string;
};

export type Player = {
  id: string;
  rank: number;
  username: string;
  avatar: string;
  score: number;
  kda: string;
  trend: "up" | "down" | "same";
};

export type RewardTier = {
  tier: number;
  name: string;
  track: "Free" | "Premium";
  status: "locked" | "current" | "unlocked";
};

export const userProfile = {
  username: "NovaStrike",
  title: "Pro Player",
  country: "BR",
  level: 42,
  xpPercent: 72,
  avatar: "NS",
};

export const quickStats = [
  { label: "Wins", value: "128", trend: "+12%" },
  { label: "Rank", value: "#247", trend: "↑ 18" },
  { label: "K/D", value: "3.8", trend: "+0.4" },
];

export const tournaments: Tournament[] = [
  {
    id: "neon-rift",
    title: "Neon Rift Masters",
    game: "Velocity Arena",
    category: "FPS",
    image: "https://picsum.photos/seed/neon-rift/600/360",
    prize: "$18,000",
    players: 164,
    totalSlots: 256,
    slotsLeft: 92,
    endsAt: new Date(Date.now() + 1000 * 60 * 68).toISOString(),
    featured: true,
  },
  {
    id: "solar-crown",
    title: "Solar Crown Cup",
    game: "Titan Nexus",
    category: "MOBA",
    image: "https://picsum.photos/seed/solar-crown/600/360",
    prize: "$12,500",
    players: 88,
    totalSlots: 128,
    slotsLeft: 40,
    endsAt: new Date(Date.now() + 1000 * 60 * 43).toISOString(),
  },
  {
    id: "last-squad",
    title: "Last Squad Protocol",
    game: "Skyfall Royale",
    category: "Battle Royale",
    image: "https://picsum.photos/seed/last-squad/600/360",
    prize: "$9,000",
    players: 204,
    totalSlots: 240,
    slotsLeft: 36,
    endsAt: new Date(Date.now() + 1000 * 60 * 92).toISOString(),
  },
  {
    id: "ghost-circuit",
    title: "Ghost Circuit Open",
    game: "Vector Ops",
    category: "FPS",
    image: "https://picsum.photos/seed/ghost-circuit/600/360",
    prize: "$6,500",
    players: 71,
    totalSlots: 128,
    slotsLeft: 57,
    endsAt: new Date(Date.now() + 1000 * 60 * 123).toISOString(),
  },
];

export const recentMatches: Match[] = [
  { id: "m1", result: "WIN", score: "13 - 8", opponent: "RiftKai", avatar: "RK" },
  { id: "m2", result: "LOSS", score: "9 - 13", opponent: "EchoVex", avatar: "EV" },
  { id: "m3", result: "WIN", score: "16 - 14", opponent: "PulseMira", avatar: "PM" },
];

export const leaderboard: Player[] = [
  { id: "p1", rank: 1, username: "AstraVex", avatar: "AV", score: 9820, kda: "5.4", trend: "same" },
  { id: "p2", rank: 2, username: "CypherLux", avatar: "CL", score: 9410, kda: "4.9", trend: "up" },
  { id: "p3", rank: 3, username: "MiraByte", avatar: "MB", score: 9174, kda: "4.7", trend: "down" },
  { id: "p4", rank: 4, username: "NovaStrike", avatar: "NS", score: 8840, kda: "3.8", trend: "up" },
  { id: "p5", rank: 5, username: "RiftKai", avatar: "RK", score: 8610, kda: "3.7", trend: "up" },
  { id: "p6", rank: 6, username: "EchoVex", avatar: "EV", score: 8425, kda: "3.5", trend: "down" },
  { id: "p7", rank: 7, username: "PulseMira", avatar: "PM", score: 8190, kda: "3.2", trend: "same" },
];

export const achievements = [
  "Clutch King",
  "Ace Maker",
  "MVP Chain",
  "Arena Elite",
  "No Scope",
  "Night Raid",
];

export const rewardTiers: RewardTier[] = [
  { tier: 1, name: "Cyan Boost", track: "Free", status: "unlocked" },
  { tier: 2, name: "Neon Banner", track: "Premium", status: "unlocked" },
  { tier: 3, name: "XP Surge", track: "Free", status: "current" },
  { tier: 4, name: "Void Gloves", track: "Premium", status: "locked" },
  { tier: 5, name: "Arena Skin", track: "Premium", status: "locked" },
  { tier: 6, name: "Credit Cache", track: "Free", status: "locked" },
  { tier: 7, name: "Crown Emote", track: "Premium", status: "locked" },
];
