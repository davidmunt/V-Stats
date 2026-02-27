import { useState } from "react";
import { LineupManager } from "@/components/coach/lineups/LineupManager";
import { PlayersManager } from "@/components/coach/players/PlayersManager";
import Sidebar from "@/components/reutilizables/SideBarDashboards";
import { useCurrentUserQuery } from "@/queries/auth/useCurrentUser";
import { useCoachLeagueQuery } from "@/queries/leagues/useCoachLeague";
import { CoachStandings } from "@/components/coach/standings/CoachStandings";
import { CoachMatchesCalendar } from "@/components/coach/calendar/CoachMatchesCalendar";
import { StatsManager } from "@/components/coach/stats/StatsManager";
import LoadingFallback from "@/components/LoadingFallback";

const CoachDashboardPage = () => {
  const [currentView, setCurrentView] = useState<string>("players");
  const { data: coach, isLoading: isLoadingCoach } = useCurrentUserQuery();
  const { data: league, isLoading: isLoadingLeague } = useCoachLeagueQuery();

  if (isLoadingCoach || isLoadingLeague) return <LoadingFallback />;
  const hasTeam = !!coach?.slug_team;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      <main className="flex-1 p-8 overflow-y-auto">
        {!hasTeam ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h2 className="text-xl font-black text-slate-800 uppercase">Sin equipo vinculado</h2>
            <p className="text-slate-500 max-w-sm">
              Para gestionar jugadores o ver estadísticas, un administrador debe asignarte un equipo primero.
            </p>
          </div>
        ) : (
          <>
            {currentView === "players" && <PlayersManager />}
            {currentView === "lineup" && <LineupManager coachSlug={coach?.slug_user || "slug"} />}
            {currentView === "positionTable" && <CoachStandings leagueSlug={league?.slug_league || ""} />}
            {currentView === "calendar" && <CoachMatchesCalendar coachSlug={coach?.slug_team || ""} />}
            {currentView === "stats" && <StatsManager />}
          </>
        )}
      </main>
    </div>
  );
};

export default CoachDashboardPage;
