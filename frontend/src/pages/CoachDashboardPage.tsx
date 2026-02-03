import { useState } from "react";
import { LineupManager } from "@/components/coach/lineups/LineupManager";
import { PlayersManager } from "@/components/coach/players/PlayersManager";
import Sidebar from "@/components/reutilizables/SideBarDashboards";
import { useCurrentUserQuery } from "@/queries/auth/useCurrentUser";
import { useCoachLeagueQuery } from "@/queries/leagues/useCoachLeague";
import { CoachStandings } from "@/components/coach/standings/CoachStandings";
import { CoachMatchesCalendar } from "@/components/coach/calendar/CoachMatchesCalendar";
import { StatsManager } from "@/components/coach/stats/StatsManager";

const CoachDashboardPage = () => {
  const [currentView, setCurrentView] = useState<string>("players");
  const { data: coach } = useCurrentUserQuery();
  const { data: league } = useCoachLeagueQuery(coach?.slug || "");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 p-8 overflow-y-auto">
        {currentView === "players" && <PlayersManager />}
        {currentView === "lineup" && <LineupManager coachSlug={coach?.slug || "slug"} />}
        {currentView === "positionTable" && <CoachStandings leagueSlug={league?.slug || ""} />}
        {currentView === "calendar" && <CoachMatchesCalendar coachSlug={coach?.slug || ""} />}
        {currentView === "stats" && <StatsManager />}
      </main>
    </div>
  );
};

export default CoachDashboardPage;
