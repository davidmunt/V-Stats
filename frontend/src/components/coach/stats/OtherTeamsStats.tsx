import { useState } from "react";
import { useTeamsQuery } from "@/queries/teams/useTeamsForCoach";
import { useTypeStatsForTeamQuery } from "@/queries/stats/useTypeStatsForTeam";
import { useTypeStatsAgainstTeamQuery } from "@/queries/stats/useTypeStatsAgainstTeam";
import LoadingFallback from "@/components/LoadingFallback";
import HeatMap from "@/components/coach/stats/HeatMapBueno";

const OtherTeamsStats = () => {
  const { data: teams, isLoading: isTeamsLoading } = useTeamsQuery();
  const [actionType, setActionType] = useState<string>("SERVE");
  const [selectedTeam, setSelectedTeam] = useState<{ slug: string; name: string } | null>(null);

  const activeTeam =
    selectedTeam ||
    (teams && teams.length > 0
      ? {
          slug: teams[0].slug_team,
          name: teams[0].name,
        }
      : null);

  const { data: statsForTeam, isLoading: isForLoading } = useTypeStatsForTeamQuery(activeTeam?.slug || "", actionType);
  const { data: statsAgainstTeam, isLoading: isAgainstLoading } = useTypeStatsAgainstTeamQuery(activeTeam?.slug || "", actionType);

  if (isTeamsLoading) return <LoadingFallback />;
  console.log("StatsManager - Teams:", statsForTeam, statsAgainstTeam);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="space-y-1 text-center lg:text-left">
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight italic">Análisis Táctico</h3>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <select
            value={activeTeam?.slug || ""}
            onChange={(e) => {
              const team = teams?.find((t) => t.slug_team === e.target.value);
              if (team) setSelectedTeam({ slug: team.slug_team, name: team.name });
            }}
            className="w-full sm:w-56 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer"
          >
            {teams?.map((team) => (
              <option key={team.slug_team} value={team.slug_team}>
                {team.name}
              </option>
            ))}
          </select>

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

      {activeTeam && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {isForLoading || isAgainstLoading ? (
            <div className="lg:col-span-2 py-20 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">
              Actualizando mapas...
            </div>
          ) : (
            <>
              <HeatMap stats={statsForTeam || []} mode="for" title={`Puntos Ganados - ${activeTeam.name}`} />
              <HeatMap stats={statsAgainstTeam || []} mode="against" title={`Puntos Perdidos - ${activeTeam.name}`} />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default OtherTeamsStats;
