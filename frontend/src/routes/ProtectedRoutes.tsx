import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../modules/auth/store/authStore";
import type { Role } from "@/shared/types/auth/RolesTypes";

type Props = {
  allowedRoles?: readonly Role[];
  requiredPermissions?: string[];
  children?: React.ReactNode;
};

export const ProtectedRoute = ({
  allowedRoles,
  requiredPermissions,
  children,
}: Props) => {
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore.persist.hasHydrated();

  if (!hasHydrated) return null;

  if (!user) return <Navigate to="/login" replace />;

  const userRoles = Array.isArray(user.roles)
    ? (user.roles.map(String) as Role[])
    : [];

  const userPermissions = Array.isArray(user.permissions)
    ? user.permissions.map((p) => p.permissionName)
    : [];

  if (allowedRoles?.length) {
    const hasRole = userRoles.some((r) => allowedRoles.includes(r));
    if (!hasRole) return <Navigate to="/unauthorized" replace />;
  }

  if (requiredPermissions?.length) {
    const hasPermissions = requiredPermissions.every((p) =>
      userPermissions.includes(p)
    );
    if (!hasPermissions) return <Navigate to="/unauthorized" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};