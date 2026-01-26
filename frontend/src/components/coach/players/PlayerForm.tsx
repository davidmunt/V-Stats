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
  const createMutation = useCreatePlayerMutation(coach?.slug ? coach?.slug : "slug");
  const updateMutation = useUpdatePlayerMutation(initialData?.slug || "");

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
          slug: initialData.slug,
          ...formData,
        });
        await Swal.fire({
          title: "Actualizado",
          text: "Los datos del jugador se han guardado correctamente.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        await createMutation.mutateAsync({
          slug: coach?.slug || "",
          ...formData,
        });
        await Swal.fire({
          title: "Jugador Creado",
          text: `${formData.name} ya forma parte de la plantilla.`,
          icon: "success",
          timer: 2000,
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
    <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-xl font-bold mb-6 text-gray-800">
        {isEditing ? `Editar Jugador: ${initialData.name}` : "Registrar Nuevo Jugador"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre */}
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre Completo</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Ivan Zaytsev"
            />
          </div>

          {/* Dorsal */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Dorsal (#)</label>
            <input
              type="number"
              name="dorsal"
              value={formData.dorsal}
              onChange={handleChange}
              required
              min="0"
              max="99"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Rol / Posición */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Posición en Campo</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="SETTER">Colocador (Setter)</option>
              <option value="OUTSIDE">Punta (Outside Hitter)</option>
              <option value="MIDDLE">Central (Middle Blocker)</option>
              <option value="OPPOSITE">Opuesto (Opposite)</option>
              <option value="LIBERO">Líbero</option>
            </select>
          </div>

          {/* URL Imagen */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">URL de la Foto</label>
            <input
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
            />
          </div>

          {/* Estado y Visibilidad (Solo en edición) */}
          {isEditing && (
            <>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Estado de Disponibilidad</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ACTIVE">Activo</option>
                  <option value="INJURED">Lesionado</option>
                  <option value="INACTIVE">Inactivo</option>
                  <option value="SUSPENDED">Sancionado</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  name="is_active"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Jugador habilitado en sistema
                </label>
              </div>
            </>
          )}
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-6 border-t border-gray-100 mt-4">
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
            className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-md"
          >
            {isLoading ? "Guardando..." : isEditing ? "Actualizar Jugador" : "Registrar Jugador"}
          </button>
        </div>
      </form>
    </div>
  );
};
