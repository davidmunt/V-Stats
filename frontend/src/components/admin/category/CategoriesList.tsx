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
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      {/* HEADER ADAPTATIVO: Se ajusta de fila a columna en móviles (Part_V Flexbox) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 px-2 md:px-0">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-tight italic">Categorías de Liga</h2>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">
            Clasifica las ligas por niveles o edades de forma profesional.
          </p>
        </div>
        <button
          onClick={onCreate}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200/50 active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span className="whitespace-nowrap">Nueva Categoría</span>
        </button>
      </div>

      {/* CONTENEDOR DE TABLA: Bordes redondeados premium (Part_VII_background) */}
      <div className="bg-white border border-slate-200 rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl shadow-slate-200/60 overflow-hidden">
        {!categories || categories.length === 0 ? (
          <div className="p-20 text-center bg-slate-50/50">
            <p className="text-slate-400 font-medium italic">No hay categorías configuradas en el sistema.</p>
          </div>
        ) : (
          /* SCROLL HORIZONTAL FORZADO: Esto evita que los botones desaparezcan (Part_VII_taules) */
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
            <table className="w-full text-left border-collapse min-w-[800px]">
              {" "}
              {/* min-w asegura espacio para el botón Borrar */}
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-5 px-6 md:px-8 text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Icono
                  </th>
                  <th className="py-5 px-6 md:px-8 text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Nombre
                  </th>
                  {/* COLUMNA CONDICIONAL: Oculta la descripción en tablets para ganar espacio (Part_IV Columnas) */}
                  <th className="hidden lg:table-cell py-5 px-6 md:px-8 text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Descripción
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
                {categories.map((category) => (
                  <tr key={category.slug_category} className="group hover:bg-blue-50/30 transition-all duration-300">
                    <td className="py-5 px-6 md:px-8">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200 p-1 shadow-sm">
                        {category.image ? (
                          <img src={category.image} alt={category.name} className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-[9px] text-slate-400 font-bold uppercase italic">
                            N/A
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-5 px-6 md:px-8">
                      <div className="font-bold text-slate-800 text-base md:text-lg leading-tight uppercase tracking-tight italic">
                        {category.name}
                      </div>
                      {/* Subtítulo visible solo en pantallas donde se oculta la columna descripción */}
                      <div className="lg:hidden text-[10px] text-slate-400 font-medium mt-0.5 truncate max-w-[150px]">
                        {category.description || "Sin descripción"}
                      </div>
                    </td>

                    <td className="hidden lg:table-cell py-5 px-6 md:px-8">
                      <div className="text-sm text-slate-500 font-medium max-w-xs truncate">{category.description || "-"}</div>
                    </td>

                    <td className="py-5 px-6 md:px-8">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                          category.is_active
                            ? "bg-emerald-50 text-emerald-500 border-emerald-100"
                            : "bg-rose-50 text-rose-500 border-rose-100"
                        }`}
                      >
                        {category.is_active ? "Activa" : "Inactiva"}
                      </span>
                    </td>

                    <td className="py-5 px-6 md:px-8 text-right">
                      <div className="flex justify-end gap-2 md:gap-3">
                        {/* Botón Editar */}
                        <button
                          onClick={() => onEdit(category)}
                          className="text-blue-600 hover:text-blue-800 p-2.5 hover:bg-blue-50 rounded-xl transition-all shadow-sm shadow-blue-100/20"
                          title="Editar"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="w-4 h-4 md:w-5 md:h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                            />
                          </svg>
                        </button>

                        {/* Botón Borrar (Faltaba visibilidad en móvil) */}
                        <button
                          onClick={() => handleDelete(category.slug_category)}
                          disabled={deleteMutation.isPending}
                          className="text-slate-300 hover:text-rose-600 p-2.5 hover:bg-rose-50 rounded-xl transition-all shadow-sm shadow-rose-100/20 disabled:opacity-30"
                          title="Eliminar"
                        >
                          {deleteMutation.isPending ? (
                            <span className="text-[10px] font-black uppercase tracking-tighter">...</span>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                              stroke="currentColor"
                              className="w-4 h-4 md:w-5 md:h-5"
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
