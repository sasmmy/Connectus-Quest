import { clampPercent } from "@/lib/formatters";

type QuestProgressProps = {
  value: number;
  label: string;
  tone?: "light" | "dark";
};

export function QuestProgress({ value, label, tone = "light" }: QuestProgressProps) {
  const safeValue = clampPercent(value);

  return (
    <div>
      <div
        className={`mb-2 flex items-center justify-between text-sm ${
          tone === "dark" ? "text-[#F5F7FA]" : "text-[#F5F7FA]"
        }`}
      >
        <span className="font-black">{label}</span>
        <span className="font-mono font-black">{safeValue}%</span>
      </div>
      <div
        className={`h-5 overflow-hidden rounded-full p-1 shadow-inner ring-1 ${
          tone === "dark"
            ? "bg-[#08121C]/70 ring-white/15"
            : "bg-[#08121C]/70 ring-white/10"
        }`}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#35D07F] via-[#F5C451] to-[#6F5BFF] shadow-[0_0_18px_rgba(53,208,127,0.45)] transition-all duration-500"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}
