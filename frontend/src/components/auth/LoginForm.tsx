import { useEffect, useState } from "react";
import { useLoginMutation } from "@/queries/mutations/useLogin";
import { useNavigate } from "react-router-dom";

interface LoginFormProps {
  onSwitch: () => void;
}

const LoginForm = ({ onSwitch }: LoginFormProps) => {
  const loginMutation = useLoginMutation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({
      email,
      password,
    });
  };

  useEffect(() => {
    if (loginMutation.isSuccess) {
      navigate("/");
    }
  }, [loginMutation.isSuccess, navigate]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? "Loading..." : "Login"}
        </button>
        {loginMutation.isError && <p style={{ color: "red" }}>Login failed</p>}
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
