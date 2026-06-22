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
            className={`flex items-center gap-3 rounded-3xl border p-3.5 shadow-[0_12px_32px_rgba(0,0,0,0.18)] ${
              isCurrentUser
                ? "border-[#35D07F]/42 bg-[#35D07F]/[0.08]"
                : "border-white/10 bg-[#101523]/88"
            }`}
            key={entry.id}
          >
            <div
              aria-label={`${index + 1} lugar`}
              className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-black ${
                index === 0
                  ? "bg-[#FBCC5C] text-[#151006]"
                  : "bg-white/[0.07] text-[#A7A8C8]"
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
