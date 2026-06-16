import type { Badge } from "@/types/quest";

type RewardBadgeProps = {
  badge: Badge;
  unlocked: boolean;
};

const accentClasses: Record<Badge["accent"], string> = {
  green:
    "border-[#35D07F]/45 bg-gradient-to-br from-[#0F1F2B] to-[#102A26] text-[#F5F7FA]",
  gold:
    "border-[#F5C451]/50 bg-gradient-to-br from-[#0F1F2B] to-[#30250E] text-[#F5F7FA]",
  blue:
    "border-white/10 bg-gradient-to-br from-[#0F1F2B] to-[#08121C] text-[#F5F7FA]",
  ink:
    "border-[#6F5BFF]/50 bg-gradient-to-br from-[#0F1F2B] to-[#211A4D] text-[#F5F7FA]",
};

const accentOrbs: Record<Badge["accent"], string> = {
  green: "from-[#35D07F] to-[#F5F7FA]",
  gold: "from-[#F5C451] to-[#F5F7FA]",
  blue: "from-[#F5F7FA] to-[#35D07F]",
  ink: "from-[#6F5BFF] to-[#F5F7FA]",
};

export function RewardBadge({ badge, unlocked }: RewardBadgeProps) {
  return (
    <article
      className={`rounded-3xl border p-4 text-center shadow-sm ${
        unlocked
          ? accentClasses[badge.accent]
          : "border-white/10 bg-[#0F1F2B] text-[#60707A]"
      }`}
    >
      <div
        className={`relative mx-auto grid size-16 place-items-center rounded-full border shadow-inner ${
          unlocked
            ? "border-white/20 bg-white/10"
            : "border-white/10 bg-[#08121C] opacity-55 grayscale"
        }`}
      >
        <span
          aria-hidden="true"
          className={`absolute size-10 rounded-full bg-gradient-to-br ${accentOrbs[badge.accent]} opacity-90`}
        />
        <span
          aria-hidden="true"
          className="absolute size-6 rounded-full border border-[#08121C]/70 bg-[#0F1F2B]"
        />
        <span
          aria-hidden="true"
          className="absolute h-10 w-px rotate-45 bg-white/40"
        />
      </div>
      <p className="mt-3 font-serif text-sm font-black">{badge.title}</p>
      <p className="mt-1 text-xs font-semibold leading-5 text-[#9FB2BE]">
        {badge.description}
      </p>
      <p className="mt-3 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-black opacity-90">
        {unlocked ? "Insignia ativa" : badge.requirement}
      </p>
    </article>
  );
}
