import { useState } from "react";
import type { Player } from "@/interfaces/player.interface";
import { PlayersList } from "./PlayersList";
import { PlayerForm } from "./PlayerForm";

export const PlayersManager = () => {
  const [view, setView] = useState<"list" | "form">("list");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const handleCreate = () => {
    setSelectedPlayer(null);
    setView("form");
  };

  const handleEdit = (player: Player) => {
    setSelectedPlayer(player);
    setView("form");
  };

  const handleBackToList = () => {
    setSelectedPlayer(null);
    setView("list");
  };

  return (
    <div className="min-h-[600px] transition-all duration-300">
      {view === "list" && <PlayersList onCreate={handleCreate} onEdit={handleEdit} />}

      {view === "form" && (
        <div className="bg-white rounded-2xl">
          <PlayerForm initialData={selectedPlayer} onCancel={handleBackToList} onSuccess={handleBackToList} />
        </div>
      )}
    </div>
  );
};
