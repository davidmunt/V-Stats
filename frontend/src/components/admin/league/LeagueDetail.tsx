import { useState } from "react";
import type { Team } from "@/interfaces/team.interface";
import { useLeagueBySlugQuery } from "@/queries/leagues/useLeagueBySlug";
import LoadingFallback from "@/components/LoadingFallback";
import { TeamsList } from "../Teams/TeamsList";
import { TeamForm } from "../Teams/TeamForm";

interface LeagueDetailProps {
  slug: string;
  onBack: () => void;
}

export const LeagueDetail = ({ slug, onBack }: LeagueDetailProps) => {
  const { data: league, isLoading } = useLeagueBySlugQuery(slug);
  const [view, setView] = useState<"list" | "form">("list");
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const handleCreateTeam = () => {
    setSelectedTeam(null);
    setView("form");
  };

  const handleEditTeam = (team: Team) => {
    setSelectedTeam(team);
    setView("form");
  };

  const handleBackToTeamsList = () => {
    setSelectedTeam(null);
    setView("list");
  };

  if (isLoading) return <LoadingFallback />;
  if (!league) return <div>No se encontró la liga.</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Cabecera básica */}
      <div className="bg-white border-b p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-gray-500 hover:text-black">
            ← Volver
          </button>
          <h1 className="text-2xl font-bold">{league.name}</h1>
        </div>
      </div>

      {/* Renderizado Condicional de Equipos (Lógica Manager) */}
      <div className="p-6">
        {view === "list" && <TeamsList leagueSlug={slug} onCreate={handleCreateTeam} onEdit={handleEditTeam} />}

        {view === "form" && (
          <TeamForm leagueSlug={slug} initialData={selectedTeam} onCancel={handleBackToTeamsList} onSuccess={handleBackToTeamsList} />
        )}
      </div>
    </div>
  );
};
