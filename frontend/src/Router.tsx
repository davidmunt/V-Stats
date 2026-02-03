import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "@/components/common/Layout";
import ProtectedRoute from "@/guards/ProtectedRoute";
import RoleProtectedRoute from "@/guards/RoleProtectedRoute";
import LoadingFallback from "@/components/LoadingFallback";

const HomePage = lazy(() => import("@/pages/HomePage"));
const AuthPage = lazy(() => import("@/pages/AuthPage"));
const AdminDashboardPage = lazy(() => import("@/pages/AdminDashboardPage"));
const AnalystDashboardPage = lazy(() => import("@/pages/AnalystDashboardPage"));
const CoachDashboardPage = lazy(() => import("@/pages/CoachDashboardPage"));

const Router = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/auth"
            element={
              <ProtectedRoute isAuth={false}>
                <AuthPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute isAuth>
                <HomePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute isAuth>
                <RoleProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboardPage />
                </RoleProtectedRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/analyst"
            element={
              <ProtectedRoute isAuth>
                <RoleProtectedRoute allowedRoles={["analyst"]}>
                  <AnalystDashboardPage />
                </RoleProtectedRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/coach"
            element={
              <ProtectedRoute isAuth>
                <RoleProtectedRoute allowedRoles={["coach"]}>
                  <CoachDashboardPage />
                </RoleProtectedRoute>
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default Router;
