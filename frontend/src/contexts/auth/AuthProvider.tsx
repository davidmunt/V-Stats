import { useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import tokenService from "@/lib/token";
import { ACCESS_TOKEN_KEY } from "@/constants/token.constant";
import { useCurrentUserQuery } from "@/queries/auth/useCurrentUser";
import { useLoginMutation } from "@/mutations/auth/useLogin";
import { useRegisterMutation } from "@/mutations/auth/useRegister";
import { useLogoutDeviceMutation } from "@/mutations/auth/useLogoutDevice";
import { useLogoutAllMutation } from "@/mutations/auth/useLogoutAll";
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
  const logoutDeviceMutation = useLogoutDeviceMutation();
  const logoutAllMutation = useLogoutAllMutation();

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
    setHasToken(true);
  };

  const register = async (data: { email: string; password: string; name: string; user_type: UserRole }) => {
    await registerMutation.mutateAsync(data);
    setHasToken(true);
  };

  // const logoutDevice = async () => {
  //   tokenService.removeToken(ACCESS_TOKEN_KEY);
  //   await logoutDeviceMutation.reset();
  //   setHasToken(false);
  //   navigate("/auth", { replace: true });
  // };

  const logoutDevice = async () => {
    logoutDeviceMutation.mutate();
  };

  const logoutAll = async () => {
    tokenService.removeToken(ACCESS_TOKEN_KEY);
    await logoutAllMutation.reset();
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
        logoutDevice,
        logoutAll,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
