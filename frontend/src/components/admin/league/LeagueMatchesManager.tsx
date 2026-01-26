import { useState } from "react";
import { MatchesCalendar } from "@/components/admin/match/MatchesCalendar";
import { MatchForm } from "@/components/admin/match/MatchForm";
import type { Match } from "@/interfaces/match.interface";

interface LeagueMatchesManagerProps {
  leagueSlug: string;
}

export const LeagueMatchesManager = ({ leagueSlug }: LeagueMatchesManagerProps) => {
  const [view, setView] = useState<"calendar" | "form">("calendar");
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

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
      {view === "calendar" && <MatchesCalendar leagueSlug={leagueSlug} onCreate={handleCreateMatch} onEdit={handleEditMatch} />}
      {view === "form" && (
        <MatchForm leagueSlug={leagueSlug} initialData={selectedMatch} onCancel={handleBackToCalendar} onSuccess={handleBackToCalendar} />
      )}
    </div>
  );
};
