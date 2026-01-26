import { useState } from "react";
import type { Team } from "@/interfaces/team.interface";
import { useCreateTeamMutation } from "@/mutations/teams/useCreate";
import { useUpdateTeamMutation } from "@/mutations/teams/useUpdate";
import { useVenuesQuery } from "@/queries/venues/useVenues";
import { useFreeCoachesQuery, useCoachByIdQuery } from "@/queries/coach/useCoachQueries";
import { useFreeAnalystsQuery, useAnalystByIdQuery } from "@/queries/analyst/useAnalystQueries";

interface TeamFormProps {
  leagueSlug: string;
  initialData: Team | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export const TeamForm = ({ leagueSlug, initialData, onCancel, onSuccess }: TeamFormProps) => {
  const isEditing = !!initialData;
  const createMutation = useCreateTeamMutation(leagueSlug);
  const updateMutation = useUpdateTeamMutation(leagueSlug);

  const { data: freeCoaches } = useFreeCoachesQuery();
  const { data: currentCoach } = useCoachByIdQuery(initialData?.id_coach || null);
  const { data: freeAnalysts } = useFreeAnalystsQuery();
  const { data: currentAnalyst } = useAnalystByIdQuery(initialData?.id_analyst || null);

  const allCoaches = freeCoaches || [];
  if (currentCoach && !allCoaches.some((c) => c.id_coach === currentCoach.id_coach)) {
    allCoaches.push(currentCoach);
  }

  const allAnalysts = freeAnalysts || [];
  if (currentAnalyst && !allAnalysts.some((a) => a.id_analyst === currentAnalyst.id_analyst)) {
    allAnalysts.push(currentAnalyst);
  }

  const { data: venues } = useVenuesQuery();

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    image: initialData?.image || "",
    id_venue: initialData?.id_venue || "",
    id_coach: initialData?.id_coach || "",
    id_analyst: initialData?.id_analyst || "",
    status: initialData?.status || "active",
    is_active: initialData?.is_active ?? true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && initialData) {
        await updateMutation.mutateAsync({
          slug: initialData.slug,
          ...formData,
        });
      } else {
        await createMutation.mutateAsync({
          name: formData.name,
          image: formData.image,
          id_venue: formData.id_venue,
          id_league: leagueSlug,
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Error al guardar equipo", error);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-xl font-bold mb-6 text-gray-800">
        {isEditing ? `Modificar Equipo: ${initialData.name}` : "Añadir Equipo a la Liga"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* --- SIEMPRE VISIBLES --- */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre del Equipo</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Sede (Venue)</label>
            <select
              name="id_venue"
              value={formData.id_venue}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecciona una sede</option>
              {(venues || []).map((v) => (
                <option key={v.id_venue} value={v.id_venue}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">URL Escudo</label>
            <input
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
            />
          </div>

          {/* --- SOLO EN UPDATE --- */}
          {isEditing && (
            <>
              <div className="border-t col-span-2 my-2"></div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Entrenador</label>
                <select
                  name="id_coach"
                  value={formData.id_coach || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                >
                  <option value="">Sin entrenador asignado</option>
                  {allCoaches.map((c) => (
                    <option key={c.id_coach} value={c.id_coach}>
                      {c.name} {initialData?.id_coach === c.id_coach ? "(Actual)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Analista</label>
                <select
                  name="id_analyst"
                  value={formData.id_analyst || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                >
                  <option value="">Sin analista asignado</option>
                  {allAnalysts.map((a) => (
                    <option key={a.id_analyst} value={a.id_analyst}>
                      {a.name} {initialData?.id_analyst === a.id_analyst ? "(Actual)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Estado del Equipo</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                  <option value="pending">Pendiente</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  name="is_active"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Equipo habilitado públicamente
                </label>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? "Guardando..." : isEditing ? "Actualizar Equipo" : "Crear Equipo"}
          </button>
        </div>
      </form>
    </div>
  );
};
