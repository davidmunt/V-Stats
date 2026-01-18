import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuthContext } from "@/hooks/useAuthContext";
import LoadingFallback from "@/components/LoadingFallback";

interface ProtectedRouteProps {
  children: ReactNode;
  isAuth?: boolean;
}

const ProtectedRoute = ({ children, isAuth }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuthContext();
  const location = useLocation();
  if (isLoading) {
    return <LoadingFallback />;
  }
  if (isAuth && !isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  if (isAuth === false && isAuthenticated && user?.user_type === "admin") {
    return <Navigate to="/admin" replace />;
  }
  if (isAuth === false && isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
