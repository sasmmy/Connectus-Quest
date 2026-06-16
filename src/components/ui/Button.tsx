import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "border border-[#35D07F]/80 bg-[#35D07F] text-[#06110C] shadow-[0_10px_24px_rgba(53,208,127,0.18)] hover:bg-[#4BE093]",
  secondary:
    "border border-white/10 bg-white/[0.06] text-[#F7F7FF] hover:border-[#35D07F]/35 hover:bg-white/[0.09]",
  ghost: "text-[#A7A8C8] hover:bg-white/[0.06] hover:text-[#F7F7FF]",
};

export function Button({
  className = "",
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center rounded-full px-4 py-2 text-sm font-extrabold transition duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.04] disabled:text-[#69708D] disabled:shadow-none ${variants[variant]} ${className}`}
      type={type}
      {...props}
    />
  );
}
