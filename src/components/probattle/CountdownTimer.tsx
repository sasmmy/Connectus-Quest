"use client";

import { useCountdown } from "@/hooks/useCountdown";

export function CountdownTimer({ endsAt }: { endsAt: string }) {
  const remaining = useCountdown(endsAt);

  return (
    <span className="rounded-full bg-[#0A0A12]/80 px-3 py-1 font-mono text-xs font-black text-[#F0F0FF] ring-1 ring-white/10">
      {remaining}
    </span>
  );
}
