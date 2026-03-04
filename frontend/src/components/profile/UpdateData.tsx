import { useState } from "react";
import type { User } from "@/interfaces/user.interface";
import { useUpdateUserMutation } from "@/mutations/auth/useUpdateUser";

interface Props {
  userData?: User;
  onCancel: () => void;
}

const UpdateData = ({ userData, onCancel }: Props) => {
  const [formData, setFormData] = useState({
    name: userData?.name || "",
    avatar: userData?.avatar || "",
  });

  const updateMutation = useUpdateUserMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData, {
      onSuccess: () => onCancel(),
    });
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 animate-in zoom-in-95 duration-300">
      <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-slate-100">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">Configuración</h2>
          <p className="text-sm text-slate-500 font-medium">Actualiza tu identidad en la plataforma.</p>
        </div>

        <div className="space-y-8">
          {/* Avatar Input */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">URL del Avatar</label>
            <input
              type="text"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold outline-none"
              placeholder="https://ejemplo.com/avatar.png"
            />
          </div>

          {/* Name Input */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Nombre Completo</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold outline-none"
            />
          </div>
        </div>

        <div className="flex gap-4 mt-12">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
          >
            {updateMutation.isPending ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateData;
