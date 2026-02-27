import { useCategoryLeaguesQuery } from "@/queries/category/useCategories";
import { useDeleteCategoryLeagueMutation } from "@/mutations/category/useDelete";
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

  const handleDelete = (slug_category: string) => {
    deleteMutation.mutate({ slug_category });
  };

  if (isLoading) return <LoadingFallback />;
  if (isError) return <div className="p-10 text-center text-red-500 font-medium">Error al cargar categorías.</div>;

  return (
    <div className="p-8 rounded-3xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Categorías de Liga</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Clasifica las ligas por niveles o edades.</p>
        </div>
        <button
          onClick={onCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-200/50 active:scale-95"
        >
          <span className="text-xl leading-none">+</span> Nueva Categoría
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2rem] shadow-xl shadow-slate-200/60 overflow-hidden">
        {!categories || categories.length === 0 ? (
          <div className="p-20 text-center bg-slate-50/50">
            <p className="text-slate-400 font-medium italic">No hay categorías configuradas.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
                <tr>
                  <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Icono</th>
                  <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Nombre</th>
                  <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Descripción</th>
                  <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                  <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((category) => (
                  <tr key={category.slug_category} className="group hover:bg-blue-50/30 transition-all duration-300">
                    <td className="py-6 px-8">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200 p-1">
                        {category.image ? (
                          <img src={category.image} alt={category.name} className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-[10px] text-slate-400 font-bold uppercase">N/A</div>
                        )}
                      </div>
                    </td>

                    <td className="py-6 px-8 font-bold text-slate-800 text-lg">{category.name}</td>

                    <td className="py-6 px-8 text-sm text-slate-500 font-medium max-w-xs truncate">{category.description || "-"}</td>

                    <td className="py-6 px-8">
                      <span
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter border ${
                          category.is_active
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : "bg-rose-50 text-rose-600 border-rose-100"
                        }`}
                      >
                        {category.is_active ? "Activa" : "Inactiva"}
                      </span>
                    </td>

                    <td className="py-6 px-8 text-right">
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={() => onEdit(category)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-black uppercase tracking-widest p-2 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(category.slug_category)}
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
