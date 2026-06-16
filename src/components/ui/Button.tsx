import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "border border-[#35D07F]/80 bg-gradient-to-r from-[#35D07F] to-[#6F5BFF] text-[#08121C] shadow-lg shadow-[#35D07F]/20 hover:brightness-110",
  secondary:
    "border border-white/10 bg-[#0F1F2B] text-[#F5F7FA] shadow-sm hover:border-[#F5C451]/70 hover:bg-white/5",
  ghost: "text-[#9FB2BE] hover:bg-white/5 hover:text-[#F5F7FA]",
};

export function Button({
  className = "",
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center rounded-2xl px-4 py-2 text-sm font-black transition duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:translate-y-0 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-[#0F1F2B] disabled:text-[#60707A] disabled:shadow-none ${variants[variant]} ${className}`}
      type={type}
      {...props}
    />
  );
}
