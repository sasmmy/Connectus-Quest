type StatCardProps = {
  label: string;
  value: string;
  detail: string;
  tone?: "green" | "gold" | "blue";
};

const tones: Record<NonNullable<StatCardProps["tone"]>, string> = {
  green:
    "border-[#35D07F]/22 bg-[linear-gradient(145deg,rgba(53,208,127,0.13),rgba(255,255,255,0.035))]",
  gold:
    "border-[#FBCC5C]/24 bg-[linear-gradient(145deg,rgba(251,204,92,0.14),rgba(255,255,255,0.035))]",
  blue:
    "border-[#22D3EE]/22 bg-[linear-gradient(145deg,rgba(34,211,238,0.13),rgba(255,255,255,0.035))]",
};

export function StatCard({
  label,
  value,
  detail,
  tone = "green",
}: StatCardProps) {
  return (
    <section
      className={`rounded-3xl border p-3.5 shadow-[0_12px_32px_rgba(0,0,0,0.20)] ${tones[tone]}`}
    >
      <p className="text-xs font-bold text-[#B9BCD6]">{label}</p>
      <p className="mt-1 text-2xl font-black tracking-normal text-white">
        {value}
      </p>
      <p className="mt-0.5 text-[11px] font-semibold leading-4 text-[#8F96B3]">
        {detail}
      </p>
    </section>
  );
}
