export type BottomNavItem = {
  href?: string;
  icon: "home" | "quests" | "ranking" | "profile";
  id: string;
  label: string;
};

type BottomNavProps = {
  activeId?: string;
  items?: BottomNavItem[];
  onSelect?: (id: string) => void;
};

const defaultNavItems: BottomNavItem[] = [
  { href: "/", icon: "home", id: "home", label: "Início" },
  { href: "/quests", icon: "quests", id: "quests", label: "Missões" },
  { href: "/leaderboard", icon: "ranking", id: "ranking", label: "Comunidade" },
  { href: "/profile", icon: "profile", id: "profile", label: "Perfil" },
];

export function BottomNav({
  activeId = "home",
  items = defaultNavItems,
  onSelect,
}: BottomNavProps) {
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 px-4 pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-2"
    >
      <div className="grid grid-cols-4 gap-1.5 rounded-[1.4rem] border border-white/10 bg-[#0B1020]/92 p-1.5 shadow-[0_-10px_30px_rgba(0,0,0,0.34)] backdrop-blur-xl">
        {items.map((item) => {
          const active = item.id === activeId;
          const className = `flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-[1.05rem] px-1 text-center text-[11px] font-semibold transition duration-200 ${
            active
              ? "bg-[#35D07F]/14 text-white"
              : "text-[#8F96B3] hover:bg-white/[0.05] hover:text-white"
          }`;

          const content = (
            <>
              <NavIcon active={active} name={item.icon} />
              <span className="max-w-full truncate">{item.label}</span>
            </>
          );

          if (onSelect) {
            return (
              <button
                aria-current={active ? "page" : undefined}
                className={className}
                key={item.id}
                onClick={() => onSelect(item.id)}
                type="button"
              >
                {content}
              </button>
            );
          }

          return (
            <a
              aria-current={active ? "page" : undefined}
              className={className}
              href={item.href}
              key={item.id}
            >
              {content}
            </a>
          );
        })}
      </div>
    </nav>
  );
}

function NavIcon({
  active,
  name,
}: {
  active: boolean;
  name: BottomNavItem["icon"];
}) {
  const stroke = active ? "#35D07F" : "#8F96B3";

  return (
    <svg
      aria-hidden="true"
      className="size-[1.15rem]"
      fill="none"
      viewBox="0 0 24 24"
    >
      {name === "home" ? (
        <path
          d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-8.5Z"
          stroke={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      ) : null}
      {name === "quests" ? (
        <path
          d="M6 7h10M6 12h12M6 17h7M18 6l1 1 2-2"
          stroke={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      ) : null}
      {name === "ranking" ? (
        <path
          d="M5 20v-6h4v6M10 20V8h4v12M15 20v-9h4v9"
          stroke={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      ) : null}
      {name === "profile" ? (
        <path
          d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM5 20a7 7 0 0 1 14 0"
          stroke={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      ) : null}
    </svg>
  );
}
