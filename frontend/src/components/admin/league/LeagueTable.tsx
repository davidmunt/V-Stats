import { useTeamsStandingsQuery } from "@/queries/teams/useTeamsStandings";
import LoadingFallback from "@/components/LoadingFallback";

interface LeagueTableProps {
  leagueSlug: string;
}

export const LeagueTable = ({ leagueSlug }: LeagueTableProps) => {
  const { data: standings, isLoading, isError } = useTeamsStandingsQuery(leagueSlug);

  if (isLoading) return <LoadingFallback />;
  if (isError) return <div className="p-4 text-red-500">Error cargando la clasificación.</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold text-gray-800">Clasificación General</h3>
        <span className="text-xs text-gray-400 uppercase tracking-wider">Actualizado en tiempo real</span>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {!standings || standings.length === 0 ? (
          <div className="p-12 text-center text-gray-500">Aún no hay datos de partidos registrados para generar la tabla.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-gray-600">
                  <th className="py-3 px-4 font-semibold w-12 text-center">Pos</th>
                  <th className="py-3 px-4 font-semibold">Equipo</th>
                  <th className="py-3 px-4 font-semibold text-center bg-blue-50 text-blue-700">PTS</th>
                  <th className="py-3 px-4 font-semibold text-center">PJ</th>
                  <th className="py-3 px-4 font-semibold text-center">PG</th>
                  <th className="py-3 px-4 font-semibold text-center">PP</th>
                  <th className="py-3 px-4 font-semibold text-center">SG</th>
                  <th className="py-3 px-4 font-semibold text-center">SP</th>
                  <th className="py-3 px-4 font-semibold text-center">PF</th>
                  <th className="py-3 px-4 font-semibold text-center">PC</th>
                  <th className="py-3 px-4 font-semibold text-center">DIFF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {standings
                  .sort((a, b) => b.points - a.points || b.points_diff - a.points_diff)
                  .map((team, index) => (
                    <tr key={team.id_team} className="hover:bg-gray-50 transition-colors">
                      {/* Posición */}
                      <td className="py-4 px-4 text-center font-bold text-gray-400">{index + 1}</td>

                      {/* Equipo (Imagen + Nombre) */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-gray-100 flex-shrink-0 border border-gray-200 overflow-hidden">
                            {team.image ? (
                              <img src={team.image} alt={team.name} className="w-full h-full object-contain" />
                            ) : (
                              <div className="text-[8px] flex items-center justify-center h-full">LOGO</div>
                            )}
                          </div>
                          <span className="font-bold text-gray-800 whitespace-nowrap">{team.name}</span>
                        </div>
                      </td>

                      {/* Puntos (Resaltado) */}
                      <td className="py-4 px-4 text-center font-black bg-blue-50/50 text-blue-700">{team.points}</td>

                      {/* Estadísticas de Partidos */}
                      <td className="py-4 px-4 text-center text-gray-600">{team.played}</td>
                      <td className="py-4 px-4 text-center text-green-600 font-medium">{team.won}</td>
                      <td className="py-4 px-4 text-center text-red-600 font-medium">{team.lost}</td>

                      {/* Sets */}
                      <td className="py-4 px-4 text-center text-gray-500">{team.sets_won}</td>
                      <td className="py-4 px-4 text-center text-gray-500">{team.sets_lost}</td>

                      {/* Puntos a favor y en contra */}
                      <td className="py-4 px-4 text-center text-gray-500">{team.points_favor}</td>
                      <td className="py-4 px-4 text-center text-gray-500">{team.points_against}</td>

                      {/* Diferencia de puntos */}
                      <td className={`py-4 px-4 text-center font-bold ${team.points_diff >= 0 ? "text-gray-800" : "text-red-500"}`}>
                        {team.points_diff > 0 ? `+${team.points_diff}` : team.points_diff}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Leyenda rápida */}
      <div className="flex gap-4 text-[10px] text-gray-400 px-2 uppercase font-medium">
        <span>
          <b>PTS:</b> Puntos
        </span>
        <span>
          <b>PJ:</b> Jugados
        </span>
        <span>
          <b>PG:</b> Ganados
        </span>
        <span>
          <b>PP:</b> Perdidos
        </span>
        <span>
          <b>SG/SP:</b> Sets Ganados/Perdidos
        </span>
        <span>
          <b>PF/PC:</b> Puntos Favor/Contra
        </span>
      </div>
    </div>
  );
};
