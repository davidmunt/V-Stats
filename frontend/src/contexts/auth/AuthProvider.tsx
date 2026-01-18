import { useState } from "react"; // 1. Quitamos useEffect
import type { ReactNode } from "react"; // 2. Import "type-only" para ReactNode
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import tokenService from "@/lib/token";
import { ACCESS_TOKEN_KEY } from "@/constants/token.constant";
import { useCurrentUserQuery } from "@/queries/auth/useCurrentUser";
import { useLoginMutation } from "@/mutations/auth/useLogin";
import { useRegisterMutation } from "@/mutations/auth/useRegister";
import type { UserRole } from "@/interfaces/user.interface";

type Props = {
  children: ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const navigate = useNavigate();

  const [hasToken, setHasToken] = useState(() => !!tokenService.getToken(ACCESS_TOKEN_KEY));

  const { data: user, isLoading: isUserLoading } = useCurrentUserQuery({
    enabled: hasToken,
  });

  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();

  const login = async (email: string, password: string) => {
    const response = await loginMutation.mutateAsync({ email, password });
    setHasToken(true);
    // 3. CORRECCIÓN: Según tu interfaz Auth, user_type está DENTRO del objeto user.
    // Tu interfaz es: { token: string; user: User }
    if (response.user_type === "admin") {
      // Asegúrate de usar minúscula si tu tipo es "admin"
      navigate("/admin");
    } else if (response.user_type === "coach") {
      navigate("/coach");
    } else if (response.user_type === "analyst") {
      navigate("/analyst");
    } else if (response.user_type === "player") {
      navigate("/player");
    } else {
      navigate("/");
    }
  };

  const register = async (data: { email: string; password: string; name: string; user_type: UserRole }) => {
    // 4. CORRECCIÓN: No asignamos 'const response =' porque no la usábamos
    const response = await registerMutation.mutateAsync(data);
    setHasToken(true);
    if (response.user_type === "admin") {
      // Asegúrate de usar minúscula si tu tipo es "admin"
      navigate("/admin");
    } else if (response.user_type === "coach") {
      navigate("/coach");
    } else if (response.user_type === "analyst") {
      navigate("/analyst");
    } else if (response.user_type === "player") {
      navigate("/player");
    } else {
      navigate("/");
    }
  };

  const logout = () => {
    tokenService.removeToken(ACCESS_TOKEN_KEY);
    setHasToken(false);
    navigate("/auth", { replace: true });
  };

  const isLoading = isUserLoading || loginMutation.isPending || registerMutation.isPending;

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isAuthenticated: hasToken,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
