import { useState } from "react";
import type { Team } from "@/interfaces/team.interface";
import { useCreateTeamMutation } from "@/mutations/teams/useCreate";
import { useUpdateTeamMutation } from "@/mutations/teams/useUpdate";
import { useVenuesQuery } from "@/queries/venues/useVenues";
import { useFreeCoachesQuery } from "@/queries/coach/useFreeCoaches";
import { useCoachByIdQuery } from "@/queries/coach/useCoachDetail";
import { useFreeAnalystsQuery } from "@/queries/analyst/useFreeAnalysts";
import { useAnalystDetailQuery } from "@/queries/analyst/useAnalystDetail";

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
  const { data: currentCoach } = useCoachByIdQuery(initialData?.slug_coach || null);
  const { data: freeAnalysts } = useFreeAnalystsQuery();
  const { data: currentAnalyst } = useAnalystDetailQuery(initialData?.slug_analyst || null);

  const allCoaches = freeCoaches || [];
  if (currentCoach && !allCoaches.some((c) => c.slug_coach === currentCoach.slug_coach)) {
    allCoaches.push(currentCoach);
  }

  const allAnalysts = freeAnalysts || [];
  if (currentAnalyst && !allAnalysts.some((a) => a.slug_analyst === currentAnalyst.slug_analyst)) {
    allAnalysts.push(currentAnalyst);
  }

  const { data: venues } = useVenuesQuery();

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    image: initialData?.image || "",
    slug_venue: initialData?.slug_venue || "",
    slug_coach: initialData?.slug_coach || "",
    slug_analyst: initialData?.slug_analyst || "",
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
          slug_team: initialData.slug_team,
          ...formData,
        });
      } else {
        await createMutation.mutateAsync({
          name: formData.name,
          image: formData.image,
          slug_venue: formData.slug_venue,
          slug_league: leagueSlug,
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
            <label className="block text-sm font-semibold text-gray-700 mb-1">Sede</label>
            <select
              name="slug_venue"
              value={formData.slug_venue}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecciona una sede</option>
              {(venues || []).map((v) => (
                <option key={v.slug_venue} value={v.slug_venue}>
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

          {isEditing && (
            <>
              <div className="border-t col-span-2 my-2"></div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Entrenador</label>
                <select
                  name="slug_coach"
                  value={formData.slug_coach || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                >
                  <option value="">Sin entrenador asignado</option>
                  {allCoaches.map((c) => (
                    <option key={c.slug_coach} value={c.slug_coach}>
                      {c.name} {initialData?.slug_coach === c.slug_coach ? "(Actual)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Analista</label>
                <select
                  name="slug_analyst"
                  value={formData.slug_analyst || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                >
                  <option value="">Sin analista asignado</option>
                  {allAnalysts.map((a) => (
                    <option key={a.slug_analyst} value={a.slug_analyst}>
                      {a.name} {initialData?.slug_analyst === a.slug_analyst ? "(Actual)" : ""}
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
