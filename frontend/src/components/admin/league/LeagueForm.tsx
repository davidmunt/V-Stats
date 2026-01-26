import { useState } from "react";
import type { League } from "@/interfaces/league.interface";
import { useCreateLeagueMutation } from "@/mutations/leagues/useCreate";
import { useUpdateLeagueMutation } from "@/mutations/leagues/useUpdate";
import { useCategoryLeaguesQuery } from "@/queries/categoryLeagues/useCategoryLeagues";

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

  const { data: categories, isLoading: isLoadingCats } = useCategoryLeaguesQuery();

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    id_category_league: initialData?.id_category_league || "",
    country: initialData?.country || "",
    season: initialData?.season || "",
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
        category: formData.id_category_league,
        country: formData.country,
        season: formData.season,
        image: formData.image,
      };

      if (isEditing && initialData) {
        await updateMutation.mutateAsync({
          slug: initialData.slug,
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
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-6">{isEditing ? `Editar Liga: ${initialData.name}` : "Crear Nueva Liga"}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre de la Liga */}
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Liga</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Premier League"
            />
          </div>

          {/* Selector de Categoría */}
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              name="id_category_league"
              value={formData.id_category_league}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Selecciona una categoría</option>
              {categories?.map((cat) => (
                <option key={cat.id_category_league} value={cat.id_category_league}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* País */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Inglaterra"
            />
          </div>

          {/* Temporada */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Temporada</label>
            <input
              type="text"
              name="season"
              value={formData.season}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: 2024/2025"
              pattern="\d{4}/\d{4}"
            />
          </div>
        </div>

        {/* Imagen */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL del Logo/Imagen</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://..."
          />
        </div>

        {/* Campos exclusivos de Edición */}
        {isEditing && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-md border border-blue-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado Visual</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="scheduled">Programado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Visibilidad Pública</label>
              <select
                name="is_active"
                value={formData.is_active ? "true" : "false"}
                onChange={(e) => setFormData((p) => ({ ...p, is_active: e.target.value === "true" }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
              >
                <option value="true">Visible</option>
                <option value="false">Oculto</option>
              </select>
            </div>
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading || isLoadingCats}
            className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {isLoading ? "Procesando..." : isEditing ? "Guardar Cambios" : "Crear Liga"}
          </button>
        </div>
      </form>
    </div>
  );
};
