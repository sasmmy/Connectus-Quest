import { BottomNav } from "@/components/probattle/BottomNav";
import { TopHeader } from "@/components/probattle/TopHeader";
import { HomeScreen } from "@/screens/HomeScreen";
import { LeaderboardScreen } from "@/screens/LeaderboardScreen";
import { ProfileScreen } from "@/screens/ProfileScreen";
import { RewardsScreen } from "@/screens/RewardsScreen";
import { TournamentScreen } from "@/screens/TournamentScreen";

type Screen = "home" | "tournament" | "leaderboard" | "profile" | "rewards";

const screens = {
  home: HomeScreen,
  tournament: TournamentScreen,
  leaderboard: LeaderboardScreen,
  profile: ProfileScreen,
  rewards: RewardsScreen,
};

export function ProBattleApp({ screen }: { screen: Screen }) {
  const ScreenComponent = screens[screen];

  return (
    <div className="min-h-screen bg-[#0A0A12] text-[#F0F0FF] sm:grid sm:place-items-center sm:p-4">
      <div className="relative mx-auto h-screen w-full max-w-[390px] overflow-hidden bg-[#0A0A12] shadow-2xl shadow-black sm:h-[844px] sm:rounded-[2rem] sm:border sm:border-[#1E1E3A]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-8%,rgba(168,85,247,0.28),transparent_34%),radial-gradient(circle_at_92%_22%,rgba(6,182,212,0.16),transparent_28%),linear-gradient(#0A0A12,#0A0A12)]"
        />
        <TopHeader />
        <main className="relative h-full overflow-y-auto px-4 pb-24 pt-[88px]">
          <div className="animate-slide-in-right">
            <ScreenComponent />
          </div>
        </main>
        <BottomNav active={screen} />
      </div>
    </div>
  );
}
