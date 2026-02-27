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
          slug: initialData.slug_venue,
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
    <div className="p-8 bg-white">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-800 tracking-tight">
          {isEditing ? `Editar Sede: ${initialData.name}` : "Registrar Nueva Sede"}
        </h2>
        <p className="text-sm text-slate-400 font-normal">Complete la información técnica y de ubicación del recinto.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Nombre de la Sede</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-700 font-medium placeholder:text-slate-300"
              placeholder="Ej: Estadio Olímpico"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Ciudad</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-700 font-medium placeholder:text-slate-300"
              placeholder="Ej: Madrid"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Capacidad Total</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
              min="0"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-700 font-medium"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Dirección Postal</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-700 font-medium placeholder:text-slate-300"
              placeholder="Ej: Calle Deporte 123"
            />
          </div>
        </fieldset>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 bg-white shadow-sm hover:border-blue-200 transition-colors cursor-pointer group">
            <input
              type="checkbox"
              name="indoor"
              id="indoor"
              checked={formData.indoor}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 border-slate-300 rounded-lg focus:ring-blue-500"
            />
            <label htmlFor="indoor" className="text-sm font-semibold text-slate-600 cursor-pointer select-none flex-1">
              Recinto cubierto (Indoor)
              <span className="block text-[10px] font-normal text-slate-400 uppercase">Habilitar climatización y luces</span>
            </label>
          </div>

          {isEditing && (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Estado del Recinto</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-700 font-bold appearance-none cursor-pointer"
              >
                <option value="active">Activo / Disponible</option>
                <option value="inactive">Inactivo</option>
                <option value="maintenance">Mantenimiento</option>
              </select>
            </div>
          )}
        </div>

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
            className="flex-1 px-8 py-3.5 text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-2xl text-sm font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? "Procesando..." : isEditing ? "Actualizar Registro" : "Confirmar Alta de Sede"}
          </button>
        </div>
      </form>
    </div>
  );
};
