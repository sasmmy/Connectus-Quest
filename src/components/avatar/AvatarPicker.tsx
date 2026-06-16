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
            className={`min-h-[8.5rem] rounded-3xl border p-3 text-left shadow-sm transition duration-200 active:scale-[0.98] ${
              selected
                ? "border-[#35D07F]/35 bg-[#35D07F]/[0.08]"
                : "border-white/10 bg-[#101523]/88 hover:border-[#35D07F]/24"
            }`}
            key={avatarId}
            onClick={() => onSelect(avatarId)}
            type="button"
          >
            <AvatarMark avatarId={avatarId} label={profile.name} size="sm" />
            <span className="mt-3 block text-xs font-black leading-4 text-[#F7F7FF]">
              {profile.name}
            </span>
            <span className="mt-1 block text-[11px] font-bold leading-4 text-[#A7A8C8]">
              {profile.title}
            </span>
          </button>
        );
      })}
    </div>
  );
}
