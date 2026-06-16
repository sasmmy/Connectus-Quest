type ProgressBarProps = {
  value: number;
  label?: string;
};

export function ProgressBar({ value, label }: ProgressBarProps) {
  const safeValue = Math.min(Math.max(value, 0), 100);

  return (
    <div>
      {label ? (
        <div className="mb-2 flex items-center justify-between text-xs font-bold text-[#8888AA]">
          <span>{label}</span>
          <span>{safeValue}%</span>
        </div>
      ) : null}
      <div className="h-3 overflow-hidden rounded-full bg-[#0A0A12] ring-1 ring-[#1E1E3A]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7] shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-500"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}
