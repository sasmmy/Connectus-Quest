import type { ButtonHTMLAttributes } from "react";

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function PrimaryButton({
  className = "",
  type = "button",
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#A855F7] px-5 py-2 text-sm font-black text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_0_20px_rgba(168,85,247,0.28)] transition duration-200 hover:-translate-y-1 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_0_28px_rgba(168,85,247,0.5)] active:translate-y-0 ${className}`}
      type={type}
      {...props}
    />
  );
}
