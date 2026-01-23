import { useState } from "react";
import { MatchesCalendar } from "@/components/admin/match/MatchesCalendar";
import { MatchForm } from "@/components/admin/match/MatchForm";
import type { Match } from "@/interfaces/match.interface";

interface LeagueMatchesManagerProps {
  leagueSlug: string;
}

// Este componente actúa como el "Manager" dentro de la pestaña de Partidos
export const LeagueMatchesManager = ({ leagueSlug }: LeagueMatchesManagerProps) => {
  // Estados para controlar qué vemos dentro de la sección de partidos
  const [view, setView] = useState<"calendar" | "form">("calendar");
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  // Funciones para cambiar de vista
  const handleCreateMatch = () => {
    setSelectedMatch(null);
    setView("form");
  };

  const handleEditMatch = (match: Match) => {
    setSelectedMatch(match);
    setView("form");
  };

  const handleBackToCalendar = () => {
    setSelectedMatch(null);
    setView("calendar");
  };

  return (
    <div className="min-h-[400px]">
      {/* 1. VISTA DE CALENDARIO 
          Aquí se listan los días con sus respectivos partidos.
      */}
      {view === "calendar" && <MatchesCalendar leagueSlug={leagueSlug} onCreate={handleCreateMatch} onEdit={handleEditMatch} />}

      {/* 2. VISTA DE FORMULARIO 
          Sirve tanto para programar uno nuevo como para modificar uno existente.
      */}
      {view === "form" && (
        <MatchForm leagueSlug={leagueSlug} initialData={selectedMatch} onCancel={handleBackToCalendar} onSuccess={handleBackToCalendar} />
      )}
    </div>
  );
};
