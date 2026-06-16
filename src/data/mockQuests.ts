import type { Badge, Quest } from "@/types/quest";

export const mockQuests: Quest[] = [
  {
    id: "welcome-celo",
    signal: "SEED",
    title: "Ativar primeira celula",
    subtitle: "Energia regenerativa",
    description:
      "Leia a missao ConnectUS e escolha uma frente de impacto para acompanhar.",
    category: "learn",
    difficulty: "easy",
    xp: 80,
    reward: "Sinal de origem",
    cta: "Concluir leitura",
  },
  {
    id: "invite-builder",
    signal: "LINK",
    title: "Conectar um aliado",
    subtitle: "Comunidade local",
    description:
      "Simule o convite de uma pessoa para colaborar em uma iniciativa da rede.",
    category: "community",
    difficulty: "medium",
    xp: 120,
    reward: "Pulso de rede",
    cta: "Registrar convite",
  },
  {
    id: "impact-map",
    signal: "MAP",
    title: "Mapear uma oportunidade",
    subtitle: "Radar de impacto",
    description:
      "Escolha um problema real que poderia virar uma quest de impacto no Mini App.",
    category: "impact",
    difficulty: "medium",
    xp: 140,
    reward: "Coordenada viva",
    cta: "Mapear impacto",
  },
  {
    id: "prototype-loop",
    signal: "LOOP",
    title: "Fechar ciclo de feedback",
    subtitle: "Prototipo em campo",
    description:
      "Marque uma melhoria para o MVP mockado com base no que voce aprendeu hoje.",
    category: "builder",
    difficulty: "hard",
    xp: 180,
    reward: "Iteracao validada",
    cta: "Enviar feedback",
  },
];

export const mockBadges: Badge[] = [
  {
    id: "first-step",
    icon: "OR",
    title: "Origem Ativada",
    description: "Entrou na rede ConnectUS Quest.",
    requirement: "Disponivel no inicio",
    accent: "green",
    requiredXp: 0,
  },
  {
    id: "quest-starter",
    icon: "GV",
    title: "Agente Verde",
    description: "Completou a primeira missao mockada.",
    requirement: "Alcance 260 XP",
    accent: "gold",
    requiredXp: 260,
  },
  {
    id: "community-signal",
    icon: "CS",
    title: "Sinal Comunitario",
    description: "Criou tracao social inicial.",
    requirement: "Alcance 380 XP",
    accent: "blue",
    requiredXp: 380,
  },
  {
    id: "impact-builder",
    icon: "PX",
    title: "Pulso de Impacto",
    description: "Avancou em missoes de impacto e produto.",
    requirement: "Alcance 620 XP",
    accent: "ink",
    requiredXp: 620,
  },
];
