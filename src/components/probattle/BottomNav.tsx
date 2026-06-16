import Link from "next/link";
import { Icon } from "@/components/probattle/Icons";

type Screen = "home" | "tournament" | "leaderboard" | "profile" | "rewards";

const items: Array<{
  href: string;
  icon: Parameters<typeof Icon>[0]["name"];
  id: Screen;
  label: string;
}> = [
  { href: "/", icon: "home", id: "home", label: "Home" },
  { href: "/tournaments", icon: "tournament", id: "tournament", label: "Tournament" },
  { href: "/leaderboard", icon: "leaderboard", id: "leaderboard", label: "Leaderboard" },
  { href: "/profile", icon: "profile", id: "profile", label: "Profile" },
  { href: "/rewards", icon: "rewards", id: "rewards", label: "Rewards" },
];

export function BottomNav({ active }: { active: Screen }) {
  return (
    <nav className="absolute inset-x-0 bottom-0 z-30 border-t border-[#1E1E3A] bg-[#0A0A12]/92 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl">
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const selected = item.id === active;

          return (
            <Link
              className={`relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-black transition ${
                selected ? "text-[#F0F0FF]" : "text-[#8888AA]"
              }`}
              href={item.href}
              key={item.id}
            >
              <Icon
                className={`size-5 transition ${
                  selected ? "scale-125 text-[#A855F7]" : ""
                }`}
                name={item.icon}
              />
              <span className="truncate">{item.label}</span>
              {selected ? (
                <span className="absolute bottom-0 size-1.5 rounded-full bg-[#A855F7] shadow-[0_0_20px_rgba(168,85,247,0.4)]" />
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
