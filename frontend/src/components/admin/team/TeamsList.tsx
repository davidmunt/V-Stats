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
          <span className="text-xl leading-none">+</span> Nuevo Equipo
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
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={() => onEdit(team)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-black uppercase tracking-widest p-2 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(team.slug_team)}
                          disabled={deleteMutation.isPending}
                          className="text-slate-300 hover:text-rose-600 text-xs font-black uppercase tracking-widest p-2 hover:bg-rose-50 rounded-lg transition-all disabled:opacity-30"
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
