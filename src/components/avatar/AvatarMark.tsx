type AvatarProfile = {
  name: string;
  title: string;
  gradient: string;
};

type AvatarMarkProps = {
  avatarId: string;
  label?: string;
  size?: "sm" | "md" | "lg";
  showTitle?: boolean;
};

export const avatarProfiles: Record<string, AvatarProfile> = {
  "community-navigator": {
    name: "Explorador de Impacto",
    title: "Conecta pessoas e oportunidades",
    gradient: "from-[#35D07F] via-[#22D3EE] to-[#8B5CF6]",
  },
  "green-guardian": {
    name: "Construtor Verde",
    title: "Impulsiona ações regenerativas",
    gradient: "from-[#35D07F] via-[#20E68A] to-[#FBCC5C]",
  },
  "knowledge-weaver": {
    name: "Aprendiz de Impacto",
    title: "Transforma conhecimento em progresso",
    gradient: "from-[#22D3EE] via-[#8B5CF6] to-[#FBCC5C]",
  },
  "social-catalyst": {
    name: "Faísca Social",
    title: "Cria pontes para colaboração",
    gradient: "from-[#FBCC5C] via-[#35D07F] to-[#22D3EE]",
  },
  "urban-explorer": {
    name: "Mapeador Urbano",
    title: "Encontra caminhos de impacto",
    gradient: "from-[#22D3EE] via-[#35D07F] to-[#FBCC5C]",
  },
  "impact-architect": {
    name: "Arquiteto de Impacto",
    title: "Organiza ideias para o bem comum",
    gradient: "from-[#8B5CF6] via-[#22D3EE] to-[#35D07F]",
  },
};

const sizeClasses = {
  sm: {
    shell: "size-10",
    text: "text-sm",
  },
  md: {
    shell: "size-14",
    text: "text-lg",
  },
  lg: {
    shell: "size-24",
    text: "text-3xl",
  },
};

function initialsFrom(value: string) {
  const words = value
    .trim()
    .replace(/^@/, "")
    .split(/\s+|[._-]+/)
    .filter(Boolean);

  if (words.length === 0) {
    return "V";
  }

  if (words.length === 1) {
    return words[0].slice(0, 1).toUpperCase();
  }

  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

export function getAvatarProfile(avatarId: string) {
  return avatarProfiles[avatarId] ?? avatarProfiles["community-navigator"];
}

export function AvatarMark({
  avatarId,
  label,
  size = "md",
  showTitle = false,
}: AvatarMarkProps) {
  const profile = getAvatarProfile(avatarId);
  const sizes = sizeClasses[size];
  const initials = initialsFrom(label ?? profile.name);

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div
        aria-label={label ?? profile.name}
        className={`relative grid shrink-0 place-items-center overflow-hidden rounded-full border border-white/15 bg-gradient-to-br ${profile.gradient} ${sizes.shell} shadow-[0_10px_28px_rgba(0,0,0,0.28),0_0_20px_rgba(53,208,127,0.14)]`}
      >
        <div
          aria-hidden="true"
          className="absolute inset-[3px] rounded-full bg-[#0B1020]/82"
        />
        <div
          aria-hidden="true"
          className="absolute -right-2 -top-2 size-7 rounded-full bg-white/18 blur-sm"
        />
        <span
          className={`relative font-black tracking-normal text-white ${sizes.text}`}
        >
          {initials}
        </span>
      </div>

      {showTitle ? (
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-[#F7F7FF]">
            {label ?? profile.name}
          </p>
          <p className="truncate text-xs font-semibold text-[#A7A8C8]">
            {profile.title}
          </p>
        </div>
      ) : null}
    </div>
  );
}
