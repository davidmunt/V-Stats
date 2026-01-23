import { useCategoryLeaguesQuery } from "@/queries/categoryLeagues/useCategoryLeagues";
import { useDeleteCategoryLeagueMutation } from "@/mutations/categoryLeague/useDelete";
import type { CategoryLeague } from "@/interfaces/categoryLeague.interface";
import LoadingFallback from "@/components/LoadingFallback";

interface CategoriesListProps {
  onCreate: () => void;
  onEdit: (category: CategoryLeague) => void;
}

//componente que muestra todas tus categorias creadas
export const CategoriesList = ({ onCreate, onEdit }: CategoriesListProps) => {
  const { data: categories, isLoading, isError } = useCategoryLeaguesQuery();
  const deleteMutation = useDeleteCategoryLeagueMutation();

  const handleDelete = (slug: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta categoría?")) {
      deleteMutation.mutate({ slug });
    }
  };

  if (isLoading) return <LoadingFallback />;
  if (isError) return <div className="p-4 text-red-500">Error cargando las categorías.</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Category Leagues</h2>
          <p className="text-sm text-gray-500">Gestiona las categorías de tu liga</p>
        </div>
        <button
          onClick={onCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <span>+</span> Crear Categoría
        </button>
      </div>
      {/* --- TABLA (Estilo similar a tu imagen) --- */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {!categories || categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No hay categorías creadas. ¡Crea la primera!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              {/* HEADERS */}
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Imagen</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Descripción</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              {/* BODY */}
              <tbody className="divide-y divide-gray-100">
                {categories.map((category) => (
                  <tr key={category.id_category_league} className="hover:bg-gray-50 transition-colors">
                    {/* Imagen */}
                    <td className="py-3 px-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 border border-gray-300">
                        {category.image ? (
                          <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="flex items-center justify-center h-full text-xs">N/A</span>
                        )}
                      </div>
                    </td>
                    {/* Nombre */}
                    <td className="py-3 px-4 font-medium text-gray-800">{category.name}</td>
                    {/* Slug */}
                    <td className="py-3 px-4 text-sm text-gray-500 font-mono">{category.slug}</td>
                    {/* Descripción (Truncada) */}
                    <td className="py-3 px-4 text-sm text-gray-500 max-w-xs truncate">{category.description || "-"}</td>
                    {/* Estado (Badge) */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          category.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {category.status || (category.is_active ? "Activo" : "Inactivo")}
                      </span>
                    </td>
                    {/* Botones de Acción */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onEdit(category)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1 rounded hover:bg-blue-50"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(category.slug)}
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
