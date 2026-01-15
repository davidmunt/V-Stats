import { createContext, useContext, ReactNode, useMemo } from "react";
import { useCurrentUserQuery } from "@/queries/queries/useCurrentUser";
import type { User } from "@/interfaces/user.interface";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const { data: user, isLoading } = useCurrentUserQuery();

  const value = useMemo<AuthContextValue>(() => {
    return {
      user: user ?? null,
      isAuthenticated: !!user,
      isLoading,
    };
  }, [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook seguro para consumir el contexto
export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within AuthContextProvider");
  }

  return context;
};
