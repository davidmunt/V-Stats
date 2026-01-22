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

  const handleDelete = (slug: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta sede?")) {
      deleteMutation.mutate({ slug });
    }
  };

  if (isLoading) return <LoadingFallback />;
  if (isError) return <div className="p-4 text-red-500">Error cargando las sedes.</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Sedes y Recintos</h2>
          <p className="text-sm text-gray-500">Gestiona los estadios y complejos deportivos</p>
        </div>
        <button
          onClick={onCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <span>+</span> Crear Sede
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {!venues || venues.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No hay sedes registradas todavía.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Localización</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Capacidad</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {venues.map((venue) => (
                  <tr key={venue.id_venue} className="hover:bg-gray-50 transition-colors">
                    {/* Nombre y Slug */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-gray-800">{venue.name}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{venue.slug}</div>
                    </td>

                    {/* Localización */}
                    <td className="py-4 px-4 text-sm text-gray-600">
                      <div>{venue.city}</div>
                      <div className="text-xs text-gray-400">{venue.address}</div>
                    </td>

                    {/* Capacidad */}
                    <td className="py-4 px-4 text-sm text-gray-700">{venue.capacity?.toLocaleString() || "N/A"} personas</td>

                    {/* Indoor / Outdoor */}
                    <td className="py-4 px-4">
                      <span
                        className={`text-xs px-2 py-1 rounded border ${
                          venue.indoor ? "border-purple-200 bg-purple-50 text-purple-700" : "border-orange-200 bg-orange-50 text-orange-700"
                        }`}
                      >
                        {venue.indoor ? "🏠 Interior" : "☀️ Exterior"}
                      </span>
                    </td>

                    {/* Estado (Badge) */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          venue.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : venue.status === "MAINTENANCE"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {venue.status}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onEdit(venue)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(venue.slug)}
                          disabled={deleteMutation.isPending}
                          className="text-red-600 hover:text-red-800 text-sm font-medium px-2 py-1 rounded hover:bg-red-50 disabled:opacity-50 transition-colors"
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
