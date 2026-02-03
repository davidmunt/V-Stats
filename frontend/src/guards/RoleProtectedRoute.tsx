import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuthContext } from "@/hooks/useAuthContext";
import LoadingFallback from "@/components/LoadingFallback";
import type { UserRole } from "@/interfaces/user.interface";

interface Props {
  children: ReactNode;
  allowedRoles: UserRole[];
}

const RoleProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { user, isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) return <LoadingFallback />;

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" replace />;
  }

  if (!allowedRoles.includes(user.user_type)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
