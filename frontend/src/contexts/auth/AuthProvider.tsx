import type { ReactNode } from "react";
import { useCurrentUserQuery } from "@/queries/auth/useCurrentUser";
import { AuthContext } from "./AuthContext";

type Props = {
  children: ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const { data: user, isLoading } = useCurrentUserQuery();

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
