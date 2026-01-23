import { useTeamsQuery } from "@/queries/teams/useTeams";
import { useLeagueBySlugQuery } from "@/queries/leagues/useLeagueBySlug";
import { useDeleteTeamMutation } from "@/mutations/teams/useDelete";
import type { Team } from "@/interfaces/team.interface";
import LoadingFallback from "@/components/LoadingFallback";
import { useAssignedAnalystsQuery } from "@/queries/analyst/useAnalystQueries";
import { useAssignedCoachesQuery } from "@/queries/coach/useCoachQueries";
import { useVenuesQuery } from "@/queries/venues/useVenues";

interface TeamsListProps {
  leagueSlug: string;
  onCreate: () => void;
  onEdit: (team: Team) => void;
}

export const TeamsList = ({ leagueSlug, onCreate, onEdit }: TeamsListProps) => {
  const { data: league } = useLeagueBySlugQuery(leagueSlug);
  const { data: teams, isLoading, isError } = useTeamsQuery(leagueSlug);
  const deleteMutation = useDeleteTeamMutation(leagueSlug);
  const { data: allAssignedCoaches } = useAssignedCoachesQuery();
  const { data: allAssignedAnalysts } = useAssignedAnalystsQuery();
  const { data: allVenues } = useVenuesQuery();

  const handleDelete = (slug: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este equipo?")) {
      deleteMutation.mutate({ slug });
    }
  };

  const getCoachName = (id: string | null) => {
    if (!id) return "Sin asignar";
    const coach = allAssignedCoaches?.find((c) => c.id_coach === id);
    return coach ? coach.name : "No encontrado";
  };

  const getAnalystName = (id: string | null) => {
    if (!id) return "Sin analista";
    const analyst = allAssignedAnalysts?.find((a) => a.id_analyst === id);
    return analyst ? analyst.name : "No encontrado";
  };

  const getVenueName = (id: string) => {
    const venue = allVenues?.find((v) => v.id_venue === id);
    return venue ? venue.name : "Sede no encontrada";
  };

  if (isLoading) return <LoadingFallback />;
  if (isError) return <div className="p-4 text-red-500">Error cargando los equipos de esta liga.</div>;

  return (
    <div className="space-y-6">
      {/* --- CABECERA --- */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Equipos de {league?.name || "Liga"}</h2>
          <p className="text-sm text-gray-500">Gestiona los clubes participantes en la temporada {league?.season}</p>
        </div>
        <button
          onClick={onCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <span className="text-lg">+</span> Nuevo Equipo
        </button>
      </div>

      {/* --- TABLA DE EQUIPOS --- */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {!teams || teams.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No hay equipos registrados en esta liga todavía.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Info</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Entrenador / Analista</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sede (Venue)</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Registro</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {teams.map((team) => (
                  <tr key={team.id_team} className="hover:bg-gray-50 transition-colors">
                    {/* Imagen y Nombre */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                          {team.image ? (
                            <img src={team.image} alt={team.name} className="w-full h-full object-contain" />
                          ) : (
                            <div className="flex items-center justify-center h-full text-[10px] text-gray-400">LOGO</div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{team.name}</div>
                          <div className="text-[10px] text-gray-400 font-mono uppercase">{team.slug}</div>
                        </div>
                      </div>
                    </td>

                    {/* Coach y Analista */}
                    <td className="py-4 px-4 text-sm">
                      <div className="text-gray-700">👔 {getCoachName(team.id_coach)}</div>
                      <div className="text-gray-500 text-xs mt-1">📊 {getAnalystName(team.id_analyst)}</div>
                    </td>

                    <td className="py-4 px-4 text-sm text-gray-600">📍 {getVenueName(team.id_venue)}</td>

                    {/* Fecha Creado */}
                    <td className="py-4 px-4 text-xs text-gray-500">{new Date(team.created_at).toLocaleDateString()}</td>

                    {/* Estado */}
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                          team.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {team.status.toUpperCase()}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button onClick={() => onEdit(team)} className="text-indigo-600 hover:text-indigo-900 text-sm font-semibold">
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(team.slug)}
                          disabled={deleteMutation.isPending}
                          className="text-red-500 hover:text-red-700 text-sm font-semibold disabled:opacity-50"
                        >
                          {deleteMutation.isPending ? "..." : "Eliminar"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
