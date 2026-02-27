import { useVenuesQuery } from "@/queries/venues/useVenues";
import { useDeleteVenueMutation } from "@/mutations/venues/useDelete";
import type { Venue } from "@/interfaces/venue.interface";
import LoadingFallback from "@/components/LoadingFallback";

interface VenuesListProps {
  onCreate: () => void;
  onEdit: (venue: Venue) => void;
}

// Componente que muestra todas las sedes/estadios registrados
export const VenuesList = ({ onCreate, onEdit }: VenuesListProps) => {
  const { data: venues, isLoading, isError } = useVenuesQuery();
  const deleteMutation = useDeleteVenueMutation();

  const handleDelete = (slug_venue: string) => {
    deleteMutation.mutate({ slug_venue });
  };

  if (isLoading) return <LoadingFallback />;
  if (isError)
    return (
      <div className="p-10 text-center">
        <p className="text-red-500 font-medium">Error al cargar las sedes. Por favor, inténtalo de nuevo.</p>
      </div>
    );

  return (
    <div className="p-8 rounded-3xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Sedes y Estadios</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Gestión centralizada de instalaciones deportivas.</p>
        </div>
        <button
          onClick={onCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-200/50 active:scale-95"
        >
          <span className="text-xl leading-none">+</span> Nueva Sede
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2rem] shadow-xl shadow-slate-200/60 overflow-hidden">
        {!venues || venues.length === 0 ? (
          <div className="p-20 text-center bg-slate-50/50">
            <p className="text-slate-400 font-medium italic">Esperando registros...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Nombre</th>
                  <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Localización</th>
                  <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Capacidad</th>
                  <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                  <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {venues.map((venue) => (
                  <tr key={venue.slug_venue} className="group hover:bg-blue-50/30 transition-all duration-300">
                    <td className="py-6 px-8">
                      <div className="font-bold text-slate-800 text-lg">{venue.name}</div>
                    </td>

                    <td className="py-6 px-8 text-sm">
                      <div className="text-slate-700 font-bold">{venue.city}</div>
                      <div className="text-slate-400 font-medium mt-0.5">{venue.address}</div>
                    </td>

                    <td className="py-6 px-8 text-sm">
                      <span className="text-slate-700 font-bold">{new Intl.NumberFormat().format(venue.capacity)}</span>
                    </td>

                    <td className="py-6 px-8">
                      <span
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter border ${
                          venue.status === "available"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : venue.status === "maintenance"
                              ? "bg-amber-50 text-amber-600 border-amber-100"
                              : "bg-rose-50 text-rose-600 border-rose-100"
                        }`}
                      >
                        {venue.status}
                      </span>
                    </td>

                    <td className="py-6 px-8 text-right">
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={() => onEdit(venue)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-black uppercase tracking-widest p-2 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(venue.slug_venue)}
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
