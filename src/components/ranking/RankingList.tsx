import { formatXp } from "@/lib/formatters";
import { AvatarMark } from "@/components/avatar/AvatarMark";
import type { RankingEntry } from "@/types/ranking";

type RankingListProps = {
  entries: RankingEntry[];
  currentUser: RankingEntry;
};

export function RankingList({ entries, currentUser }: RankingListProps) {
  const ranking = [...entries, currentUser].sort((left, right) => right.xp - left.xp);

  return (
    <div className="space-y-3">
      {ranking.map((entry, index) => {
        const isCurrentUser = entry.id === currentUser.id;

        return (
          <article
            className={`flex items-center gap-3 rounded-3xl border p-3 shadow-sm ${
              isCurrentUser
                ? "border-[#35D07F]/60 bg-gradient-to-r from-[#102A26] to-[#0F1F2B] shadow-[#35D07F]/10"
                : "border-white/10 bg-[#0F1F2B]/92 shadow-black/20"
            }`}
            key={entry.id}
          >
            <div
              aria-label={`${index + 1} lugar`}
              className={`grid size-9 place-items-center rounded-2xl border text-sm font-black ${
                index === 0
                  ? "border-[#F5C451] bg-[#F5C451] text-[#08121C]"
                  : "border-white/10 bg-[#08121C] text-[#F5F7FA]"
              }`}
            >
              {index + 1}
            </div>
            <AvatarMark avatarId={entry.avatar} size="sm" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate font-serif text-sm font-black text-[#F5F7FA]">
                  {entry.name}
                </h3>
                {isCurrentUser ? (
                  <span className="rounded-full bg-[#35D07F] px-2 py-0.5 text-[10px] font-black uppercase text-[#08121C]">
                    Voce
                  </span>
                ) : null}
              </div>
              <p className="truncate text-xs font-semibold text-[#9FB2BE]">
                {entry.role}
              </p>
            </div>
            <p className="text-sm font-black text-[#F5C451]">
              {formatXp(entry.xp)} XP
            </p>
          </article>
        );
      })}
    </div>
  );
}
