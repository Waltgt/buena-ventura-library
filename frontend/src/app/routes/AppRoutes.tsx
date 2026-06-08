import { Routes, Route, Navigate } from "react-router-dom";

import { ProtectedRoute } from "@/routes/ProtectedRoutes";
import { PublicRoute } from "@/routes/PublicRoute";

import AdminLayout from "@/layouts/AdminLayout";
import UserLayout from "@/layouts/UserLayout";
import AuthLayout from "@/layouts/AuthLayout";

import LoginPage from "@/modules/auth/ui/pages/LoginPage";
import NotFound from "@/shared/pages/NotFound";

import { adminRoutes } from "@/routes/adminRoutes";
import {
  adminAccessRoles,
  userAccessRoles,
} from "@/shared/types/auth/RolesTypes";
import { PERMISSIONS } from "@/shared/utils/permissions";

const renderAdminRoutes = (routes: any[]) =>
  routes.flatMap((r) => {
    if (r.children) {
      return r.children.map((c: any) => {
        const Component = c.element;

        return (
          <Route
            key={c.path}
            path={c.path}
            element={
              <ProtectedRoute requiredPermissions={c.permissions}>
                <Component />
              </ProtectedRoute>
            }
          />
        );
      });
    }

    const Component = r.element;

    return (
      <Route
        key={r.path}
        path={r.path}
        element={
          <ProtectedRoute requiredPermissions={r.permissions}>
            <Component />
          </ProtectedRoute>
        }
      />
    );
  });

export const AppRoutes = () => {
  console.log(PERMISSIONS)
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={adminAccessRoles}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {renderAdminRoutes(adminRoutes)}
      </Route>

      <Route
        path="/app"
        element={
          <ProtectedRoute allowedRoles={userAccessRoles}>
            <UserLayout />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};