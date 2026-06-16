type StatCardProps = {
  label: string;
  value: string;
  detail: string;
  tone?: "green" | "gold" | "blue";
};

const tones: Record<NonNullable<StatCardProps["tone"]>, string> = {
  green: "border-[#35D07F]/18 bg-[#35D07F]/[0.07]",
  gold: "border-[#FBCC5C]/20 bg-[#FBCC5C]/[0.08]",
  blue: "border-[#22D3EE]/18 bg-[#22D3EE]/[0.07]",
};

export function StatCard({
  label,
  value,
  detail,
  tone = "green",
}: StatCardProps) {
  return (
    <section
      className={`rounded-2xl border p-3.5 shadow-[0_10px_28px_rgba(0,0,0,0.18)] ${tones[tone]}`}
    >
      <p className="text-xs font-semibold text-[#A7A8C8]">{label}</p>
      <p className="mt-1 text-2xl font-black tracking-normal text-white">
        {value}
      </p>
      <p className="mt-0.5 text-[11px] font-medium leading-4 text-[#8F96B3]">
        {detail}
      </p>
    </section>
  );
}
