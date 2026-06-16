import { rewardTiers } from "@/data/proBattle";
import { PrimaryButton } from "@/components/probattle/PrimaryButton";

export function RewardsScreen() {
  const currentTier = rewardTiers.find((tier) => tier.status === "current");

  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#06B6D4]">
          Battle Pass
        </p>
        <h1 className="mt-1 text-3xl font-black tracking-wide text-[#F0F0FF]">
          Rewards Track
        </h1>
      </section>

      <section className="relative overflow-hidden rounded-[2rem] border border-[#1E1E3A] bg-[#12121E] p-5">
        <div className="animate-shimmer absolute inset-y-0 left-0 w-20 bg-white/10 blur-md" />
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8888AA]">
          Current tier
        </p>
        <h2 className="mt-2 text-3xl font-black text-[#F0F0FF]">
          {currentTier?.name}
        </h2>
        <div className="mt-5 grid h-36 place-items-center rounded-[1.5rem] border border-[#A855F7]/35 bg-gradient-to-br from-[#7C3AED]/35 to-[#06B6D4]/20 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
          <div className="grid size-20 place-items-center rounded-3xl bg-[#0A0A12]/70 text-2xl font-black text-[#F0F0FF] ring-1 ring-white/10">
            T{currentTier?.tier}
          </div>
        </div>
        <PrimaryButton className="mt-5 w-full">Claim Reward</PrimaryButton>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-black tracking-wide text-[#F0F0FF]">
            Progress Track
          </h2>
          <span className="text-xs font-black text-[#8888AA]">Free / Premium</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-3">
          {rewardTiers.map((tier) => (
            <article
              className={`min-w-28 rounded-3xl border p-3 text-center ${
                tier.status === "current"
                  ? "border-[#A855F7] bg-[#1B1730] shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                  : tier.status === "unlocked"
                    ? "border-[#06B6D4]/45 bg-[#06B6D4]/10"
                    : "border-[#1E1E3A] bg-[#12121E] opacity-65"
              }`}
              key={tier.tier}
            >
              <div
                className={`mx-auto grid size-12 place-items-center rounded-full text-sm font-black ${
                  tier.status === "locked"
                    ? "bg-[#0A0A12] text-[#8888AA]"
                    : "bg-gradient-to-br from-[#7C3AED] to-[#A855F7] text-white"
                }`}
              >
                {tier.status === "locked" ? "L" : tier.tier}
              </div>
              <p className="mt-3 text-xs font-black text-[#F0F0FF]">
                {tier.name}
              </p>
              <p
                className={`mt-1 text-[11px] font-black ${
                  tier.track === "Premium" ? "text-[#A855F7]" : "text-[#06B6D4]"
                }`}
              >
                {tier.track}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <article className="rounded-3xl border border-[#1E1E3A] bg-[#12121E] p-4">
          <p className="text-xs font-black uppercase text-[#06B6D4]">Free</p>
          <p className="mt-2 text-sm font-bold text-[#8888AA]">
            Unlock boosters, credits, and banner frames.
          </p>
        </article>
        <article className="rounded-3xl border border-[#A855F7]/45 bg-[#1B1730] p-4">
          <p className="text-xs font-black uppercase text-[#A855F7]">Premium</p>
          <p className="mt-2 text-sm font-bold text-[#8888AA]">
            Exclusive skins, glow trails, and elite cosmetics.
          </p>
        </article>
      </section>
    </div>
  );
}
