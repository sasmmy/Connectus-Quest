"use client";

import { useEffect, useState } from "react";

function formatTime(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((unit) => String(unit).padStart(2, "0"))
    .join(":");
}

export function useCountdown(targetIso: string) {
  const [remaining, setRemaining] = useState(() =>
    formatTime(new Date(targetIso).getTime() - Date.now()),
  );

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setRemaining(formatTime(new Date(targetIso).getTime() - Date.now()));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [targetIso]);

  return remaining;
}
