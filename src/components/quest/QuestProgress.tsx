import { clampPercent } from "@/lib/formatters";

type QuestProgressProps = {
  value: number;
  label?: string;
};

export function QuestProgress({ value, label }: QuestProgressProps) {
  const safeValue = clampPercent(value);

  return (
    <div>
      {label ? (
        <div className="mb-2 flex items-center justify-between gap-3 text-xs">
          <span className="font-medium text-[#A7A8C8]">{label}</span>
          <span className="font-bold text-[#BDF7D6]">{safeValue}%</span>
        </div>
      ) : null}
      <div className="h-3.5 overflow-hidden rounded-full border border-white/[0.05] bg-black/25 shadow-inner shadow-black/25">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#35D07F] via-[#22D3EE] to-[#FBCC5C] shadow-[0_0_18px_rgba(53,208,127,0.26)] transition-all duration-500"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}
