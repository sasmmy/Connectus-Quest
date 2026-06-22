import { AvatarMark } from "@/components/avatar/AvatarMark";
import { formatXp } from "@/lib/formatters";
import type { RankingEntry } from "@/types/ranking";

type RankingListProps = {
  entries: RankingEntry[];
  currentUser: RankingEntry;
};

export function RankingList({ entries, currentUser }: RankingListProps) {
  const ranking = [...entries, currentUser].sort(
    (left, right) => right.xp - left.xp,
  );

  return (
    <div className="space-y-3">
      {ranking.map((entry, index) => {
        const isCurrentUser = entry.id === currentUser.id;

        return (
          <article
            className={`flex items-center gap-3 rounded-3xl border p-3.5 shadow-[0_14px_36px_rgba(0,0,0,0.22)] ${
              isCurrentUser
                ? "border-[#35D07F]/44 bg-[linear-gradient(145deg,rgba(53,208,127,0.14),rgba(16,21,35,0.94))]"
                : "border-white/10 bg-[linear-gradient(145deg,rgba(21,27,48,0.92),rgba(16,21,35,0.88))]"
            }`}
            key={entry.id}
          >
            <div
              aria-label={`${index + 1} lugar`}
              className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-black ${
                index === 0
                  ? "bg-[#FBCC5C] text-[#151006] shadow-[0_0_18px_rgba(251,204,92,0.22)]"
                  : "border border-white/10 bg-white/[0.07] text-[#A7A8C8]"
              }`}
            >
              {index + 1}
            </div>
            <AvatarMark avatarId={entry.avatar} label={entry.name} size="sm" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-sm font-extrabold text-white">
                  {entry.name}
                </h3>
                {isCurrentUser ? (
                  <span className="rounded-full bg-[#35D07F]/14 px-2 py-0.5 text-[10px] font-bold text-[#BDF7D6]">
                    Você
                  </span>
                ) : null}
              </div>
              <p className="truncate text-xs font-medium text-[#8F96B3]">
                {entry.role}
              </p>
            </div>
            <p className="shrink-0 text-sm font-extrabold text-[#BDF7D6]">
              {formatXp(entry.xp)} XP
            </p>
          </article>
        );
      })}
    </div>
  );
}
