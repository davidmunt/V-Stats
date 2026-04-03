import { useState } from "react";
import { useTypeStatsForTeamQuery } from "@/queries/stats/useTypeStatsForTeam";
import { usePlayersFromTeamQuery } from "@/queries/players/usePlayersFromTeam";
import { useTypeStatsAgainstTeamQuery } from "@/queries/stats/useTypeStatsAgainstTeam";
import { useTypeStatsForPlayerQuery } from "@/queries/stats/useTypeStatsForPlayer";
import { useTypeStatsAgainstPlayerQuery } from "@/queries/stats/useTypeStatsAgainstPlayer";
import { useAuthContext } from "@/hooks/useAuthContext";
import HeatMap from "@/components/coach/stats/HeatMap";
import CourtTrajectories from "@/components/coach/stats/CourtTrajectories";
import { StatsTable } from "@/components/coach/stats/StatsTable";

const YourTeamStats = () => {
  const { user } = useAuthContext();
  const teamSlug = user?.slug_team || "";

  const { data: serveFor, isLoading: loadingServeFor } = useTypeStatsForTeamQuery(teamSlug, "SERVE");
  const { data: attackFor, isLoading: loadingAttackFor } = useTypeStatsForTeamQuery(teamSlug, "ATTACK");
  const { data: blockFor, isLoading: loadingBlockFor } = useTypeStatsForTeamQuery(teamSlug, "BLOCK");

  const { data: serveAgainst, isLoading: loadingServeAgainst } = useTypeStatsAgainstTeamQuery(teamSlug, "SERVE");
  const { data: attackAgainst, isLoading: loadingAttackAgainst } = useTypeStatsAgainstTeamQuery(teamSlug, "ATTACK");
  const { data: receptionAgainst, isLoading: loadingReceptionAgainst } = useTypeStatsAgainstTeamQuery(teamSlug, "RECEPTION");
  const { data: blockAgainst, isLoading: loadingBlockAgainst } = useTypeStatsAgainstTeamQuery(teamSlug, "BLOCK");

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

  const isPlayerLoading =
    lpServeFor || lpAttackFor || lpBlockFor || lpServeAgainst || lpAttackAgainst || lpReceptionAgainst || lpBlockAgainst;

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <section className="space-y-6">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center lg:text-left">
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight italic">Mi Equipo</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Balance Colectivo Completo</p>
          </div>
        </div>

        {isTeamLoading ? (
          <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
            Analizando datos colectivos...
          </div>
        ) : (
          <div className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <CourtTrajectories stats={serveFor || []} title="Saques Equipo - Aciertos" />
              <CourtTrajectories stats={serveAgainst || []} title="Saques Equipo - Errores" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <CourtTrajectories stats={attackFor || []} title="Ataques Equipo - Puntos" />
              <CourtTrajectories stats={attackAgainst || []} title="Ataques Equipo - Errores" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <HeatMap stats={blockFor || []} mode="for" title="Bloqueos Equipo - Puntos" />
              <HeatMap stats={blockAgainst || []} mode="against" title="Bloqueos Equipo - Errores" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <HeatMap stats={receptionAgainst || []} mode="against" title="Recepciones Equipo - Errores" />
            </div>
          </div>
        )}
      </section>

      <section className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="mb-6">
          <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest italic">Porcentajes de Eficacia Global</h4>
          <div className="h-1 w-12 bg-blue-600 rounded-full mt-1"></div>
        </div>
        <StatsTable slug_team={teamSlug} />
      </section>

      <section className="space-y-6">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center lg:text-left">
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight italic">Mis Jugadores</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Rendimiento Específico</p>
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
            Analizando datos del jugador...
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
          </div>
        )}
      </section>
    </div>
  );
};

export default YourTeamStats;
