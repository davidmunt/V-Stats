import type { ReactNode } from "react";
import { useCurrentUserQuery } from "@/queries/auth/useCurrentUser";
import { AuthContext } from "./AuthContext";
import tokenService from "@/lib/token";
import { ACCESS_TOKEN_KEY } from "@/constants/token.constant";

type Props = {
  children: ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const { data: user, isLoading } = useCurrentUserQuery();
  const token = tokenService.getToken(ACCESS_TOKEN_KEY);

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isAuthenticated: !!token,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
