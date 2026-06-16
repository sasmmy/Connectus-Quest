"use client";

import { useState } from "react";
import type { TournamentCategory } from "@/data/proBattle";
import { tournaments } from "@/data/proBattle";
import { CategoryPill } from "@/components/probattle/CategoryPill";
import { TournamentCard } from "@/components/probattle/TournamentCard";

const filters: Array<"All" | TournamentCategory> = [
  "All",
  "FPS",
  "MOBA",
  "Battle Royale",
];

export function TournamentScreen() {
  const [activeFilter, setActiveFilter] =
    useState<(typeof filters)[number]>("All");
  const featured = tournaments.find((tournament) => tournament.featured);
  const filtered =
    activeFilter === "All"
      ? tournaments
      : tournaments.filter((tournament) => tournament.category === activeFilter);

  return (
    <div className="space-y-5">
      <section>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#06B6D4]">
          Tournament Hub
        </p>
        <h1 className="mt-1 text-3xl font-black tracking-wide text-[#F0F0FF]">
          Choose your arena
        </h1>
      </section>

      {featured ? (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-black text-[#F0F0FF]">Featured</h2>
            <CategoryPill category={featured.category} />
          </div>
          <TournamentCard featured tournament={featured} />
        </section>
      ) : null}

      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((filter) => {
          const selected = filter === activeFilter;

          return (
            <button
              className={`shrink-0 rounded-full border px-4 py-2 text-xs font-black transition ${
                selected
                  ? "border-[#A855F7] bg-[#A855F7] text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                  : "border-[#1E1E3A] bg-[#12121E] text-[#8888AA]"
              }`}
              key={filter}
              onClick={() => setActiveFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          );
        })}
      </div>

      <section className="space-y-4">
        {filtered.map((tournament) => (
          <TournamentCard key={tournament.id} tournament={tournament} />
        ))}
      </section>
    </div>
  );
}
