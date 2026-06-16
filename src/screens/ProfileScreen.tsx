import { achievements, recentMatches, userProfile } from "@/data/proBattle";
import { MetricCard } from "@/components/probattle/MetricCard";
import { PlayerAvatar } from "@/components/probattle/PlayerAvatar";

const profileStats = [
  { label: "Matches", value: "412", trend: "+18" },
  { label: "Win Rate", value: "68%", trend: "+4%" },
  { label: "Tourn. Won", value: "9", trend: "+2" },
  { label: "Earnings", value: "$12.4K", trend: "+$900" },
];

export function ProfileScreen() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-[#1E1E3A] bg-[#12121E] p-5 text-center">
        <div className="relative mx-auto grid size-32 place-items-center rounded-full bg-[conic-gradient(#A855F7_0_72%,#1E1E3A_72%_100%)] p-1 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
          <div className="grid size-full place-items-center rounded-full bg-[#12121E]">
            <PlayerAvatar label={userProfile.avatar} size="lg" glow />
          </div>
        </div>
        <h1 className="mt-4 text-3xl font-black tracking-wide text-[#F0F0FF]">
          {userProfile.username}
        </h1>
        <div className="mt-2 flex justify-center gap-2">
          <span className="rounded-full bg-[#A855F7]/18 px-3 py-1 text-xs font-black text-[#A855F7]">
            {userProfile.title}
          </span>
          <span className="rounded-full bg-[#06B6D4]/14 px-3 py-1 text-xs font-black text-[#06B6D4]">
            {userProfile.country}
          </span>
        </div>
        <p className="mt-3 text-sm font-bold text-[#8888AA]">
          Level {userProfile.level} · {userProfile.xpPercent}% XP
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3">
        {profileStats.map((stat) => (
          <MetricCard
            key={stat.label}
            label={stat.label}
            trend={stat.trend}
            value={stat.value}
          />
        ))}
      </section>

      <section>
        <h2 className="mb-3 text-xl font-black tracking-wide text-[#F0F0FF]">
          Achievements
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {achievements.map((achievement, index) => (
            <article
              className="grid min-w-24 place-items-center rounded-3xl border border-[#1E1E3A] bg-[#12121E] p-3 text-center"
              key={achievement}
            >
              <div
                className={`grid size-12 place-items-center rounded-2xl ${
                  index < 4
                    ? "bg-gradient-to-br from-[#7C3AED] to-[#A855F7] shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                    : "bg-[#0A0A12] text-[#8888AA]"
                }`}
              >
                <span className="text-xs font-black">{index + 1}</span>
              </div>
              <p className="mt-2 text-[11px] font-black leading-4 text-[#F0F0FF]">
                {achievement}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-black tracking-wide text-[#F0F0FF]">
          Match History
        </h2>
        <div className="space-y-3">
          {recentMatches.map((match) => (
            <article className="relative pl-6" key={match.id}>
              <span className="absolute left-1 top-2 size-3 rounded-full bg-[#A855F7] shadow-[0_0_20px_rgba(168,85,247,0.4)]" />
              <span className="absolute bottom-[-18px] left-[9px] top-5 w-px bg-[#1E1E3A]" />
              <div className="rounded-3xl border border-[#1E1E3A] bg-[#12121E] p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-black text-[#F0F0FF]">
                    {match.result} vs {match.opponent}
                  </p>
                  <p className="font-mono text-sm font-black text-[#06B6D4]">
                    {match.score}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
