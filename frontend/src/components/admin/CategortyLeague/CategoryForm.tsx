import { useState } from "react";
import type { CategoryLeague } from "@/interfaces/categoryLeague.interface";
import { useCreateCategoryLeagueMutation } from "@/mutations/categoryLeague/useCreate";
import { useUpdateCategoryLeagueMutation } from "@/mutations/categoryLeague/useUpdate";

interface CategoryFormProps {
  initialData: CategoryLeague | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export const CategoryForm = ({ initialData, onCancel, onSuccess }: CategoryFormProps) => {
  const isEditing = !!initialData;
  const createMutation = useCreateCategoryLeagueMutation();
  const updateMutation = useUpdateCategoryLeagueMutation();

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    image: initialData?.image || "",
    isActive: initialData?.isActive ?? true,
    status: initialData?.status || (initialData?.isActive ? "active" : "inactive"),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "status") {
      setFormData((prev) => ({
        ...prev,
        status: value,
        isActive: value === "active",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
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
          description: formData.description,
          image: formData.image,
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Error al guardar categoría", error);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      {/* Título Dinámico */}
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        {isEditing ? `Editar Categoría: ${initialData.name}` : "Crear Nueva Categoría"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* --- CAMPOS COMUNES --- */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ej: Primera División"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Breve descripción de la categoría..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="https://..."
          />
        </div>

        {/* --- CAMPOS SOLO VISIBLES EN UPDATE --- */}
        {isEditing && (
          <div className="p-4 bg-gray-50 rounded-md border border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              name="status"
              value={formData.isActive ? "active" : "inactive"} // Usamos isActive para controlar el value visual
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="active">🟢 Activo</option>
              <option value="inactive">🔴 Inactivo</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Las categorías inactivas no se mostrarán en la app pública.</p>
          </div>
        )}

        {/* --- BOTONES DE ACCIÓN --- */}
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
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex-1 font-medium disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Guardando..." : isEditing ? "Actualizar Categoría" : "Crear Categoría"}
          </button>
        </div>
      </form>
    </div>
  );
};
