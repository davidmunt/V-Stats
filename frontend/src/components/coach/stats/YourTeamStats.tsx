import { useState } from "react";
import { useTypeStatsForTeamQuery } from "@/queries/stats/useTypeStatsForTeam";
import { useTypeStatsAgainstTeamQuery } from "@/queries/stats/useTypeStatsAgainstTeam";
import { useAuthContext } from "@/hooks/useAuthContext";
import HeatMap from "@/components/coach/stats/HeatMapBueno";

const YourTeamStats = () => {
  const [actionType, setActionType] = useState<string>("SERVE");
  const { user } = useAuthContext();

  const teamSlug = user?.slug_team || "";

  const { data: statsForTeam, isLoading: isForLoading } = useTypeStatsForTeamQuery(teamSlug, actionType);
  const { data: statsAgainstTeam, isLoading: isAgainstLoading } = useTypeStatsAgainstTeamQuery(teamSlug, actionType);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="space-y-1 text-center lg:text-left">
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight italic">Análisis Táctico</h3>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <select
            value={actionType}
            onChange={(e) => setActionType(e.target.value)}
            className="w-full sm:w-48 px-5 py-3.5 bg-blue-50 border border-blue-100 rounded-2xl text-xs font-bold text-blue-600 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer"
          >
            {["SERVE", "RECEPTION", "SET", "ATTACK", "BLOCK"].map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isForLoading || isAgainstLoading ? (
        <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
          Analizando datos del servidor...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <HeatMap stats={statsForTeam || []} mode="for" title={`Puntos Ganados (${actionType})`} />
          <HeatMap stats={statsAgainstTeam || []} mode="against" title={`Puntos Perdidos (${actionType})`} />
        </div>
      )}
    </div>
  );
};

export default YourTeamStats;
