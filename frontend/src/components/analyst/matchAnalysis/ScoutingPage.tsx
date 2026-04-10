import { useState } from "react";
import { LeagueScoutingCalendar } from "./LeagueScoutingCalendar"; // Tu componente de calendario
import { OtherTeamAnalysisManager } from "./OtherTeamAnalysisManager";

export const ScoutingFeature = ({ analystSlug }: { analystSlug: string }) => {
  const [selectedMatchSlug, setSelectedMatchSlug] = useState<string | null>(null);
  const [selectedTeamSlug, setSelectedTeamSlug] = useState<string | null>(null);

  // Función que pasarás al calendario para "capturar" la selección
  const handleSelectMatch = (matchSlug: string, teamSlug: string) => {
    setSelectedMatchSlug(matchSlug);
    setSelectedTeamSlug(teamSlug);
  };

  // Si no hay partido, mostramos el calendario
  if (!selectedMatchSlug) {
    return <LeagueScoutingCalendar onSelectMatch={handleSelectMatch} />;
  }

  // Si hay partido, mostramos el manager que ya tenías
  return (
    <div className="relative">
      {/* Botón para volver al calendario si te equivocas */}
      <button
        onClick={() => setSelectedMatchSlug(null)}
        className="absolute top-4 left-4 z-50 bg-gray-100 px-4 py-2 rounded-lg text-sm font-bold"
      >
        ←
      </button>

      <OtherTeamAnalysisManager matchSlug={selectedMatchSlug} targetTeamSlug={selectedTeamSlug} analystSlug={analystSlug} />
    </div>
  );
};
