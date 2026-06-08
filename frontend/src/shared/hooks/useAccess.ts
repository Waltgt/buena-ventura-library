import { useMemo } from "react";
import { useAuthStore } from "@/modules/auth/store/authStore";

type UseAccessParams = {
  permissions?: string[];
  roles?: string[];
  requireAll?: boolean;
};

export function useAccess({
  permissions = [],
  roles = [],
  requireAll = true,
}: UseAccessParams = {}) {
  const user = useAuthStore((s) => s.user);

  return useMemo(() => {
    if (!user) return false;

    const permissionCheck =
      permissions.length === 0
        ? true
        : requireAll
          ? permissions.every((permission) =>
              user.permissions.some(
                (p) => p.permissionName === permission
              )
            )
          : permissions.some((permission) =>
              user.permissions.some(
                (p) => p.permissionName === permission
              )
            );

    const roleCheck =
      roles.length === 0
        ? true
        : requireAll
          ? roles.every((role) =>
              user.roles.some(
                (r) => r.toLowerCase() === role.toLowerCase()
              )
            )
          : roles.some((role) =>
              user.roles.some(
                (r) => r.toLowerCase() === role.toLowerCase()
              )
            );

    return permissionCheck && roleCheck;
  }, [user, permissions, roles, requireAll]);
}