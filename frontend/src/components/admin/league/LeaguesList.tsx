import { useLeaguesQuery } from "@/queries/leagues/useLeagues";
import { useDeleteLeagueMutation } from "@/mutations/leagues/useDelete";
import type { League } from "@/interfaces/league.interface";
import LoadingFallback from "@/components/LoadingFallback";
// import { useCategoryLeaguesQuery } from "@/queries/category/useCategories";

interface LeaguesListProps {
  onCreate: () => void;
  onEdit: (league: League) => void;
  onViewDetail: (league: League) => void;
}

//componente que muestra todas tus ligas creadas
export const LeaguesList = ({ onCreate, onEdit, onViewDetail }: LeaguesListProps) => {
  const { data: leagues, isLoading, isError } = useLeaguesQuery();
  // const { data: categories } = useCategoryLeaguesQuery();
  const deleteMutation = useDeleteLeagueMutation();

  // const getCategoryName = (categorySlug: string) => {
  //   if (!categories) return "Cargando...";
  //   const category = categories.find((cat) => cat.slug_category === categorySlug);
  //   return category ? category.name : "Sin categoría";
  // };

  const handleDelete = (slug_league: string) => {
    deleteMutation.mutate({ slug_league });
  };

  if (isLoading) return <LoadingFallback />;
  if (isError) return <div className="p-4 text-red-500">Error cargando las ligas...</div>;

  return (
    <div className="p-8 rounded-3xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Competiciones</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Gestión de ligas, torneos y fases del campeonato.</p>
        </div>
        <button
          onClick={onCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-200/50 active:scale-95"
        >
          <span className="text-xl leading-none">+</span> Crear Liga
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2rem] shadow-xl shadow-slate-200/60 overflow-hidden">
        {!leagues || leagues.length === 0 ? (
          <div className="p-20 text-center bg-slate-50/50">
            <p className="text-slate-400 font-medium italic">No hay ligas registradas en el sistema.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Logo</th>
                  <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Información</th>
                  <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Categoría</th>
                  <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                  <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leagues.map((league) => (
                  <tr key={league.slug_league} className="group hover:bg-blue-50/30 transition-all duration-300">
                    <td className="py-6 px-8">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 p-1 flex items-center justify-center overflow-hidden">
                        {league.image ? (
                          <img src={league.image} alt={league.name} className="w-full h-full object-contain rounded-xl" />
                        ) : (
                          <span className="text-[10px] font-bold text-slate-300 uppercase">Logo</span>
                        )}
                      </div>
                    </td>

                    <td className="py-6 px-8 cursor-pointer" onClick={() => onViewDetail(league)}>
                      <div className="font-bold text-slate-800 text-lg hover:text-blue-600 transition-colors">{league.name}</div>
                      <div className="text-xs text-slate-400 font-medium mt-0.5">{league.country}</div>
                    </td>

                    <td className="py-6 px-8">
                      <div className="text-slate-600 font-bold text-sm uppercase tracking-tighter">
                        {league.slug_category.replace(/-/g, " ")}
                      </div>
                    </td>

                    <td className="py-6 px-8">
                      <span
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter border ${
                          league.status === "active"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : league.status === "completed"
                              ? "bg-blue-50 text-blue-600 border-blue-100"
                              : league.status === "pending"
                                ? "bg-amber-50 text-amber-600 border-amber-100"
                                : "bg-rose-50 text-rose-600 border-rose-100"
                        }`}
                      >
                        {league.status}
                      </span>
                    </td>

                    <td className="py-6 px-8 text-right">
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={() => onEdit(league)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-black uppercase tracking-widest p-2 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(league.slug_league)}
                          disabled={deleteMutation.isPending}
                          className="text-slate-300 hover:text-rose-600 text-xs font-black uppercase tracking-widest p-2 hover:bg-rose-50 rounded-lg transition-all"
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
