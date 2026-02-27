import { useState } from "react";
import type { Player, PlayerRole, PlayerStatus } from "@/interfaces/player.interface";
import { useCreatePlayerMutation } from "@/mutations/players/useCreatePlayer";
import { useUpdatePlayerMutation } from "@/mutations/players/useUpdatePlayer";
import { useCurrentUserQuery } from "@/queries/auth/useCurrentUser";
import Swal from "sweetalert2";

interface PlayerFormProps {
  initialData: Player | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export const PlayerForm = ({ initialData, onCancel, onSuccess }: PlayerFormProps) => {
  const isEditing = !!initialData;
  const { data: coach } = useCurrentUserQuery();
  const createMutation = useCreatePlayerMutation(coach?.slug_user ? coach?.slug_user : "slug");
  const updateMutation = useUpdatePlayerMutation(initialData?.slug_player || "");

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    dorsal: initialData?.dorsal || 0,
    role: initialData?.role || ("OUTSIDE" as PlayerRole),
    image: initialData?.image || "",
    status: initialData?.status || ("ACTIVE" as PlayerStatus),
    is_active: initialData?.is_active ?? true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const finalValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "dorsal" ? Number(finalValue) : finalValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && initialData) {
        await updateMutation.mutateAsync({
          slug_player: initialData.slug_player,
          ...formData,
        });
        await Swal.fire({
          title: "Actualizado",
          text: "Los datos del jugador se han guardado correctamente.",
          icon: "success",
          timer: 800,
          showConfirmButton: false,
        });
      } else {
        await createMutation.mutateAsync({
          slug_team: coach?.slug_team || "",
          ...formData,
        });
        await Swal.fire({
          title: "Jugador Creado",
          text: `${formData.name} ya forma parte de la plantilla.`,
          icon: "success",
          timer: 800,
          showConfirmButton: false,
        });
      }
      onSuccess();
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Error";
      Swal.fire({
        title: "Error",
        text: message,
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="p-8 bg-white rounded-3xl animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-800 tracking-tight">
          {isEditing ? `Editar Jugador: ${initialData.name}` : "Registrar Nuevo Jugador"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-white">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Nombre Completo</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-700 font-medium placeholder:text-slate-300"
              placeholder="Ej: Ivan Zaytsev"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Dorsal (#)</label>
            <input
              type="number"
              name="dorsal"
              value={formData.dorsal}
              onChange={handleChange}
              required
              min="0"
              max="99"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-700 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Posición Técnica</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-700 font-medium appearance-none cursor-pointer"
            >
              <option value="SETTER">Colocador (Setter)</option>
              <option value="OUTSIDE">Punta (Outside Hitter)</option>
              <option value="MIDDLE">Central (Middle Blocker)</option>
              <option value="OPPOSITE">Opuesto (Opposite)</option>
              <option value="LIBERO">Líbero</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">URL de la Foto / Avatar</label>
            <input
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-700 font-medium placeholder:text-slate-300"
              placeholder="https://..."
            />
          </div>
        </fieldset>

        {isEditing && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Disponibilidad</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-700 font-bold appearance-none cursor-pointer"
              >
                <option value="ACTIVE">Activo</option>
                <option value="INJURED">Lesionado</option>
                <option value="INACTIVE">Inactivo</option>
                <option value="SUSPENDED">Sancionado</option>
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
                Habilitado en el sistema
              </label>
            </div>
          </div>
        )}

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
            className="flex-1 px-8 py-3.5 text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-2xl text-sm font-bold uppercase tracking-widest shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? "Procesando..." : isEditing ? "Actualizar Registro" : "Confirmar Alta Jugador"}
          </button>
        </div>
      </form>
    </div>
  );
};
