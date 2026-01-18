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
    { id: "player", label: "Player" },
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="text" placeholder="Username" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <h3 className="text-lg font-bold">Selecciona Tipo de Usuario:</h3>
        <div className="user_type_div flex gap-2 flex-wrap">
          {options.map((option) => (
            <label key={option.id} className="user_type flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="userType"
                value={option.id}
                checked={user_type === option.id}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700 capitalize">{option.label}</span>
            </label>
          ))}
        </div>
        <button type="submit">{isLoading ? "Creando cuenta..." : "Register"}</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
      <p>
        Already have an account?{" "}
        <button type="button" onClick={onSwitch}>
          Login
        </button>
      </p>
    </>
  );
};

export default RegisterForm;
