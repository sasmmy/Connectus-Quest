type AvatarProfile = {
  name: string;
  title: string;
  accent: string;
  secondary: string;
  skin: string;
  hair: string;
  suit: string;
  aura: string;
};

type AvatarMarkProps = {
  avatarId: string;
  size?: "sm" | "md" | "lg";
  showTitle?: boolean;
};

export const avatarProfiles: Record<string, AvatarProfile> = {
  "community-navigator": {
    name: "Navegador Comunitário",
    title: "Conecta pessoas e rotas de impacto",
    accent: "#35D07F",
    secondary: "#6F5BFF",
    skin: "#B86F58",
    hair: "#151923",
    suit: "#0F1F2B",
    aura: "rgba(53, 208, 127, 0.32)",
  },
  "green-guardian": {
    name: "Guardiã Verde",
    title: "Protege recursos regenerativos",
    accent: "#35D07F",
    secondary: "#F5C451",
    skin: "#8F5F46",
    hair: "#25341F",
    suit: "#102B25",
    aura: "rgba(53, 208, 127, 0.36)",
  },
  "knowledge-weaver": {
    name: "Tecelã do Conhecimento",
    title: "Transforma saber em ação coletiva",
    accent: "#6F5BFF",
    secondary: "#35D07F",
    skin: "#D8A37E",
    hair: "#2A1A3A",
    suit: "#171733",
    aura: "rgba(111, 91, 255, 0.34)",
  },
  "social-catalyst": {
    name: "Catalisador Social",
    title: "Acelera colaborações locais",
    accent: "#6F5BFF",
    secondary: "#F5C451",
    skin: "#6F4639",
    hair: "#10131A",
    suit: "#27183A",
    aura: "rgba(111, 91, 255, 0.34)",
  },
  "urban-explorer": {
    name: "Exploradora Urbana",
    title: "Mapeia oportunidades na cidade",
    accent: "#F5C451",
    secondary: "#35D07F",
    skin: "#C78966",
    hair: "#35231B",
    suit: "#102736",
    aura: "rgba(245, 196, 81, 0.28)",
  },
  "impact-architect": {
    name: "Arquiteta do Impacto",
    title: "Desenha sistemas para o bem comum",
    accent: "#F5C451",
    secondary: "#6F5BFF",
    skin: "#E0B28F",
    hair: "#202633",
    suit: "#0F1F2B",
    aura: "rgba(245, 196, 81, 0.3)",
  },
};

const sizeClasses = {
  sm: {
    shell: "size-14 rounded-2xl",
    head: "top-3 size-5",
    hair: "top-2.5 h-3 w-6",
    body: "bottom-2 h-5 w-9 rounded-t-2xl",
    neck: "top-[1.9rem] h-3 w-3",
    glow: "size-10",
  },
  md: {
    shell: "size-20 rounded-[1.5rem]",
    head: "top-4 size-8",
    hair: "top-3.5 h-4 w-10",
    body: "bottom-3 h-8 w-14 rounded-t-[1.4rem]",
    neck: "top-[2.8rem] h-4 w-4",
    glow: "size-14",
  },
  lg: {
    shell: "size-28 rounded-[2rem]",
    head: "top-6 size-11",
    hair: "top-5 h-6 w-14",
    body: "bottom-4 h-12 w-20 rounded-t-[1.8rem]",
    neck: "top-[4rem] h-5 w-5",
    glow: "size-20",
  },
};

export function getAvatarProfile(avatarId: string) {
  return avatarProfiles[avatarId] ?? avatarProfiles["community-navigator"];
}

export function AvatarMark({
  avatarId,
  size = "md",
  showTitle = false,
}: AvatarMarkProps) {
  const profile = getAvatarProfile(avatarId);
  const sizes = sizeClasses[size];

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div
        aria-label={profile.name}
        className={`relative shrink-0 overflow-hidden border border-white/10 bg-[#0F1F2B] ${sizes.shell}`}
        style={{
          background: `radial-gradient(circle at 50% 24%, ${profile.aura}, transparent 44%), linear-gradient(145deg, #0F1F2B 0%, #08121C 68%, ${profile.secondary} 140%)`,
          boxShadow: `0 18px 42px ${profile.aura}`,
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-1 rounded-[inherit] border border-white/10"
        />
        <div
          aria-hidden="true"
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl ${sizes.glow}`}
          style={{ backgroundColor: profile.aura }}
        />
        <div
          aria-hidden="true"
          className={`absolute left-1/2 z-20 -translate-x-1/2 rounded-full ${sizes.head}`}
          style={{ backgroundColor: profile.skin }}
        />
        <div
          aria-hidden="true"
          className={`absolute left-1/2 z-30 -translate-x-1/2 rounded-t-full rounded-bl-full ${sizes.hair}`}
          style={{ backgroundColor: profile.hair }}
        />
        <div
          aria-hidden="true"
          className={`absolute left-1/2 z-10 -translate-x-1/2 rounded-b-full ${sizes.neck}`}
          style={{ backgroundColor: profile.skin }}
        />
        <div
          aria-hidden="true"
          className={`absolute left-1/2 z-10 -translate-x-1/2 border border-white/10 ${sizes.body}`}
          style={{
            background: `linear-gradient(135deg, ${profile.suit}, #08121C)`,
          }}
        />
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-1/2 z-30 h-1.5 w-2/3 -translate-x-1/2 rounded-full"
          style={{ backgroundColor: profile.accent }}
        />
        <div
          aria-hidden="true"
          className="absolute -right-4 top-3 h-16 w-8 rotate-12 bg-white/10"
        />
      </div>

      {showTitle ? (
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-[#F5F7FA]">
            {profile.name}
          </p>
          <p className="truncate text-xs font-semibold text-[#9FB2BE]">
            {profile.title}
          </p>
        </div>
      ) : null}
    </div>
  );
}
