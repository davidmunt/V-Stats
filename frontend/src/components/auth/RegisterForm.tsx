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
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <h3 className="text-sm font-black text-gray-500 uppercase tracking-wider mt-2">Selecciona Tipo de Usuario:</h3>

        <div className="user_type_div flex gap-4 flex-wrap p-2 bg-gray-50 rounded-xl">
          {options.map((option) => (
            <label key={option.id} className="user_type flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="userType"
                value={option.id}
                checked={user_type === option.id}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
              />
              <span
                className={`text-sm font-medium capitalize transition-colors ${user_type === option.id ? "text-blue-600 font-bold" : "text-gray-600 group-hover:text-gray-800"}`}
              >
                {option.label}
              </span>
            </label>
          ))}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98] disabled:opacity-50 mt-2"
        >
          {isLoading ? "Creando cuenta..." : "Register"}
        </button>

        {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
      </form>

      <p className="text-center mt-6 text-gray-600 text-sm">
        Already have an account?{" "}
        <button type="button" onClick={onSwitch} className="text-blue-600 font-bold hover:underline">
          Login
        </button>
      </p>
    </>
  );
};

export default RegisterForm;
