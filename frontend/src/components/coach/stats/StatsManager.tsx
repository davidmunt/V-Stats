// import { useState } from "react";
import { TeamStats } from "./TeamStats";

export const StatsManager = () => {
  return (
    <div className="bg-white rounded-3xl shadow-sm min-h-[500px] overflow-hidden">
      <TeamStats />
      {/* {view === "team" && <TeamStats selectedPlayerId={selectedPlayerId} />} */}
    </div>
  );
};
