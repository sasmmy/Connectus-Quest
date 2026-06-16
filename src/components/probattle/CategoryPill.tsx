import type { TournamentCategory } from "@/data/proBattle";

export function CategoryPill({ category }: { category: TournamentCategory }) {
  return (
    <span className="rounded-full border border-[#06B6D4]/35 bg-[#06B6D4]/10 px-3 py-1 text-[11px] font-black text-[#06B6D4]">
      {category}
    </span>
  );
}
