import { useState } from "react";
import type { League } from "@/interfaces/league.interface";
import { useCreateLeagueMutation } from "@/mutations/leagues/useCreate";
import { useUpdateLeagueMutation } from "@/mutations/leagues/useUpdate";
import { useCategoryLeaguesQuery } from "@/queries/category/useCategories";

interface LeagueFormProps {
  initialData: League | null;
  onCancel: () => void;
  onSuccess: () => void;
}

//componente formulario para crear o editar una de tus ligas
export const LeagueForm = ({ initialData, onCancel, onSuccess }: LeagueFormProps) => {
  const isEditing = !!initialData;
  const createMutation = useCreateLeagueMutation();
  const updateMutation = useUpdateLeagueMutation();

  const { data: categories } = useCategoryLeaguesQuery();

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug_category: initialData?.slug_category || "",
    country: initialData?.country || "",
    image: initialData?.image || "",
    is_active: initialData?.is_active ?? true,
    status: initialData?.status || "active",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const commonData = {
        name: formData.name,
        slug_category: formData.slug_category,
        country: formData.country,
        image: formData.image,
      };

      if (isEditing && initialData) {
        await updateMutation.mutateAsync({
          slug_league: initialData.slug_league,
          ...commonData,
          status: formData.status,
          is_active: formData.is_active,
        });
      } else {
        await createMutation.mutateAsync({
          ...commonData,
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Error al guardar la liga", error);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="p-8 bg-white rounded-3xl">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-800 tracking-tight">
          {isEditing ? `Editar Liga: ${initialData.name}` : "Crear Nueva Liga"}
        </h2>
        <p className="text-sm text-slate-400 font-normal">Define los parámetros de la competición, categoría y visibilidad.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Nombre de la Liga</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-700 font-medium placeholder:text-slate-300"
              placeholder="Ej: Premier League"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Categoría</label>
            <select
              name="slug_category"
              value={formData.slug_category}
              onChange={handleChange}
              required
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-700 font-medium appearance-none cursor-pointer"
            >
              <option value="">Selecciona categoria...</option>
              {categories?.map((cat) => (
                <option key={cat.slug_category} value={cat.slug_category}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">País / Región</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-700 font-medium placeholder:text-slate-300"
              placeholder="Ej: España"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">URL del Logo / Imagen</label>
            <input
              type="text"
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
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Estado Visual</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-700 font-bold appearance-none cursor-pointer"
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="completed">Finalizada</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Visibilidad</label>
              <select
                name="is_active"
                value={formData.is_active ? "true" : "false"}
                onChange={(e) => setFormData((p) => ({ ...p, is_active: e.target.value === "true" }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-700 font-bold appearance-none cursor-pointer"
              >
                <option value="true">Pública (Visible)</option>
                <option value="false">Privada (Oculta)</option>
              </select>
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
            className="flex-1 px-8 py-3.5 text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-2xl text-sm font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? "Procesando..." : isEditing ? "Guardar Cambios" : "Crear Liga"}
          </button>
        </div>
      </form>
    </div>
  );
};
