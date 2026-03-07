import { useState } from "react";
import { useTeamsQuery } from "@/queries/teams/useTeamsForCoach";
import { usePlayersFromTeamQuery } from "@/queries/players/usePlayersFromTeam";
import { useTypeStatsForTeamQuery } from "@/queries/stats/useTypeStatsForTeam";
import { useTypeStatsAgainstTeamQuery } from "@/queries/stats/useTypeStatsAgainstTeam";
import { useTypeStatsForPlayerQuery } from "@/queries/stats/useTypeStatsForPlayer";
import { useTypeStatsAgainstPlayerQuery } from "@/queries/stats/useTypeStatsAgainstPlayer";
import LoadingFallback from "@/components/LoadingFallback";
import HeatMap from "@/components/coach/stats/HeatMap";

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

  const [selectedPlayerSlug, setSelectedPlayerSlug] = useState<string>("");
  const [playerAction, setPlayerAction] = useState<string>("SERVE");
  const { data: players } = usePlayersFromTeamQuery(activeTeam?.slug || "");
  const activePlayerSlug = selectedPlayerSlug || (players && players.length > 0 ? players[0].slug_player : "");
  const { data: playerStatsFor } = useTypeStatsForPlayerQuery(activePlayerSlug, playerAction);
  const { data: playerStatsAgainst } = useTypeStatsAgainstPlayerQuery(activePlayerSlug, playerAction);

  if (isTeamsLoading) return <LoadingFallback />;

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <section className="space-y-6">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center lg:text-left">
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight italic">Análisis de Equipo</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Rendimiento Colectivo: {activeTeam?.name}</p>
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
                Actualizando mapas de equipo...
              </div>
            ) : (
              <>
                <HeatMap stats={statsForTeam || []} mode="for" title={`Puntos Ganados - Equipo`} />
                <HeatMap stats={statsAgainstTeam || []} mode="against" title={`Puntos Perdidos - Equipo`} />
              </>
            )}
          </div>
        )}
      </section>

      <section className="space-y-6">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center lg:text-left">
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight italic">Análisis por Jugador</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Desempeño Específico</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <select
              value={activePlayerSlug}
              onChange={(e) => setSelectedPlayerSlug(e.target.value)}
              className="w-full sm:w-56 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer"
            >
              {players?.map((player) => (
                <option key={player.slug_player} value={player.slug_player}>
                  #{player.dorsal} - {player.name}
                </option>
              ))}
            </select>

            <select
              value={playerAction}
              onChange={(e) => setPlayerAction(e.target.value)}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <>
            <HeatMap stats={playerStatsFor || []} mode="for" title="Aciertos Individuales" />
            <HeatMap stats={playerStatsAgainst || []} mode="against" title="Errores Individuales" />
          </>
        </div>
      </section>
    </div>
  );
};

export default OtherTeamsStats;
