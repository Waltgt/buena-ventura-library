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

  const userRole = user.role?.name as Role;
  
  if (allowedRoles?.length) {
    const hasRole = allowedRoles.includes(userRole);
    if (!hasRole) return <Navigate to="/unauthorized" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};