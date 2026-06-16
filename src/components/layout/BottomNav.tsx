const navItems = [
  { href: "#home", icon: "01", label: "Base" },
  { href: "#missoes", icon: "02", label: "Quests" },
  { href: "#ranking", icon: "03", label: "Hall" },
  { href: "#perfil", icon: "04", label: "Agente" },
];

export function BottomNav() {
  return (
    <nav
      aria-label="Navegacao principal"
      className="relative shrink-0 border-t border-white/10 bg-[#0F1F2B]/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-18px_34px_rgba(0,0,0,0.28)] backdrop-blur"
    >
      <div className="grid grid-cols-4 gap-2">
        {navItems.map((item) => (
          <a
            className="flex flex-col items-center gap-1 rounded-2xl border border-transparent px-2 py-2 text-center text-[11px] font-black text-[#9FB2BE] transition hover:border-[#35D07F]/50 hover:bg-white/5 hover:text-[#F5F7FA]"
            href={item.href}
            key={item.label}
          >
            <span
              aria-hidden="true"
              className="rounded-full border border-white/10 bg-[#08121C] px-2 py-1 font-mono text-[10px] leading-none text-[#F5C451]"
            >
              {item.icon}
            </span>
            <span>{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
