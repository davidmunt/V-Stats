import { useState } from "react";
import type { League } from "@/interfaces/league.interface";
import { LeaguesList } from "./LeaguesList";
import { LeagueForm } from "./LeagueForm";
import { LeagueDetail } from "./LeagueDetail";

export const LeaguesManager = () => {
  const [view, setView] = useState<"list" | "form" | "detail">("list");
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);

  const handleCreate = () => {
    setSelectedLeague(null);
    setView("form");
  };

  const handleEdit = (league: League) => {
    setSelectedLeague(league);
    setView("form");
  };

  const handleSelectLeague = (league: League) => {
    setSelectedLeague(league);
    setView("detail");
  };

  const handleBackToList = () => {
    setSelectedLeague(null);
    setView("list");
  };

  return (
    <div className="min-h-[600px] transition-all duration-300">
      {view === "list" && <LeaguesList onCreate={handleCreate} onEdit={handleEdit} onViewDetail={handleSelectLeague} />}

      {view === "form" && (
        <div className="bg-white rounded-2xl">
          <LeagueForm initialData={selectedLeague} onCancel={handleBackToList} onSuccess={handleBackToList} />
        </div>
      )}

      {view === "detail" && selectedLeague && (
        <div className="bg-white rounded-2xl p-2">
          <LeagueDetail slug={selectedLeague.slug_league} onBack={handleBackToList} />
        </div>
      )}
    </div>
  );
};
