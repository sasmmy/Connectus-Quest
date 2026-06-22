import type { Quest } from "@/types/quest";
import { Button } from "@/components/ui/Button";
import { SecureImpactRecord } from "@/components/celo/SecureImpactRecord";

type QuestCardProps = {
  quest: Quest;
  completed: boolean;
  locked?: boolean;
  onComplete: (questId: string) => void;
  userLevel: number;
};

const categoryLabels: Record<Quest["category"], string> = {
  learn: "Aprender",
  community: "Comunidade",
  impact: "Impacto",
  builder: "Progresso",
};

export function QuestCard({
  quest,
  completed,
  locked = false,
  onComplete,
  userLevel,
}: QuestCardProps) {
  const disabled = completed || locked;

  return (
    <article
      className={`relative overflow-hidden rounded-[1.75rem] border p-4 shadow-[0_16px_40px_rgba(0,0,0,0.24)] transition duration-200 ${
        completed
          ? "border-[#35D07F]/42 bg-[linear-gradient(145deg,rgba(53,208,127,0.14),rgba(16,21,35,0.94))]"
          : "border-white/10 bg-[linear-gradient(145deg,rgba(21,27,48,0.95),rgba(16,21,35,0.88))] hover:border-[#35D07F]/30"
      }`}
    >
      <div className="pointer-events-none absolute -right-12 -top-12 size-24 rounded-full bg-[#22D3EE]/8 blur-2xl" />
      <div className="flex items-start gap-3">
        <div
          className={`grid size-11 shrink-0 place-items-center rounded-2xl text-lg ${
            completed
              ? "bg-[#35D07F] text-[#06110C] shadow-[0_0_22px_rgba(53,208,127,0.22)]"
              : "border border-white/10 bg-white/[0.07] text-[#BDF7D6]"
          }`}
        >
          {completed ? "✓" : quest.signal}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-[#8F96B3]">
              {categoryLabels[quest.category]}
            </span>
            <span className="shrink-0 rounded-full bg-[#FBCC5C]/12 px-2.5 py-1 text-xs font-extrabold text-[#FFE7A3]">
              +{quest.xp} XP
            </span>
          </div>
          <h3 className="mt-2 text-base font-black leading-6 text-white">
            {quest.title}
          </h3>
          <p className="mt-1 text-sm font-medium leading-5 text-[#B9BCD6]">
            {quest.description}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p
          className={`text-xs font-bold ${
            completed ? "text-[#BDF7D6]" : "text-[#8F96B3]"
          }`}
        >
          {completed ? "Concluída" : "Seu progresso fica salvo."}
        </p>
        <Button
          aria-label={`${quest.cta}: ${quest.title}`}
          className="min-h-9 px-4 text-xs"
          disabled={disabled}
          onClick={() => onComplete(quest.id)}
          variant={completed || locked ? "secondary" : "primary"}
        >
          {completed ? "Concluída" : locked ? "Em breve" : "Concluir"}
        </Button>
      </div>

      {completed ? (
        <div className="mt-4">
          <SecureImpactRecord
            missionTitle={quest.title}
            userLevel={userLevel}
            xpReward={quest.xp}
          />
        </div>
      ) : null}
    </article>
  );
}
