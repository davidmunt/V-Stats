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
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
        >
          {isLoading ? "Iniciando sesión..." : "Login"}
        </button>
        {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
      </form>

      <p className="text-center mt-6 text-gray-600 text-sm">
        Need an account?{" "}
        <button type="button" onClick={onSwitch} className="text-blue-600 font-bold hover:underline">
          Register
        </button>
      </p>
    </>
  );
};

export default LoginForm;
