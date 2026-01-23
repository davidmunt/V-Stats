import { useState } from "react";
import { useTeamsQuery } from "@/queries/teams/useTeams";
import { useCreateMatchMutation } from "@/mutations/matches/useCreate";
import { useUpdateMatchMutation } from "@/mutations/matches/useUpdate";
import { useDeleteMatchMutation } from "@/mutations/matches/useDelete";
import type { Match } from "@/interfaces/match.interface";
import LoadingFallback from "@/components/LoadingFallback";

interface MatchFormProps {
  leagueSlug: string;
  initialData: Match | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export const MatchForm = ({ leagueSlug, initialData, onCancel, onSuccess }: MatchFormProps) => {
  const isEditing = !!initialData;

  // Queries para llenar los selectores
  const { data: teams, isLoading: isLoadingTeams } = useTeamsQuery(leagueSlug);

  // Mutations
  const createMutation = useCreateMatchMutation(leagueSlug);
  const updateMutation = useUpdateMatchMutation(leagueSlug);
  const deleteMutation = useDeleteMatchMutation(leagueSlug);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    image: initialData?.image || "",
    id_team_local: initialData?.id_team_local || "",
    id_team_visitor: initialData?.id_team_visitor || "",
    date: initialData?.date ? new Date(initialData.date).toISOString().slice(0, 16) : "",
    status: initialData?.status?.toLowerCase() || "scheduled",
    is_active: initialData?.is_active ?? true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const finalValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleDelete = async () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este partido?")) {
      await deleteMutation.mutateAsync({ slug: leagueSlug, matchSlug: initialData!.slug });
      onSuccess();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id_team_local === formData.id_team_visitor) {
      alert("El equipo local y el visitante no pueden ser el mismo.");
      return;
    }

    try {
      if (isEditing && initialData) {
        await updateMutation.mutateAsync({
          slug: leagueSlug,
          matchSlug: initialData.slug,
          ...formData,
          date: new Date(formData.date),
        });
      } else {
        await createMutation.mutateAsync({
          slug: leagueSlug,
          ...formData,
          date: new Date(formData.date),
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Error al procesar el partido", error);
    }
  };

  if (isLoadingTeams) return <LoadingFallback />;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">
        {isEditing ? "Modificar Programación" : "Programar Nuevo Partido"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre e Imagen */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700">Nombre del Encuentro</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Barca : Valencia"
              required
              className="w-full border p-2 rounded mt-1 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700">URL Imagen del Partido (Opcional)</label>
            <input name="image" value={formData.image} onChange={handleChange} className="w-full border p-2 rounded mt-1" />
          </div>

          {/* Selectores de Equipos */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">Equipo Local</label>
            <select
              name="id_team_local"
              value={formData.id_team_local}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded mt-1 bg-white"
            >
              <option value="">Seleccionar...</option>
              {teams?.map((t) => (
                <option key={t.id_team} value={t.id_team}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Equipo Visitante</label>
            <select
              name="id_team_visitor"
              value={formData.id_team_visitor}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded mt-1 bg-white"
            >
              <option value="">Seleccionar...</option>
              {teams?.map((t) => (
                <option key={t.id_team} value={t.id_team}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha */}

          <div>
            <label className="block text-sm font-semibold text-gray-700">Fecha y Hora</label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          {/* Campos Extra de Edición */}
          {isEditing && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Estado</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border p-2 rounded mt-1 bg-white capitalize"
                >
                  <option value="scheduled">Programado</option>
                  <option value="live">En Vivo</option>
                  <option value="finished">Finalizado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
              <div className="flex items-center pt-8">
                <input
                  type="checkbox"
                  name="is_active"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor="is_active" className="text-sm font-medium">
                  Partido Activo
                </label>
              </div>
            </>
          )}
        </div>

        {/* --- ACCIONES --- */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6 border-t">
          <div className="flex gap-3 order-2 sm:order-1">
            <button type="button" onClick={onCancel} className="px-5 py-2 border rounded-lg hover:bg-gray-50">
              Cancelar
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-5 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 font-medium"
              >
                Eliminar Partido
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
            className="order-1 sm:order-2 flex-1 sm:flex-none px-8 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
          >
            {createMutation.isPending || updateMutation.isPending ? "Guardando..." : isEditing ? "Actualizar" : "Programar Partido"}
          </button>
        </div>
      </form>
    </div>
  );
};
