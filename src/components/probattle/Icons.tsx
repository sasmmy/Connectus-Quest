type IconProps = {
  name: "home" | "tournament" | "leaderboard" | "profile" | "rewards" | "bell";
  className?: string;
};

const paths: Record<IconProps["name"], string[]> = {
  home: [
    "M3 11.5 12 4l9 7.5",
    "M5.5 10.5V20h13v-9.5",
    "M9 20v-6h6v6",
  ],
  tournament: [
    "M7 4h10v4a5 5 0 0 1-10 0V4Z",
    "M7 6H4v2a4 4 0 0 0 4 4",
    "M17 6h3v2a4 4 0 0 1-4 4",
    "M12 13v4",
    "M8.5 20h7",
  ],
  leaderboard: ["M5 20V10", "M12 20V5", "M19 20v-8", "M3 20h18"],
  profile: [
    "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
    "M4.5 20a7.5 7.5 0 0 1 15 0",
  ],
  rewards: [
    "M4 8h16v12H4V8Z",
    "M12 8v12",
    "M4 12h16",
    "M8 8c-2.4-2.7-.3-5.2 2.2-3.2C11.4 5.8 12 8 12 8",
    "M16 8c2.4-2.7.3-5.2-2.2-3.2C12.6 5.8 12 8 12 8",
  ],
  bell: [
    "M18 16H6l1.2-1.6V10a4.8 4.8 0 0 1 9.6 0v4.4L18 16Z",
    "M10 19a2 2 0 0 0 4 0",
  ],
};

export function Icon({ name, className = "" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      {paths[name].map((path) => (
        <path d={path} key={path} />
      ))}
    </svg>
  );
}
