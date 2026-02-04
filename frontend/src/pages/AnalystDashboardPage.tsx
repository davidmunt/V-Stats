import { useState } from "react";
import { MatchAnalysisManager } from "@/components/analyst/matchAnalysis/MatchAnalysisManager";
import Sidebar from "@/components/reutilizables/SideBarDashboards";
import { useCurrentUserQuery } from "@/queries/auth/useCurrentUser";
import LoadingFallback from "@/components/LoadingFallback";

const AnalystDashboardPage = () => {
  const [currentView, setCurrentView] = useState<string>("match");
  const { data: analyst, isLoading } = useCurrentUserQuery();

  if (isLoading) return <LoadingFallback />;
  const hasTeam = !!analyst?.id_team;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      <main className="flex-1 p-8 overflow-y-auto">
        {!hasTeam ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <h2 className="text-2xl font-black text-slate-800 uppercase">Acceso restringido</h2>
            <p className="text-slate-500 max-w-sm">
              Aún no perteneces a ningún equipo. Contacta con tu administrador para que te asigne uno.
            </p>
          </div>
        ) : (
          /* Contenido normal si tiene equipo */
          <>
            {currentView === "match" && <MatchAnalysisManager analystSlug={analyst?.slug || "slug"} />}
            {/* Aquí irán los demás componentes cuando los habilites */}
          </>
        )}
      </main>
    </div>
  );
};

export default AnalystDashboardPage;
