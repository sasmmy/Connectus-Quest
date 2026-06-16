type PlayerAvatarProps = {
  label: string;
  size?: "sm" | "md" | "lg";
  glow?: boolean;
};

const sizes = {
  sm: "size-10 text-xs",
  md: "size-12 text-sm",
  lg: "size-24 text-2xl",
};

export function PlayerAvatar({ label, size = "md", glow = false }: PlayerAvatarProps) {
  return (
    <div
      className={`grid shrink-0 place-items-center rounded-full border border-white/10 bg-gradient-to-br from-[#7C3AED] to-[#06B6D4] font-black text-[#F0F0FF] ${sizes[size]} ${
        glow ? "shadow-[0_0_20px_rgba(168,85,247,0.4)]" : ""
      }`}
    >
      {label}
    </div>
  );
}
