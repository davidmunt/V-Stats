import { createContext } from "react";
import type { User, UserRole } from "@/interfaces/user.interface";

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name: string; user_type: UserRole }) => Promise<void>;
  logoutDevice: () => void;
  logoutAll: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
