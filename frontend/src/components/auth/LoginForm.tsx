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
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">{isLoading ? "Iniciando sesión..." : "Login"}</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
      <p>
        Need an account?{" "}
        <button type="button" onClick={onSwitch}>
          Register
        </button>
      </p>
    </>
  );
};

export default LoginForm;
