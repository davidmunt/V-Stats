import { useState } from "react";
import type { League } from "@/interfaces/league.interface";
import { LeaguesList } from "./LeaguesList";
import { LeagueForm } from "./LeagueForm";

export const LeaguesManager = () => {
  const [view, setView] = useState<"list" | "form">("list");
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);

  const handleCreate = () => {
    setSelectedLeague(null);
    setView("form");
  };

  const handleEdit = (league: League) => {
    setSelectedLeague(league);
    setView("form");
  };

  const handleBackToList = () => {
    setSelectedLeague(null);
    setView("list");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm min-h-[500px]">
      {view === "list" && <LeaguesList onCreate={handleCreate} onEdit={handleEdit} />}
      {view === "form" && <LeagueForm initialData={selectedLeague} onCancel={handleBackToList} onSuccess={handleBackToList} />}
    </div>
  );
};
