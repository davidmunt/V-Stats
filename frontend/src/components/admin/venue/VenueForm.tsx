import { useState } from "react";
import type { Venue } from "@/interfaces/venue.interface";
import { useCreateVenueMutation } from "@/mutations/venues/useCreate";
import { useUpdateVenueMutation } from "@/mutations/venues/useUpdate";

interface VenueFormProps {
  initialData: Venue | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export const VenueForm = ({ initialData, onCancel, onSuccess }: VenueFormProps) => {
  const isEditing = !!initialData;
  const createMutation = useCreateVenueMutation();
  const updateMutation = useUpdateVenueMutation();

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    capacity: initialData?.capacity || 0,
    indoor: initialData?.indoor ?? false,
    is_active: initialData?.is_active ?? true,
    status: initialData?.status?.toLowerCase() || (initialData?.is_active ? "active" : "inactive"),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (name === "status") {
      setFormData((prev) => ({
        ...prev,
        status: value.toLowerCase(),
        is_active: value === "active",
      }));
    } else {
      const finalValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
      setFormData((prev) => ({ ...prev, [name]: finalValue }));
    }
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
          address: formData.address,
          city: formData.city,
          capacity: Number(formData.capacity),
          indoor: formData.indoor,
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Error al guardar la sede", error);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-6">{isEditing ? `Editar Sede: ${initialData.name}` : "Registrar Nueva Sede"}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Sede</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Estadio Olímpico"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Madrid"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
              min="0"
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección Exacta</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Calle Deporte 123"
            />
          </div>

          <div className="flex items-center gap-2 py-2">
            <input
              type="checkbox"
              name="indoor"
              id="indoor"
              checked={formData.indoor}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="indoor" className="text-sm font-medium text-gray-700 cursor-pointer">
              ¿Es un recinto interior (Indoor)?
            </label>
          </div>
        </div>

        {isEditing && (
          <div className="p-4 bg-gray-50 rounded-md border border-gray-100 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado Operativo</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="maintenance">En Mantenimiento</option>
              </select>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex-1 font-medium disabled:opacity-70"
          >
            {isLoading ? "Guardando..." : isEditing ? "Actualizar Sede" : "Registrar Sede"}
          </button>
        </div>
      </form>
    </div>
  );
};
