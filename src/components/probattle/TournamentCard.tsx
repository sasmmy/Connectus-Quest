import type { Tournament } from "@/data/proBattle";
import { CategoryPill } from "@/components/probattle/CategoryPill";
import { CountdownTimer } from "@/components/probattle/CountdownTimer";
import { PrimaryButton } from "@/components/probattle/PrimaryButton";
import { ProgressBar } from "@/components/probattle/ProgressBar";

type TournamentCardProps = {
  tournament: Tournament;
  featured?: boolean;
};

export function TournamentCard({ tournament, featured = false }: TournamentCardProps) {
  const filledPercent = Math.round(
    ((tournament.totalSlots - tournament.slotsLeft) / tournament.totalSlots) * 100,
  );

  return (
    <article
      className={`group overflow-hidden rounded-[1.75rem] border border-[#1E1E3A] bg-[#12121E] shadow-black/25 transition duration-200 hover:-translate-y-1 hover:border-[#A855F7]/50 hover:shadow-[0_0_24px_rgba(168,85,247,0.22)] ${
        featured ? "min-h-72" : ""
      }`}
    >
      <div
        className={`relative bg-cover bg-center ${featured ? "h-44" : "h-32"}`}
        style={{ backgroundImage: `url(${tournament.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#12121E] via-[#12121E]/35 to-transparent" />
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <CategoryPill category={tournament.category} />
          <span className="rounded-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7] px-3 py-1 text-[11px] font-black text-white">
            {tournament.prize}
          </span>
        </div>
        <div className="absolute bottom-4 right-4">
          <CountdownTimer endsAt={tournament.endsAt} />
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8888AA]">
          {tournament.game}
        </p>
        <h3 className="mt-1 text-xl font-black tracking-wide text-[#F0F0FF]">
          {tournament.title}
        </h3>
        <div className="mt-4">
          <ProgressBar value={filledPercent} label={`${tournament.slotsLeft} slots left`} />
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-sm font-bold text-[#8888AA]">
            {tournament.players}/{tournament.totalSlots} players
          </p>
          <PrimaryButton className="min-h-10 px-4 text-xs">Register</PrimaryButton>
        </div>
      </div>
    </article>
  );
}
