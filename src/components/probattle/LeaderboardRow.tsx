import type { Player } from "@/data/proBattle";
import { PlayerAvatar } from "@/components/probattle/PlayerAvatar";

export function LeaderboardRow({
  player,
  highlight = false,
}: {
  player: Player;
  highlight?: boolean;
}) {
  const trend = player.trend === "up" ? "↑" : player.trend === "down" ? "↓" : "–";

  return (
    <article
      className={`flex items-center gap-3 rounded-3xl border p-3 ${
        highlight
          ? "animate-rank-flash border-[#A855F7]/60 bg-[#1B1730]"
          : "border-[#1E1E3A] bg-[#12121E]"
      }`}
    >
      <div className="grid size-9 place-items-center rounded-2xl bg-[#0A0A12] text-sm font-black text-[#8888AA] ring-1 ring-[#1E1E3A]">
        {player.rank}
      </div>
      <PlayerAvatar label={player.avatar} size="sm" glow={highlight} />
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-black text-[#F0F0FF]">
          {player.username}
        </h3>
        <p className="text-xs font-bold text-[#8888AA]">KDA {player.kda}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-black text-[#F0F0FF]">
          {player.score.toLocaleString("en-US")}
        </p>
        <p
          className={`text-xs font-black ${
            player.trend === "up"
              ? "text-[#06B6D4]"
              : player.trend === "down"
                ? "text-rose-400"
                : "text-[#8888AA]"
          }`}
        >
          {trend}
        </p>
      </div>
    </article>
  );
}
