import { leaderboard } from "@/data/proBattle";
import { LeaderboardRow } from "@/components/probattle/LeaderboardRow";
import { PlayerAvatar } from "@/components/probattle/PlayerAvatar";

const medalStyles = [
  "bg-[#F5C451] text-[#0A0A12]",
  "bg-slate-300 text-[#0A0A12]",
  "bg-amber-700 text-white",
];

export function LeaderboardScreen() {
  const topThree = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#06B6D4]">
          Global ranking
        </p>
        <h1 className="mt-1 text-3xl font-black tracking-wide text-[#F0F0FF]">
          Leaderboard
        </h1>
      </section>

      <section className="grid grid-cols-3 items-end gap-3">
        {[topThree[1], topThree[0], topThree[2]].map((player, index) => {
          const podiumHeight = index === 1 ? "h-40" : index === 0 ? "h-32" : "h-28";
          const medalIndex = player.rank - 1;

          return (
            <article
              className={`rounded-[1.5rem] border border-[#1E1E3A] bg-[#12121E] p-3 text-center ${podiumHeight}`}
              key={player.id}
            >
              <div
                className={`mx-auto mb-2 grid size-7 place-items-center rounded-full text-xs font-black ${medalStyles[medalIndex]}`}
              >
                {player.rank}
              </div>
              <div className="flex justify-center">
                <PlayerAvatar label={player.avatar} size={index === 1 ? "md" : "sm"} glow />
              </div>
              <h2 className="mt-2 truncate text-xs font-black text-[#F0F0FF]">
                {player.username}
              </h2>
              <p className="text-[11px] font-bold text-[#8888AA]">
                KDA {player.kda}
              </p>
            </article>
          );
        })}
      </section>

      <section className="space-y-3">
        {rest.map((player) => (
          <LeaderboardRow
            highlight={player.username === "NovaStrike"}
            key={player.id}
            player={player}
          />
        ))}
      </section>
    </div>
  );
}
