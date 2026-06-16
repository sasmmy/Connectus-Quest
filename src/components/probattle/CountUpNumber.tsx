"use client";

import { useCountUp } from "@/hooks/useCountUp";

type CountUpNumberProps = {
  value: number;
  prefix?: string;
};

export function CountUpNumber({ value, prefix = "" }: CountUpNumberProps) {
  const animatedValue = useCountUp(value);

  return (
    <span>
      {prefix}
      {animatedValue.toLocaleString("en-US")}
    </span>
  );
}
