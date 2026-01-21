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
    <div className="bg-gray-50 rounded-lg shadow-sm min-h-[500px]">
      {view === "list" && <LeaguesList onCreate={handleCreate} onEdit={handleEdit} onViewDetail={handleSelectLeague} />}

      {view === "form" && <LeagueForm initialData={selectedLeague} onCancel={handleBackToList} onSuccess={handleBackToList} />}

      {view === "detail" && selectedLeague && <LeagueDetail slug={selectedLeague.slug} onBack={handleBackToList} />}
    </div>
  );
};
