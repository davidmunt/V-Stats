import { useState } from "react";
import { useTeamsQuery } from "@/queries/teams/useTeams";
import { useCreateMatchMutation } from "@/mutations/matches/useCreate";
import { useUpdateMatchMutation } from "@/mutations/matches/useUpdate";
import { useDeleteMatchMutation } from "@/mutations/matches/useDelete";
import type { Match } from "@/interfaces/match.interface";
import LoadingFallback from "@/components/LoadingFallback";
import Swal from "sweetalert2";

interface MatchFormProps {
  leagueSlug: string;
  initialData: Match | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export const MatchForm = ({ leagueSlug, initialData, onCancel, onSuccess }: MatchFormProps) => {
  const isEditing = !!initialData;
  const { data: teams, isLoading: isLoadingTeams } = useTeamsQuery(leagueSlug);
  const createMutation = useCreateMatchMutation(leagueSlug);
  const updateMutation = useUpdateMatchMutation(leagueSlug);
  const deleteMutation = useDeleteMatchMutation(leagueSlug);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    image: initialData?.image || "",
    slug_team_local: initialData?.slug_team_local || "",
    slug_team_visitor: initialData?.slug_team_visitor || "",
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
    await deleteMutation.mutateAsync({ matchSlug: initialData!.slug_match });
    onSuccess();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.slug_team_local === formData.slug_team_visitor) {
      Swal.fire({
        title: "Error",
        text: "El equipo local y el visitante no pueden ser el mismo.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    try {
      if (isEditing && initialData) {
        await updateMutation.mutateAsync({
          slug_league: leagueSlug,
          slug_match: initialData.slug_match,
          ...formData,
          date: new Date(formData.date),
        });
      } else {
        await createMutation.mutateAsync({
          slug_league: leagueSlug,
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
    <div className="p-8 bg-white rounded-3xl animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-800 tracking-tight">
          {isEditing ? "Modificar Programación" : "Programar Nuevo Partido"}
        </h2>
        <p className="text-sm text-slate-400 font-normal">Define los equipos, la fecha y los detalles visuales del encuentro.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-white">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Nombre del Encuentro</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Barca : Valencia"
              required
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-700 font-medium placeholder:text-slate-300"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">URL Imagen del Partido (Opcional)</label>
            <input
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-700 font-medium placeholder:text-slate-300"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Equipo Local</label>
            <select
              name="slug_team_local"
              value={formData.slug_team_local}
              onChange={handleChange}
              required
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-700 font-medium appearance-none cursor-pointer"
            >
              <option value="">Seleccionar...</option>
              {teams?.map((t) => (
                <option key={t.slug_team} value={t.slug_team}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Equipo Visitante</label>
            <select
              name="slug_team_visitor"
              value={formData.slug_team_visitor}
              onChange={handleChange}
              required
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-700 font-medium appearance-none cursor-pointer"
            >
              <option value="">Seleccionar...</option>
              {teams?.map((t) => (
                <option key={t.slug_team} value={t.slug_team}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Fecha y Hora</label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-700 font-medium"
            />
          </div>
        </fieldset>

        {isEditing && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Estado del Encuentro</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-700 font-bold appearance-none cursor-pointer capitalize"
              >
                <option value="scheduled">Programado</option>
                <option value="live">En Vivo</option>
                <option value="finished">Finalizado</option>
                <option value="cancelled">Cancelado</option>
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
                Partido Visible
              </label>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-8 mt-10 border-t border-slate-100">
          <div className="flex gap-3 order-2 sm:order-1">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3.5 text-slate-500 bg-slate-50 hover:bg-slate-100 rounded-2xl text-sm font-bold transition-all active:scale-95"
            >
              Cancelar
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-6 py-3.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl hover:bg-rose-100 text-sm font-bold transition-all active:scale-95"
              >
                Eliminar
              </button>
            )}
          </div>

          <button
            type="submit"
            className="order-1 sm:order-2 flex-1 sm:flex-none px-10 py-3.5 text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-2xl text-sm font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
          >
            {isEditing ? "Actualizar" : "Programar Partido"}
          </button>
        </div>
      </form>
    </div>
  );
};
