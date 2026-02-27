import { useState } from "react";
import { useAuthContext } from "@/hooks/useAuthContext";

interface LoginFormProps {
  onSwitch: () => void;
}

const LoginForm = ({ onSwitch }: LoginFormProps) => {
  const { login, isLoading } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
    } catch (err) {
      console.error(err);
      setError("Credenciales incorrectas o error en el servidor");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Oficial</label>
          <input
            type="email"
            placeholder="nombre@ejemplo.com"
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-700 font-medium placeholder:text-slate-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contraseña</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-700 font-medium placeholder:text-slate-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-black py-4 rounded-[1.5rem] shadow-xl shadow-blue-200 transition-all active:scale-[0.97] disabled:opacity-50 mt-4 text-xs uppercase tracking-widest"
        >
          {isLoading ? "Validando credenciales..." : "Iniciar Sesión"}
        </button>

        {error && <p className="text-rose-500 text-[11px] font-bold text-center uppercase tracking-tighter">{error}</p>}
      </form>

      <div className="mt-10 pt-8 border-t border-slate-50 text-center">
        <p className="text-slate-400 text-sm font-medium">
          ¿Aún no tienes cuenta?{" "}
          <button
            type="button"
            onClick={onSwitch}
            className="text-blue-600 font-black hover:text-blue-800 transition-colors uppercase text-xs tracking-widest ml-1"
          >
            Regístrate
          </button>
        </p>
      </div>
    </>
  );
};

export default LoginForm;
