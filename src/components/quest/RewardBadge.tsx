import type { Badge } from "@/types/quest";

type RewardBadgeProps = {
  badge: Badge;
  unlocked: boolean;
};

export function RewardBadge({ badge, unlocked }: RewardBadgeProps) {
  return (
    <article
      className={`rounded-3xl border p-4 shadow-[0_12px_32px_rgba(0,0,0,0.18)] ${
        unlocked
          ? "border-[#FBCC5C]/28 bg-[#FBCC5C]/[0.08]"
          : "border-white/10 bg-white/[0.04]"
      }`}
    >
      <div
        className={`grid size-11 place-items-center rounded-2xl text-sm font-black ${
          unlocked
            ? "bg-[#FBCC5C] text-[#151006]"
            : "bg-white/[0.06] text-[#69708D]"
        }`}
      >
        {badge.icon}
      </div>
      <p className="mt-3 text-sm font-extrabold text-white">{badge.title}</p>
      <p className="mt-1 text-xs font-medium leading-5 text-[#A7A8C8]">
        {badge.description}
      </p>
      <p className="mt-3 text-xs font-bold text-[#FFE7A3]">
        {unlocked ? "Desbloqueada" : badge.requirement}
      </p>
    </article>
  );
}
