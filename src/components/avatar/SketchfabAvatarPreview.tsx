type SketchfabAvatarPreviewProps = {
  title?: string;
};

export function SketchfabAvatarPreview({
  title = "Preview 3D opcional",
}: SketchfabAvatarPreviewProps) {
  return (
    <aside className="rounded-3xl border border-dashed border-[#35D07F]/50 bg-[#0F1F2B] p-4 text-center text-sm text-[#D8E1E8]">
      <p className="font-bold">{title}</p>
      <p className="mt-1 text-xs leading-5">
        Estrutura reservada para um avatar 3D leve no futuro. O app usa
        avatares simples em CSS para manter a experiência rápida.
      </p>
    </aside>
  );
}
