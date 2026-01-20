import { useLeaguesQuery } from "@/queries/leagues/useLeagues";
import { useDeleteLeagueMutation } from "@/mutations/leagues/useDelete";
import type { League } from "@/interfaces/league.interface";
import LoadingFallback from "@/components/LoadingFallback";
import { useCategoryLeaguesQuery } from "@/queries/categoryLeague/useCategoryLeagues";

interface LeaguesListProps {
  onCreate: () => void;
  onEdit: (league: League) => void;
}

export const LeaguesList = ({ onCreate, onEdit }: LeaguesListProps) => {
  const { data: leagues, isLoading, isError } = useLeaguesQuery();
  const { data: categories } = useCategoryLeaguesQuery();
  const deleteMutation = useDeleteLeagueMutation();

  const getCategoryName = (categoryId: string) => {
    if (!categories) return "Cargando...";
    const category = categories.find((cat) => cat.id_category_league === categoryId);
    return category ? category.name : "Sin categoría";
  };

  const handleDelete = (slug: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta liga?")) {
      deleteMutation.mutate({ slug });
    }
  };

  if (isLoading) return <LoadingFallback />;
  if (isError) return <div className="p-4 text-red-500">Error cargando las ligas.</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Ligas</h2>
          <p className="text-sm text-gray-500">Gestiona las competiciones y sus temporadas</p>
        </div>
        <button
          onClick={onCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <span>+</span> Crear Liga
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {!leagues || leagues.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No hay ligas creadas. ¡Empieza creando una!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Logo</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Temporada</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoria</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">País</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leagues.map((league) => (
                  <tr key={league.id_league} className="hover:bg-gray-50 transition-colors">
                    {/* Imagen */}
                    <td className="py-3 px-4">
                      <div className="w-10 h-10 rounded bg-gray-100 border border-gray-200 overflow-hidden">
                        {league.image ? (
                          <img src={league.image} alt={league.name} className="w-full h-full object-contain" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-[10px] text-gray-400">Sin Logo</div>
                        )}
                      </div>
                    </td>

                    {/* Nombre */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-800">{league.name}</div>
                    </td>

                    {/* temporada */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-800">{league.season}</div>
                    </td>

                    {/* Categoria */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-800">{getCategoryName(league.id_category_league)}</div>
                    </td>

                    {/* País y Temporada */}
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-700">{league.country}</div>
                    </td>

                    {/* Estado con Badge de colores según LeagueStatus */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          league.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : league.status === "COMPLETED"
                              ? "bg-blue-100 text-blue-700"
                              : league.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                        }`}
                      >
                        {league.status}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onEdit(league)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1 rounded hover:bg-blue-50"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(league.slug)}
                          disabled={deleteMutation.isPending}
                          className="text-red-600 hover:text-red-800 text-sm font-medium px-2 py-1 rounded hover:bg-red-50 disabled:opacity-50"
                        >
                          {deleteMutation.isPending ? "..." : "Borrar"}
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
