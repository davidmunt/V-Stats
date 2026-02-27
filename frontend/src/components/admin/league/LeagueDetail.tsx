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
    <div className="flex flex-col min-h-screen">
      <div className="p-8 mb-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white hover:shadow-sm rounded-full transition-all text-slate-400 hover:text-blue-600"
              title="Volver al listado"
            >
              ←
            </button>

            <div className="w-16 h-16 rounded-[1.2rem] bg-white border border-slate-200 p-2 shadow-sm flex items-center justify-center overflow-hidden">
              <img src={league.image} alt={league.name} className="w-full h-full object-contain" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{league.name}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-slate-100 px-8">
        <div className="max-w-7xl mx-auto flex gap-4">
          <button
            onClick={() => setView("teams_list")}
            className={`px-4 py-5 text-[11px] font-black uppercase tracking-widest border-b-2 transition-all ${
              view === "teams_list" || view === "teams_form"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Equipos
          </button>
          <button
            onClick={() => setView("matches")}
            className={`px-4 py-5 text-[11px] font-black uppercase tracking-widest border-b-2 transition-all ${
              view === "matches" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Fechas Partidos
          </button>
          <button
            onClick={() => setView("table")}
            className={`px-4 py-5 text-[11px] font-black uppercase tracking-widest border-b-2 transition-all ${
              view === "table" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Tabla de Posiciones
          </button>
        </div>
      </div>

      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto rounded-[2rem] ">
          <div className="p-4">
            {view === "teams_list" && <TeamsList leagueSlug={slug} onCreate={handleCreateTeam} onEdit={handleEditTeam} />}
            {view === "teams_form" && (
              <TeamForm leagueSlug={slug} initialData={selectedTeam} onCancel={handleBackToTeamsList} onSuccess={handleBackToTeamsList} />
            )}
            {view === "matches" && <LeagueMatchesManager leagueSlug={slug} />}
            {view === "table" && <LeagueTable leagueSlug={slug} />}
          </div>
        </div>
      </div>
    </div>
  );
};
