import {
  quickStats,
  recentMatches,
  tournaments,
} from "@/data/proBattle";
import { CountUpNumber } from "@/components/probattle/CountUpNumber";
import { CountdownTimer } from "@/components/probattle/CountdownTimer";
import { MetricCard } from "@/components/probattle/MetricCard";
import { PlayerAvatar } from "@/components/probattle/PlayerAvatar";
import { PrimaryButton } from "@/components/probattle/PrimaryButton";

export function HomeScreen() {
  const activeTournaments = tournaments.slice(0, 3);

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#7C3AED] to-[#A855F7] p-5 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
        <div
          aria-hidden="true"
          className="absolute -right-12 -top-12 size-40 rounded-full bg-white/10 blur-sm"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-16 left-8 size-44 rounded-full bg-[#06B6D4]/20 blur-xl"
        />
        <div className="relative">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-white/70">
            Season 08 live
          </p>
          <h1 className="mt-3 text-3xl font-black leading-9 tracking-wide text-white">
            Compete in Global Tournaments
          </h1>
          <p className="mt-2 max-w-64 text-sm font-semibold leading-6 text-white/76">
            Join elite squads, climb the board, and claim arena rewards.
          </p>
          <PrimaryButton className="mt-5 bg-none bg-white text-[#7C3AED] shadow-none hover:shadow-[0_0_20px_rgba(255,255,255,0.35)]">
            Join Now
          </PrimaryButton>
        </div>
      </section>

      <section className="rounded-[2rem] border border-[#1E1E3A] bg-[#12121E] p-5 text-center shadow-[0_0_20px_rgba(168,85,247,0.16)]">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8888AA]">
          Prize pool
        </p>
        <p className="mt-2 text-4xl font-black text-[#F0F0FF] drop-shadow-[0_0_18px_rgba(168,85,247,0.5)]">
          <CountUpNumber prefix="$" value={50000} />
        </p>
      </section>

      <section className="grid grid-cols-3 gap-3">
        {quickStats.map((stat) => (
          <MetricCard
            key={stat.label}
            label={stat.label}
            trend={stat.trend}
            value={stat.value}
          />
        ))}
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#06B6D4]">
              Active
            </p>
            <h2 className="text-xl font-black tracking-wide text-[#F0F0FF]">
              Tournaments
            </h2>
          </div>
          <p className="text-xs font-bold text-[#8888AA]">Live queues</p>
        </div>
        <div className="space-y-3">
          {activeTournaments.map((tournament) => (
            <article
              className="flex gap-3 overflow-hidden rounded-3xl border border-[#1E1E3A] bg-[#12121E] p-3 transition duration-200 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(168,85,247,0.22)]"
              key={tournament.id}
            >
              <div
                className="h-24 w-24 shrink-0 rounded-2xl bg-cover bg-center"
                style={{ backgroundImage: `url(${tournament.image})` }}
              />
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-black text-[#F0F0FF]">
                  {tournament.title}
                </h3>
                <p className="mt-1 text-xs font-bold text-[#8888AA]">
                  {tournament.players} players
                </p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="rounded-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7] px-3 py-1 text-[11px] font-black text-white">
                    {tournament.prize}
                  </span>
                  <CountdownTimer endsAt={tournament.endsAt} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#06B6D4]">
            Recent
          </p>
          <h2 className="text-xl font-black tracking-wide text-[#F0F0FF]">
            Matches
          </h2>
        </div>
        <div className="space-y-3">
          {recentMatches.map((match) => (
            <article
              className="flex items-center gap-3 rounded-3xl border border-[#1E1E3A] bg-[#12121E] p-3"
              key={match.id}
            >
              <PlayerAvatar label={match.avatar} size="sm" />
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-black text-[#F0F0FF]">
                  vs {match.opponent}
                </h3>
                <p className="text-xs font-bold text-[#8888AA]">{match.score}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-black ${
                  match.result === "WIN"
                    ? "bg-[#06B6D4]/15 text-[#06B6D4]"
                    : "bg-rose-500/15 text-rose-300"
                }`}
              >
                {match.result}
              </span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
