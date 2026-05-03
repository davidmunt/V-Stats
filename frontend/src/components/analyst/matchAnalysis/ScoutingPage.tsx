import { useState } from "react";
import { LeagueScoutingCalendar } from "./LeagueScoutingCalendar";
import { OtherTeamAnalysisManager } from "./OtherTeamAnalysisManager";

export const ScoutingFeature = ({ analystSlug }: { analystSlug: string }) => {
  const [selectedMatchSlug, setSelectedMatchSlug] = useState<string | null>(null);
  const [selectedTeamSlug, setSelectedTeamSlug] = useState<string | null>(null);

  const handleSelectMatch = (matchSlug: string, teamSlug: string) => {
    setSelectedMatchSlug(matchSlug);
    setSelectedTeamSlug(teamSlug);
  };

  if (!selectedMatchSlug) {
    return <LeagueScoutingCalendar onSelectMatch={handleSelectMatch} />;
  }

  return (
    <div className="relative">
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
