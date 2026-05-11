import { useState, useMemo } from "react";
import { useTeamsQuery } from "@/queries/teams/useTeamsForCoach";
import { usePlayersFromTeamQuery } from "@/queries/players/usePlayersFromTeam";
import { useTypeStatsForTeamQuery } from "@/queries/stats/useTypeStatsForTeam";
import { useTypeStatsAgainstTeamQuery } from "@/queries/stats/useTypeStatsAgainstTeam";
import { useTypeStatsForPlayerQuery } from "@/queries/stats/useTypeStatsForPlayer";
import { useTypeStatsAgainstPlayerQuery } from "@/queries/stats/useTypeStatsAgainstPlayer";
import { useChartStatsTeamQuery } from "@/queries/stats/useChartStatsTeam";
import { useChartStatsPlayerQuery } from "@/queries/stats/useChartStatsPlayer";
import HeatMap from "@/components/coach/stats/HeatMap";
import CourtTrajectories from "@/components/coach/stats/CourtTrajectories";
import { StatsTable } from "@/components/coach/stats/StatsTable";
import LoadingFallback from "@/components/LoadingFallback";
import ChartStats from "./ChartStats";

const OtherTeamsStats = () => {
  const { data: teams, isLoading: isTeamsLoading } = useTeamsQuery();
  const [selectedTeam, setSelectedTeam] = useState<{ slug: string; name: string } | null>(null);

  const activeTeam = useMemo(() => {
    if (selectedTeam) return selectedTeam;
    if (teams && teams.length > 0) {
      return { slug: teams[0].slug_team, name: teams[0].name };
    }
    return null;
  }, [selectedTeam, teams]);

  const teamSlug = activeTeam?.slug || "";

  const { data: serveFor, isLoading: loadingServeFor } = useTypeStatsForTeamQuery(teamSlug, "SERVE");
  const { data: attackFor, isLoading: loadingAttackFor } = useTypeStatsForTeamQuery(teamSlug, "ATTACK");
  const { data: blockFor, isLoading: loadingBlockFor } = useTypeStatsForTeamQuery(teamSlug, "BLOCK");

  const { data: serveAgainst, isLoading: loadingServeAgainst } = useTypeStatsAgainstTeamQuery(teamSlug, "SERVE");
  const { data: attackAgainst, isLoading: loadingAttackAgainst } = useTypeStatsAgainstTeamQuery(teamSlug, "ATTACK");
  const { data: receptionAgainst, isLoading: loadingReceptionAgainst } = useTypeStatsAgainstTeamQuery(teamSlug, "RECEPTION");
  const { data: blockAgainst, isLoading: loadingBlockAgainst } = useTypeStatsAgainstTeamQuery(teamSlug, "BLOCK");
  const { data: teamChartStats, isLoading: loadingTeamChartStats } = useChartStatsTeamQuery(teamSlug);

  const isTeamLoading =
    loadingServeFor ||
    loadingAttackFor ||
    loadingBlockFor ||
    loadingServeAgainst ||
    loadingAttackAgainst ||
    loadingReceptionAgainst ||
    loadingBlockAgainst;

  const [selectedPlayerSlug, setSelectedPlayerSlug] = useState<string>("");
  const { data: players } = usePlayersFromTeamQuery(teamSlug);

  const activePlayerSlug = selectedPlayerSlug || (players && players.length > 0 ? players[0].slug_player : "");

  const { data: pServeFor, isLoading: lpServeFor } = useTypeStatsForPlayerQuery(activePlayerSlug, "SERVE");
  const { data: pAttackFor, isLoading: lpAttackFor } = useTypeStatsForPlayerQuery(activePlayerSlug, "ATTACK");
  const { data: pBlockFor, isLoading: lpBlockFor } = useTypeStatsForPlayerQuery(activePlayerSlug, "BLOCK");

  const { data: pServeAgainst, isLoading: lpServeAgainst } = useTypeStatsAgainstPlayerQuery(activePlayerSlug, "SERVE");
  const { data: pAttackAgainst, isLoading: lpAttackAgainst } = useTypeStatsAgainstPlayerQuery(activePlayerSlug, "ATTACK");
  const { data: pReceptionAgainst, isLoading: lpReceptionAgainst } = useTypeStatsAgainstPlayerQuery(activePlayerSlug, "RECEPTION");
  const { data: pBlockAgainst, isLoading: lpBlockAgainst } = useTypeStatsAgainstPlayerQuery(activePlayerSlug, "BLOCK");
  const { data: playerChartStats, isLoading: loadingPlayerChartStats } = useChartStatsPlayerQuery(activePlayerSlug);

  const isPlayerLoading =
    lpServeFor || lpAttackFor || lpBlockFor || lpServeAgainst || lpAttackAgainst || lpReceptionAgainst || lpBlockAgainst;

  if (isTeamsLoading) return <LoadingFallback />;

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <section className="space-y-6">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center lg:text-left">
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight italic">Análisis de Rivales</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Balance Colectivo: {activeTeam?.name}</p>
          </div>

          <div className="w-full lg:w-auto">
            <select
              value={teamSlug}
              onChange={(e) => {
                const team = teams?.find((t) => t.slug_team === e.target.value);
                if (team) {
                  setSelectedTeam({ slug: team.slug_team, name: team.name });
                  setSelectedPlayerSlug("");
                }
              }}
              className="w-full sm:w-64 px-5 py-3.5 bg-blue-600 border border-transparent rounded-2xl text-xs font-bold text-white outline-none focus:ring-4 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer"
            >
              {teams?.map((team) => (
                <option key={team.slug_team} value={team.slug_team} className="text-slate-800 bg-white">
                  {team.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isTeamLoading ? (
          <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
            Analizando datos de {activeTeam?.name}...
          </div>
        ) : (
          <div className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <CourtTrajectories stats={serveFor || []} title="Saques Rival - Aciertos" />
              <CourtTrajectories stats={serveAgainst || []} title="Saques Rival - Errores" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <CourtTrajectories stats={attackFor || []} title="Ataques Rival - Puntos" />
              <CourtTrajectories stats={attackAgainst || []} title="Ataques Rival - Errores" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <HeatMap stats={blockFor || []} mode="for" title="Bloqueos Rival - Puntos" />
              <HeatMap stats={blockAgainst || []} mode="against" title="Bloqueos Rival - Errores" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <HeatMap stats={receptionAgainst || []} mode="against" title="Recepciones Rival - Errores" />
            </div>
          </div>
        )}
      </section>

      <section className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="mb-6">
          <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest italic">Eficacia de {activeTeam?.name}</h4>
          <div className="h-1 w-12 bg-blue-600 rounded-full mt-1"></div>
        </div>
        <StatsTable slug_team={teamSlug} />
      </section>

      <section>
        {loadingTeamChartStats ? (
          <div className="py-16 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
            Construyendo gráfico del rival...
          </div>
        ) : (
          <ChartStats
            stats={teamChartStats}
            title={`Distribución de acciones de ${activeTeam?.name}`}
            subtitle="Porcentaje de ++, +, -, -- por acción"
          />
        )}
      </section>

      <section className="space-y-6">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center lg:text-left">
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight italic">Jugadores del Rival</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Rendimiento Individual</p>
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
          </div>
        </div>

        {isPlayerLoading ? (
          <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
            Analizando datos del jugador rival...
          </div>
        ) : (
          <div className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <CourtTrajectories stats={pServeFor || []} title="Sus Saques - Aciertos" />
              <CourtTrajectories stats={pServeAgainst || []} title="Sus Saques - Errores" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <CourtTrajectories stats={pAttackFor || []} title="Sus Ataques - Puntos" />
              <CourtTrajectories stats={pAttackAgainst || []} title="Sus Ataques - Errores" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <HeatMap stats={pBlockFor || []} mode="for" title="Sus Bloqueos - Puntos" />
              <HeatMap stats={pBlockAgainst || []} mode="against" title="Sus Bloqueos - Errores" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <HeatMap stats={pReceptionAgainst || []} mode="against" title="Sus Recepciones - Errores" />
            </div>

            {loadingPlayerChartStats ? (
              <div className="py-16 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
                Construyendo gráfico del jugador rival...
              </div>
            ) : (
              <ChartStats
                stats={playerChartStats}
                title={`Distribución de acciones de ${players?.find((player) => player.slug_player === activePlayerSlug)?.name || "jugador rival"}`}
                subtitle="Porcentaje de ++, +, -, -- por tipo de acción"
              />
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default OtherTeamsStats;
