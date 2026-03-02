import { useTeamsQuery } from "@/queries/teams/useTeams";
import { useLeagueBySlugQuery } from "@/queries/leagues/useLeagueBySlug";
import { useDeleteTeamMutation } from "@/mutations/teams/useDelete";
import type { Team } from "@/interfaces/team.interface";
import LoadingFallback from "@/components/LoadingFallback";
import { useAssignedAnalystsQuery } from "@/queries/analyst/useAssignedAnalysts";
import { useAssignedCoachesQuery } from "@/queries/coach/useAssignedCoaches";
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

  const handleDelete = (slug_team: string) => {
    deleteMutation.mutate({ slug_team });
  };

  const getCoachName = (id: string | null) => {
    if (!id) return "Sin asignar";
    const coach = allAssignedCoaches?.find((c) => c.slug_coach === id);
    return coach ? coach.name : "No encontrado";
  };

  const getAnalystName = (id: string | null) => {
    if (!id) return "Sin analista";
    const analyst = allAssignedAnalysts?.find((a) => a.slug_analyst === id);
    return analyst ? analyst.name : "No encontrado";
  };

  const getVenueName = (id: string) => {
    const venue = allVenues?.find((v) => v.slug_venue === id);
    return venue ? venue.name : "Sede no encontrada";
  };

  if (isLoading) return <LoadingFallback />;
  if (isError) return <div className="p-4 text-red-500">Error cargando los equipos de esta liga.</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Equipos de {league?.name || "Liga"}</h2>
        </div>
        <button
          onClick={onCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-200/50 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nuevo Equipo
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2rem] shadow-xl shadow-slate-200/60 overflow-hidden">
        {!teams || teams.length === 0 ? (
          <div className="p-20 text-center bg-slate-50/50">
            <p className="text-slate-400 font-medium italic">No hay equipos registrados en esta liga todavía.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
                <tr>
                  <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Info</th>
                  <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Cuerpo Técnico</th>
                  <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Sede Principal</th>
                  <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                  <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teams.map((team) => (
                  <tr key={team.slug_team} className="group hover:bg-blue-50/30 transition-all duration-300">
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 p-1 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform">
                          {team.image ? (
                            <img src={team.image} alt={team.name} className="w-full h-full object-contain rounded-xl" />
                          ) : (
                            <div className="text-[10px] font-bold text-slate-300 uppercase">Logo</div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-lg">{team.name}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-6 px-8 text-sm">
                      <div className="text-slate-700 font-bold">{getCoachName(team.slug_coach)}</div>
                      <div className="text-slate-400 font-medium mt-0.5">{getAnalystName(team.slug_analyst)}</div>
                    </td>

                    <td className="py-6 px-8 text-sm text-slate-600 font-medium">{getVenueName(team.slug_venue)}</td>

                    <td className="py-6 px-8">
                      <span
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter border ${
                          team.is_active ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                        }`}
                      >
                        {team.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="py-6 px-8 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onEdit(team)}
                          className="text-blue-600 hover:text-blue-800 p-2.5 hover:bg-blue-50 rounded-xl transition-all group"
                          title="Editar Equipo"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                            />
                          </svg>
                        </button>

                        <button
                          onClick={() => handleDelete(team.slug_team)}
                          disabled={deleteMutation.isPending}
                          className="text-slate-300 hover:text-rose-600 p-2.5 hover:bg-rose-50 rounded-xl transition-all disabled:opacity-30"
                          title="Eliminar Equipo"
                        >
                          {deleteMutation.isPending ? (
                            <span className="text-[10px] font-black uppercase tracking-tighter">...</span>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                              />
                            </svg>
                          )}
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
