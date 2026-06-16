type StatCardProps = {
  label: string;
  value: string;
  detail: string;
  tone?: "green" | "gold" | "blue";
};

const tones: Record<NonNullable<StatCardProps["tone"]>, string> = {
  green:
    "border-[#35D07F]/35 bg-gradient-to-br from-[#0F1F2B] to-[#0B2B24] text-[#F5F7FA] shadow-black/20",
  gold:
    "border-[#F5C451]/35 bg-gradient-to-br from-[#0F1F2B] to-[#30250E] text-[#F5F7FA] shadow-black/20",
  blue:
    "border-[#6F5BFF]/35 bg-gradient-to-br from-[#0F1F2B] to-[#211A4D] text-[#F5F7FA] shadow-black/20",
};

export function StatCard({
  label,
  value,
  detail,
  tone = "green",
}: StatCardProps) {
  return (
    <section className={`rounded-3xl border p-4 shadow-sm ${tones[tone]}`}>
      <p className="text-[11px] font-black uppercase tracking-[0.08em] text-[#9FB2BE]">
        {label}
      </p>
      <p className="mt-2 font-mono text-2xl font-black tracking-normal">
        {value}
      </p>
      <p className="mt-1 text-xs font-semibold opacity-75">{detail}</p>
    </section>
  );
}
