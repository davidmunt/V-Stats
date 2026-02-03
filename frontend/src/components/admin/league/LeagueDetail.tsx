import { useState } from "react";
import type { Team } from "@/interfaces/team.interface";
import { useLeagueBySlugQuery } from "@/queries/leagues/useLeagueBySlug";
import LoadingFallback from "@/components/LoadingFallback";

import { TeamsList } from "@/components/admin/team/TeamsList";
import { TeamForm } from "@/components/admin/team/TeamForm";
import { LeagueTable } from "./LeagueTable";
import { LeagueMatchesManager } from "./LeagueMatchesManager";

interface LeagueDetailProps {
  slug: string;
  onBack: () => void;
}

type LeagueView = "teams_list" | "teams_form" | "matches" | "table";

export const LeagueDetail = ({ slug, onBack }: LeagueDetailProps) => {
  const { data: league, isLoading } = useLeagueBySlugQuery(slug);

  const [view, setView] = useState<LeagueView>("teams_list");
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const handleCreateTeam = () => {
    setSelectedTeam(null);
    setView("teams_form");
  };

  const handleEditTeam = (team: Team) => {
    setSelectedTeam(team);
    setView("teams_form");
  };

  const handleBackToTeamsList = () => {
    setSelectedTeam(null);
    setView("teams_list");
  };

  if (isLoading) return <LoadingFallback />;
  if (!league) return <div className="p-10 text-center">No se encontró la liga.</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="bg-white border-b p-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              title="Volver al listado"
            >
              ←
            </button>
            <div className="w-12 h-12 rounded-lg bg-gray-100 border p-1">
              <img src={league.image} alt={league.name} className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{league.name}</h1>
              <p className="text-xs text-gray-500">
                {league.country} - {league.season}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b px-6">
        <div className="max-w-7xl mx-auto flex gap-1">
          <button
            onClick={() => setView("teams_list")}
            className={`px-6 py-4 text-sm font-bold border-b-2 transition-all ${
              view === "teams_list" || view === "teams_form"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Equipos
          </button>
          <button
            onClick={() => setView("matches")}
            className={`px-6 py-4 text-sm font-bold border-b-2 transition-all ${
              view === "matches" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Fechas Partidos
          </button>
          <button
            onClick={() => setView("table")}
            className={`px-6 py-4 text-sm font-bold border-b-2 transition-all ${
              view === "table" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Tabla de Posiciones
          </button>
        </div>
      </div>

      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {view === "teams_list" && <TeamsList leagueSlug={slug} onCreate={handleCreateTeam} onEdit={handleEditTeam} />}
          {view === "teams_form" && (
            <TeamForm leagueSlug={slug} initialData={selectedTeam} onCancel={handleBackToTeamsList} onSuccess={handleBackToTeamsList} />
          )}
          {view === "matches" && <LeagueMatchesManager leagueSlug={slug} />}
          {view === "table" && <LeagueTable leagueSlug={slug} />}
        </div>
      </div>
    </div>
  );
};
