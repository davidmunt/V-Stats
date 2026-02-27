import { useState } from "react";
import { useAuthContext } from "@/hooks/useAuthContext";
import type { UserRole } from "@/interfaces/user.interface";

interface RegisterFormProps {
  onSwitch: () => void;
}

const RegisterForm = ({ onSwitch }: RegisterFormProps) => {
  const { register, isLoading } = useAuthContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user_type, setUserType] = useState<UserRole>("user");
  const [error, setError] = useState<string | null>(null);

  const options: { id: UserRole; label: string }[] = [
    { id: "admin", label: "Admin" },
    { id: "coach", label: "Coach" },
    { id: "analyst", label: "Analyst" },
    { id: "user", label: "User" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUserType(e.target.value as UserRole);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await register({
        name,
        email,
        password,
        user_type,
      });
    } catch (err) {
      console.error(err);
      setError("Error al registrarse. Intenta con otro email.");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Campos de texto con el mismo estilo refinado */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nombre de Usuario"
            className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-700 font-medium"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-700 font-medium"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-700 font-medium"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mt-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-1">Tipo de Cuenta</label>
          <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-50 rounded-[1.5rem] border border-slate-100">
            {options.map((option) => (
              <label key={option.id} className="relative flex items-center justify-center cursor-pointer group">
                <input
                  type="radio"
                  name="userType"
                  value={option.id}
                  checked={user_type === option.id}
                  onChange={handleChange}
                  className="sr-only" // Ocultamos el radio nativo para usar el estilo táctico
                />
                <div
                  className={`w-full text-center py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    user_type === option.id
                      ? "bg-white text-blue-600 shadow-sm border border-slate-100 scale-[1.02]"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {option.label}
                </div>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-black py-4 rounded-[1.5rem] shadow-xl shadow-blue-200 transition-all active:scale-[0.97] disabled:opacity-50 mt-4 text-xs uppercase tracking-widest"
        >
          {isLoading ? "Creando perfil..." : "Completar Registro"}
        </button>

        {error && <p className="text-rose-500 text-[11px] font-bold text-center uppercase tracking-tighter">{error}</p>}
      </form>

      <div className="mt-8 pt-6 border-t border-slate-50 text-center">
        <p className="text-slate-400 text-sm font-medium">
          ¿Ya tienes cuenta?{" "}
          <button
            type="button"
            onClick={onSwitch}
            className="text-blue-600 font-black hover:text-blue-800 transition-colors uppercase text-xs tracking-widest ml-1"
          >
            Acceder
          </button>
        </p>
      </div>
    </>
  );
};

export default RegisterForm;
