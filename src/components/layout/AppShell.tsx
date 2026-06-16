import type { ReactNode } from "react";
import { BottomNav } from "@/components/layout/BottomNav";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#08121C] text-[#F5F7FA] sm:px-6 sm:py-6">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(53,208,127,0.2),transparent_30%),radial-gradient(circle_at_82%_0%,rgba(111,91,255,0.22),transparent_32%),radial-gradient(circle_at_48%_92%,rgba(245,196,81,0.14),transparent_34%),linear-gradient(135deg,#08121C_0%,#0F1F2B_52%,#15122C_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-30 [background-image:linear-gradient(rgba(245,247,250,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(245,247,250,0.05)_1px,transparent_1px)] [background-size:34px_34px]"
      />
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col overflow-hidden bg-[#08121C] shadow-2xl shadow-black/45 ring-1 ring-white/10 sm:h-[min(920px,calc(100vh-48px))] sm:min-h-0 sm:rounded-[2.25rem] sm:border sm:border-white/10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(53,208,127,0.16),transparent_35%),radial-gradient(circle_at_0%_36%,rgba(245,196,81,0.08),transparent_28%),radial-gradient(circle_at_100%_58%,rgba(111,91,255,0.16),transparent_30%)]"
        />
        <main className="relative flex-1 overflow-y-auto px-4 pb-5 pt-4">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
