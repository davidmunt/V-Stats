import { useState } from "react";
import { useTypeStatsForTeamMatchQuery } from "@/queries/stats/useTypeStatsForTeamMatch";
import { useTypeStatsAgainstTeamMatchQuery } from "@/queries/stats/useTypeStatsAgainstTeamMatch";
// Importar las queries de jugador por partido (asumiendo que las has creado)
import { useTypeStatsForPlayerMatchQuery } from "@/queries/stats/useTypeStatsForPlayerMatch";
import { useTypeStatsAgainstPlayerMatchQuery } from "@/queries/stats/useTypeStatsAgainstPlayerMatch";
import { usePlayersFromTeamQuery } from "@/queries/players/usePlayersFromTeam";
import HeatMap from "@/components/coach/stats/HeatMap";
import CourtTrajectories from "@/components/coach/stats/CourtTrajectories";

interface PostMatchStatsProps {
  teamSlug: string;
  matchSlug: string;
  score: { local: number; visitor: number };
}

export const PostMatchStats = ({ teamSlug, matchSlug, score }: PostMatchStatsProps) => {
  const { data: players } = usePlayersFromTeamQuery(teamSlug);
  const [selectedPlayerSlug, setSelectedPlayerSlug] = useState<string>("");

  // Jugador activo para las estadísticas individuales
  const activePlayerSlug = selectedPlayerSlug || (players && players.length > 0 ? players[0].slug_player : "");

  // 1. QUERIES DEL EQUIPO (Para el partido)
  const { data: serveFor, isLoading: l1 } = useTypeStatsForTeamMatchQuery(teamSlug, "SERVE", matchSlug);
  const { data: attackFor, isLoading: l2 } = useTypeStatsForTeamMatchQuery(teamSlug, "ATTACK", matchSlug);
  const { data: blockFor, isLoading: l3 } = useTypeStatsForTeamMatchQuery(teamSlug, "BLOCK", matchSlug);

  const { data: serveAgainst, isLoading: l4 } = useTypeStatsAgainstTeamMatchQuery(teamSlug, "SERVE", matchSlug);
  const { data: attackAgainst, isLoading: l5 } = useTypeStatsAgainstTeamMatchQuery(teamSlug, "ATTACK", matchSlug);
  const { data: receptionAgainst, isLoading: l6 } = useTypeStatsAgainstTeamMatchQuery(teamSlug, "RECEPTION", matchSlug);

  // 2. QUERIES DEL JUGADOR SELECCIONADO (Para el partido)
  const { data: pServeFor, isLoading: lp1 } = useTypeStatsForPlayerMatchQuery(activePlayerSlug, "SERVE", matchSlug);
  const { data: pAttackFor, isLoading: lp2 } = useTypeStatsForPlayerMatchQuery(activePlayerSlug, "ATTACK", matchSlug);
  const { data: pServeAgainst, isLoading: lp3 } = useTypeStatsAgainstPlayerMatchQuery(activePlayerSlug, "SERVE", matchSlug);
  const { data: pAttackAgainst, isLoading: lp4 } = useTypeStatsAgainstPlayerMatchQuery(activePlayerSlug, "ATTACK", matchSlug);

  const isTeamLoading = l1 || l2 || l3 || l4 || l5 || l6;
  const isPlayerLoading = lp1 || lp2 || lp3 || lp4;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 overflow-y-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
      {/* HEADER DE MARCADOR FINAL */}
      <div className="bg-slate-900 text-white p-8 sticky top-0 z-10 shadow-2xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-blue-400">Match Review</h2>
            <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.3em]">Resumen Estadístico</p>
          </div>

          <div className="flex items-center gap-8 bg-slate-800 px-10 py-4 rounded-3xl border border-slate-700">
            <div className="text-center">
              <span className="block text-[10px] font-black text-slate-500 uppercase mb-1">Local</span>
              <span className="text-5xl font-black">{score.local}</span>
            </div>
            <div className="text-2xl font-black text-slate-600">VS</div>
            <div className="text-center">
              <span className="block text-[10px] font-black text-slate-500 uppercase mb-1">Visitante</span>
              <span className="text-5xl font-black">{score.visitor}</span>
            </div>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-2xl font-black uppercase text-sm transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            Finalizar Sesión
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8 space-y-20">
        {/* SECCIÓN 1: ANÁLISIS DEL EQUIPO */}
        <section className="space-y-8">
          <div className="border-l-8 border-blue-600 pl-6">
            <h3 className="text-3xl font-black text-slate-800 uppercase italic">Desempeño del Equipo</h3>
            <p className="text-slate-400 font-bold">Mapas de calor y trayectorias colectivas en este partido</p>
          </div>

          {isTeamLoading ? (
            <div className="h-96 flex items-center justify-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200 text-slate-400 font-bold uppercase animate-pulse">
              Generando informes colectivos...
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <CourtTrajectories stats={serveFor || []} title="Saques - Trayectorias" />
              <CourtTrajectories stats={serveAgainst || []} title="Saques - Errores" />
              <CourtTrajectories stats={attackFor || []} title="Ataques - Puntos" />
              <CourtTrajectories stats={attackAgainst || []} title="Ataques - Errores" />
              <HeatMap stats={blockFor || []} mode="for" title="Bloqueos - Éxito" />
              <HeatMap stats={receptionAgainst || []} mode="against" title="Recepción - Fallos" />
            </div>
          )}
        </section>

        {/* SECCIÓN 2: ANÁLISIS INDIVIDUAL */}
        <section className="space-y-8 pb-20">
          <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="border-l-8 border-emerald-500 pl-6">
              <h3 className="text-2xl font-black text-slate-800 uppercase italic">Análisis Individual</h3>
              <p className="text-slate-400 font-bold">Filtra por jugador para ver sus acciones</p>
            </div>

            <select
              value={activePlayerSlug}
              onChange={(e) => setSelectedPlayerSlug(e.target.value)}
              className="w-full md:w-64 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer"
            >
              {players?.map((player) => (
                <option key={player.slug_player} value={player.slug_player}>
                  #{player.dorsal} - {player.name}
                </option>
              ))}
            </select>
          </div>

          {isPlayerLoading ? (
            <div className="h-64 flex items-center justify-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200 text-slate-400 font-bold uppercase">
              Cargando datos del jugador...
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <CourtTrajectories stats={pServeFor || []} title="Sus Saques Efectivos" />
              <CourtTrajectories stats={pServeAgainst || []} title="Sus Errores de Saque" />
              <CourtTrajectories stats={pAttackFor || []} title="Sus Ataques (Puntos)" />
              <CourtTrajectories stats={pAttackAgainst || []} title="Sus Ataques (Errores)" />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
