import { useState } from "react";
import { useUpdatePasswordMutation } from "@/mutations/auth/useUpdateUserPsswd";
import type { UpdatePasswordParam } from "@/services/auth/authService.param";

interface Props {
  onCancel: () => void;
}

const UpdatePassword = ({ onCancel }: Props) => {
  const [formData, setFormData] = useState<UpdatePasswordParam>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);

  const passwordMutation = useUpdatePasswordMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setError("La nueva contraseña y su confirmación no coinciden.");
      return;
    }

    if (formData.newPassword.length < 5) {
      setError("La nueva contraseña debe tener al menos 5 caracteres.");
      return;
    }

    passwordMutation.mutate(formData, {
      onSuccess: () => {
        onCancel();
      },
      onError: () => {
        setError("Error al actualizar la contraseña. Verifica tu clave actual.");
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 animate-in zoom-in-95 duration-300">
      <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-slate-100">
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-slate-900 italic tracking-tight uppercase">Seguridad</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Protege tu cuenta actualizando la clave.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold rounded-xl animate-shake">{error}</div>
        )}

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Contraseña Actual</label>
            <input
              type="password"
              required
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Nueva Clave</label>
              <input
                type="password"
                required
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Confirmar Clave</label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-12">
          <button
            type="button"
            onClick={onCancel}
            className="order-2 sm:order-1 flex-1 px-6 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all"
          >
            Volver
          </button>
          <button
            type="submit"
            disabled={passwordMutation.isPending}
            className="order-1 sm:order-2 flex-[2] bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-bold shadow-xl transition-all active:scale-95 disabled:opacity-50"
          >
            {passwordMutation.isPending ? "Procesando..." : "Actualizar Contraseña"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdatePassword;
