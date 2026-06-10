import { useMemo } from "react";
import { useAuthStore } from "@/modules/auth/store/authStore";

type UseAccessParams = {
  roles?: string[];
  requireAll?: boolean;
};

export function useAccess({
  roles = [],
  requireAll = true,
}: UseAccessParams = {}) {
  const user = useAuthStore((s) => s.user);

  return useMemo(() => {
    if (!user) return false;

    const userRole = user.role?.name?.toLowerCase();

    if (roles.length === 0) {
      return true;
    }

    return requireAll
      ? roles.every(
          (role) => userRole === role.toLowerCase()
        )
      : roles.some(
          (role) => userRole === role.toLowerCase()
        );
  }, [user, roles, requireAll]);
}