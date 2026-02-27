import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

type AuthMode = "login" | "register";

const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>("login");

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-gradient-to-br from-slate-100 to-white">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 w-full max-w-[440px] animate-in fade-in zoom-in-95 duration-500">
        <h1 className="text-3xl font-black text-center mb-2 text-slate-900 tracking-tighter italic">
          {mode === "login" ? "Bienvenido" : "Crear Perfil"}
        </h1>
        <p className="text-center text-slate-400 text-sm font-medium mb-10 tracking-tight">
          {mode === "login" ? "Accede a tu panel de análisis táctico" : "Regístrate para gestionar tu equipo"}
        </p>

        {mode === "login" ? <LoginForm onSwitch={() => setMode("register")} /> : <RegisterForm onSwitch={() => setMode("login")} />}
      </div>
    </div>
  );
};

export default AuthPage;
