import { useState } from "react";
import type { CategoryLeague } from "@/interfaces/categoryLeague.interface";
import { useCreateCategoryLeagueMutation } from "@/mutations/category/useCreate";
import { useUpdateCategoryLeagueMutation } from "@/mutations/category/useUpdate";

interface CategoryFormProps {
  initialData: CategoryLeague | null;
  onCancel: () => void;
  onSuccess: () => void;
}

//componente formulario para crear o editar una de tus categorias
export const CategoryForm = ({ initialData, onCancel, onSuccess }: CategoryFormProps) => {
  const isEditing = !!initialData;
  const createMutation = useCreateCategoryLeagueMutation();
  const updateMutation = useUpdateCategoryLeagueMutation();

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    image: initialData?.image || "",
    is_active: initialData?.is_active ?? true,
    status: initialData?.status || (initialData?.is_active ? "active" : "inactive"),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "status") {
      setFormData((prev) => ({
        ...prev,
        status: value,
        is_active: value === "active",
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
          slug_category: initialData.slug_category,
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
    <div className="p-8 bg-white">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-800 tracking-tight">
          {isEditing ? `Editar Categoría: ${initialData.name}` : "Crear Nueva Categoría"}
        </h2>
        <p className="text-sm text-slate-400 font-normal">Define el nombre, descripción y la identidad visual de la categoría de liga.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Nombre de la Categoría</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-700 font-medium placeholder:text-slate-300"
              placeholder="Ej: Primera División"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-700 font-medium placeholder:text-slate-300 resize-none"
              placeholder="Breve descripción del nivel o edad..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">URL de Imagen / Icono</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-700 font-medium placeholder:text-slate-300"
              placeholder="https://ejemplo.com/imagen.png"
            />
          </div>
        </fieldset>

        {isEditing && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Estado de la Categoría</label>
              <select
                name="is_active"
                value={formData.is_active ? "active" : "inactive"}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-700 font-bold appearance-none cursor-pointer"
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
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
            {isLoading ? "Procesando..." : isEditing ? "Actualizar Categoría" : "Confirmar Alta"}
          </button>
        </div>
      </form>
    </div>
  );
};
