import { Icon } from "@/components/probattle/Icons";
import { PlayerAvatar } from "@/components/probattle/PlayerAvatar";

export function TopHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-30 border-b border-[#1E1E3A] bg-[#0A0A12]/88 px-4 pb-3 pt-4 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#A855F7] font-black text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            P
          </div>
          <div>
            <p className="text-base font-black tracking-wide text-[#F0F0FF]">
              ProBattle
            </p>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8888AA]">
              Arena live
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-label="Notifications"
            className="grid size-10 place-items-center rounded-2xl border border-[#1E1E3A] bg-[#12121E] text-[#F0F0FF]"
            type="button"
          >
            <Icon className="size-5" name="bell" />
          </button>
          <PlayerAvatar label="NS" size="sm" glow />
        </div>
      </div>
    </header>
  );
}
