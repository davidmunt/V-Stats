import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { useAuthContext } from "@/hooks/useAuthContext";
import tokenService from "@/lib/token";
import { ACCESS_TOKEN_KEY } from "@/constants/token.constant";
import LoadingFallback from "@/components/LoadingFallback";
import type { UserRole } from "@/interfaces/user.interface";

interface JwtPayload {
  user_type?: UserRole;
  role?: UserRole;
}

interface Props {
  children: ReactNode;
  allowedRoles: UserRole[];
}

const RoleProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { user, isAuthenticated, isLoading } = useAuthContext();
  if (isLoading) return <LoadingFallback />;
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  // 1️⃣ Fuente principal: user del backend
  let role = user?.user_type;
  // 2️⃣ Fallback: token
  if (!role) {
    const rawToken = tokenService.getToken(ACCESS_TOKEN_KEY);
    if (!rawToken) return <Navigate to="/auth" replace />;
    try {
      const decoded = jwtDecode<JwtPayload>(rawToken);
      role = decoded.user_type ?? decoded.role;
    } catch {
      return <Navigate to="/auth" replace />;
    }
  }
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default RoleProtectedRoute;
