import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

type AuthMode = "login" | "register";

const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>("login");

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">{mode === "login" ? "Sign in" : "Sign up"}</h1>
        {mode === "login" ? <LoginForm onSwitch={() => setMode("register")} /> : <RegisterForm onSwitch={() => setMode("login")} />}
      </div>
    </div>
  );
};

export default AuthPage;
