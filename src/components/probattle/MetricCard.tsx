type MetricCardProps = {
  label: string;
  value: string;
  trend?: string;
};

export function MetricCard({ label, value, trend }: MetricCardProps) {
  return (
    <article className="rounded-3xl border border-[#1E1E3A] bg-[#12121E] p-3 shadow-black/20">
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#8888AA]">
        {label}
      </p>
      <div className="mt-2 flex items-end justify-between gap-2">
        <p className="text-2xl font-black text-[#F0F0FF]">{value}</p>
        {trend ? (
          <span className="rounded-full bg-[#06B6D4]/12 px-2 py-1 text-[10px] font-black text-[#06B6D4]">
            {trend}
          </span>
        ) : null}
      </div>
    </article>
  );
}
