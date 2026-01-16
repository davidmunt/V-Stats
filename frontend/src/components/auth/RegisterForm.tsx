import { useState } from "react";
import { useRegisterMutation } from "@/mutations/auth/useRegister";

interface RegisterFormProps {
  onSwitch: () => void;
}

const RegisterForm = ({ onSwitch }: RegisterFormProps) => {
  const registerMutation = useRegisterMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    registerMutation.mutate({
      name,
      email,
      password,
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" disabled={registerMutation.isPending}>
          {registerMutation.isPending ? "Loading..." : "Register"}
        </button>
        {registerMutation.isError && <p style={{ color: "red" }}>Register failed</p>}
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
