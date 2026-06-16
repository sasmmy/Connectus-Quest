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
  builder: "Progresso",
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
      className={`rounded-3xl border p-4 shadow-[0_14px_36px_rgba(0,0,0,0.2)] transition duration-200 ${
        completed
          ? "border-[#35D07F]/35 bg-[#35D07F]/[0.08]"
          : "border-white/10 bg-[#101523]/88 hover:border-[#35D07F]/28"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`grid size-11 shrink-0 place-items-center rounded-2xl text-lg ${
            completed
              ? "bg-[#35D07F] text-[#06110C]"
              : "bg-white/[0.07] text-[#BDF7D6]"
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
          <h3 className="mt-1.5 text-base font-extrabold leading-6 text-white">
            {quest.title}
          </h3>
          <p className="mt-1 text-sm font-medium leading-5 text-[#A7A8C8]">
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
    </article>
  );
}
