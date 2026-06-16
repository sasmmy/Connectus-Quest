import { AvatarMark, getAvatarProfile } from "@/components/avatar/AvatarMark";

type AvatarPickerProps = {
  options: string[];
  selectedAvatar: string;
  onSelect: (avatar: string) => void;
};

export function AvatarPicker({
  options,
  selectedAvatar,
  onSelect,
}: AvatarPickerProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((avatarId) => {
        const selected = avatarId === selectedAvatar;
        const profile = getAvatarProfile(avatarId);

        return (
          <button
            aria-label={`Escolher avatar ${profile.name}`}
            aria-pressed={selected}
            className={`min-h-36 rounded-3xl border p-3 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 ${
              selected
                ? "border-[#35D07F] bg-[#0F1F2B] shadow-[#35D07F]/20"
                : "border-white/10 bg-[#0B1722] hover:border-[#F5C451]/70 hover:bg-[#0F1F2B]"
            }`}
            key={avatarId}
            onClick={() => onSelect(avatarId)}
            type="button"
          >
            <AvatarMark avatarId={avatarId} size="sm" />
            <span
              className={`mt-3 block text-xs font-black leading-4 ${
                selected ? "text-[#F5F7FA]" : "text-[#D8E1E8]"
              }`}
            >
              {profile.name}
            </span>
            <span
              className={`mt-1 block text-[11px] font-semibold leading-4 ${
                selected ? "text-[#35D07F]" : "text-[#9FB2BE]"
              }`}
            >
              {profile.title}
            </span>
          </button>
        );
      })}
    </div>
  );
}
