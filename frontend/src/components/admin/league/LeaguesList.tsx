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
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 px-2 md:px-0">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-tight">Competiciones</h2>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">Gestión de ligas, torneos y fases del campeonato.</p>
        </div>
        <button
          onClick={onCreate}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200/50 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span className="whitespace-nowrap">Crear Liga</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl shadow-slate-200/60 overflow-hidden">
        {!leagues || leagues.length === 0 ? (
          <div className="p-20 text-center bg-slate-50/50">
            <p className="text-slate-400 font-medium italic">No hay ligas registradas en el sistema.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-5 px-6 md:px-8 text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest">Logo</th>
                  <th className="py-5 px-6 md:px-8 text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Información
                  </th>
                  <th className="hidden md:table-cell py-5 px-6 md:px-8 text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Categoría
                  </th>
                  <th className="py-5 px-6 md:px-8 text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Estado
                  </th>
                  <th className="py-5 px-6 md:px-8 text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leagues.map((league) => (
                  <tr key={league.slug_league} className="group hover:bg-blue-50/30 transition-all duration-300">
                    <td className="py-5 px-6 md:px-8">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center overflow-hidden shadow-sm">
                        {league.image ? (
                          <img src={league.image} alt={league.name} className="w-full h-full object-contain rounded-lg" />
                        ) : (
                          <span className="text-[9px] font-bold text-slate-300 uppercase">Logo</span>
                        )}
                      </div>
                    </td>

                    <td className="py-5 px-6 md:px-8 cursor-pointer" onClick={() => onViewDetail(league)}>
                      <div className="font-bold text-slate-800 text-base md:text-lg hover:text-blue-600 transition-colors leading-tight">
                        {league.name}
                      </div>
                      <div className="text-[10px] md:text-xs text-slate-400 font-medium mt-0.5">{league.country}</div>
                    </td>

                    <td className="hidden md:table-cell py-5 px-6 md:px-8">
                      <div className="text-slate-600 font-bold text-xs uppercase tracking-tighter">
                        {league.slug_category.replace(/-/g, " ")}
                      </div>
                    </td>

                    <td className="py-5 px-6 md:px-8">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter border ${
                          league.status === "active"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : league.status === "completed"
                              ? "bg-blue-50 text-blue-600 border-blue-100"
                              : "bg-amber-50 text-amber-600 border-amber-100"
                        }`}
                      >
                        {league.status}
                      </span>
                    </td>

                    <td className="py-5 px-6 md:px-8 text-right">
                      <div className="flex justify-end gap-1 md:gap-2">
                        <button
                          onClick={() => onEdit(league)}
                          className="text-blue-600 hover:text-blue-800 p-2 md:p-2.5 hover:bg-blue-50 rounded-xl transition-all group"
                          title="Editar Liga"
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
                          onClick={() => handleDelete(league.slug_league)}
                          disabled={deleteMutation.isPending}
                          className="text-slate-300 hover:text-rose-600 p-2 md:p-2.5 hover:bg-rose-50 rounded-xl transition-all disabled:opacity-30"
                          title="Eliminar Liga"
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
