import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

type AuthMode = "login" | "register";

const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const { isAuthenticated, isLoading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div>
      <h1>{mode === "login" ? "Sign in" : "Sign up"}</h1>
      {mode === "login" ? <LoginForm onSwitch={() => setMode("register")} /> : <RegisterForm onSwitch={() => setMode("login")} />}
    </div>
  );
};

export default AuthPage;
