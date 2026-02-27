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
    <div className="p-8 bg-white animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{isEditing ? `Modificar Equipo` : "Añadir Equipo"}</h2>
        <p className="text-sm text-slate-400 font-normal mt-1">
          {isEditing ? initialData.name : "Registra un nuevo participante en la liga."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-white">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Nombre del Equipo</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-700 font-medium placeholder:text-slate-300"
              placeholder="Ej: Valencia C.V."
            />
          </div>

          {/* Sede */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Sede Principal</label>
            <select
              name="slug_venue"
              value={formData.slug_venue}
              onChange={handleChange}
              required
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-700 font-medium appearance-none cursor-pointer"
            >
              <option value="">Selecciona sede...</option>
              {(venues || []).map((v) => (
                <option key={v.slug_venue} value={v.slug_venue}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          {/* Escudo */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">URL Escudo</label>
            <input
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-700 font-medium placeholder:text-slate-300"
              placeholder="https://..."
            />
          </div>

          {isEditing && (
            <>
              <div className="md:col-span-2 border-t border-slate-100 my-4"></div>

              {/* Entrenador */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Entrenador</label>
                <select
                  name="slug_coach"
                  value={formData.slug_coach || ""}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-700 font-medium appearance-none cursor-pointer"
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
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Analista</label>
                <select
                  name="slug_analyst"
                  value={formData.slug_analyst || ""}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-700 font-medium appearance-none cursor-pointer"
                >
                  <option value="">Sin analista asignado</option>
                  {allAnalysts.map((a) => (
                    <option key={a.slug_analyst} value={a.slug_analyst}>
                      {a.name} {initialData?.slug_analyst === a.slug_analyst ? "(Actual)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Estado</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/10 text-slate-700 font-bold appearance-none cursor-pointer"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                  <option value="pending">Pendiente</option>
                </select>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 bg-slate-50/30 self-end">
                <input
                  type="checkbox"
                  name="is_active"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-0"
                />
                <label htmlFor="is_active" className="text-sm font-bold text-slate-600 cursor-pointer select-none">
                  Habilitado públicamente
                </label>
              </div>
            </>
          )}
        </fieldset>

        <div className="flex gap-4 pt-8 mt-10 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-3.5 text-slate-500 bg-slate-50 hover:bg-slate-100 rounded-2xl text-sm font-bold transition-all active:scale-95"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-4 rounded-2xl text-sm font-bold uppercase tracking-widest shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? "Guardando..." : isEditing ? "Actualizar Registro" : "Confirmar Alta Equipo"}
          </button>
        </div>
      </form>
    </div>
  );
};
