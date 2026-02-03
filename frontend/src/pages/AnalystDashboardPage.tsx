import { useState } from "react";
import { MatchAnalysisManager } from "@/components/analyst/matchAnalysis/MatchAnalysisManager";
import Sidebar from "@/components/reutilizables/SideBarDashboards";
import { useCurrentUserQuery } from "@/queries/auth/useCurrentUser";

const AnalystDashboardPage = () => {
  const [currentView, setCurrentView] = useState<string>("match");
  const { data: analyst } = useCurrentUserQuery();

  return (
    <div className="flex min-h-screen bg-gray-50">
      //aqui:
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 p-8 overflow-y-auto">
        {currentView === "match" && <MatchAnalysisManager analystSlug={analyst?.slug || "slug"} />}
        {/* {currentView === "statistics" && <CategoriesManager />}
        {currentView === "positionTable" && <VenuesManager />} */}
      </main>
    </div>
  );
};

export default AnalystDashboardPage;
