import type { Quest } from "@/types/quest";
import { Button } from "@/components/ui/Button";

type QuestCardProps = {
  quest: Quest;
  completed: boolean;
  locked?: boolean;
  onComplete: (questId: string) => void;
};

const categoryLabels: Record<Quest["category"], string> = {
  learn: "Aprender",
  community: "Comunidade",
  impact: "Impacto",
  builder: "Builder",
};

const difficultyLabels: Record<Quest["difficulty"], string> = {
  easy: "Leve",
  medium: "Campo",
  hard: "Avancada",
};

export function QuestCard({
  quest,
  completed,
  locked = false,
  onComplete,
}: QuestCardProps) {
  const disabled = completed || locked;

  return (
    <article
      className={`relative overflow-hidden rounded-3xl border p-5 shadow-lg transition ${
        completed
          ? "border-[#35D07F]/60 bg-gradient-to-br from-[#0F1F2B] to-[#102A26] shadow-[#35D07F]/10"
          : locked
            ? "border-white/10 bg-[#0F1F2B] text-[#60707A] shadow-black/20"
            : "border-white/10 bg-gradient-to-br from-[#0F1F2B] to-[#08121C] shadow-black/25 hover:border-[#35D07F]/45"
      }`}
    >
      <div className="absolute -right-8 -top-8 size-28 rounded-full bg-[#35D07F]/10 blur-sm" />
      <div className="absolute -bottom-8 -left-8 size-28 rounded-full bg-[#6F5BFF]/12 blur-sm" />
      <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[#F5C451]/60 to-transparent" />
      {completed ? (
        <div className="absolute inset-0 bg-[#35D07F]/[0.03] motion-safe:animate-pulse" />
      ) : null}
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="grid size-16 shrink-0 place-items-center rounded-3xl border border-white/10 bg-[#08121C] shadow-inner">
            <span className="font-mono text-sm font-black tracking-[0.18em] text-[#F5C451]">
              {locked ? "LOCK" : quest.signal}
            </span>
          </div>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-black ${
              completed
                ? "border-[#35D07F] bg-[#35D07F] text-[#08121C]"
                : locked
                  ? "border-white/10 bg-[#08121C] text-[#60707A]"
                  : "border-[#F5C451]/70 bg-[#2C240F] text-[#F5C451]"
            }`}
          >
            {completed ? "Feita" : locked ? "Bloqueada" : `+${quest.xp} XP`}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-black">
          <span className="rounded-full border border-[#35D07F]/35 bg-[#102A26] px-3 py-1 text-[#35D07F]">
            {categoryLabels[quest.category]}
          </span>
          <span className="rounded-full border border-[#6F5BFF]/40 bg-[#211A4D] px-3 py-1 text-[#C9C2FF]">
            {difficultyLabels[quest.difficulty]}
          </span>
        </div>
        <h3 className="mt-4 font-serif text-xl font-black leading-7 text-[#F5F7FA]">
          {quest.title}
        </h3>
        <p className="mt-1 text-sm font-black text-[#35D07F]">
          {quest.subtitle}
        </p>
        <p className="mt-2 text-sm font-semibold leading-6 text-[#D8E1E8]">
          {quest.description}
        </p>
      </div>

      <div className="relative mt-5 flex items-center justify-between gap-3">
        <p className="text-xs font-black uppercase tracking-normal text-[#F5C451]">
          {quest.reward}
        </p>
        <Button
          aria-label={`${quest.cta}: ${quest.title}`}
          disabled={disabled}
          onClick={() => onComplete(quest.id)}
          variant={completed || locked ? "secondary" : "primary"}
        >
          {completed ? "Concluida" : locked ? "Bloqueada" : "Ativar quest"}
        </Button>
      </div>
    </article>
  );
}
