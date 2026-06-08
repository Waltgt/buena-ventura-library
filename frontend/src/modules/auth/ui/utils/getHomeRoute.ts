import {
  adminAccessRoles,
  userAccessRoles,
  type AdminRole,
  type UserRole,
} from "@/shared/types/auth/RolesTypes";

type Role = AdminRole | UserRole;

export const getHomeRoute = (roles: Role[]) => {
  if (roles.some((r) => adminAccessRoles.includes(r as AdminRole))) {
    return "/admin";
  }

  if (roles.some((r) => userAccessRoles.includes(r as UserRole))) {
    return "/app";
  }

  return "/";
};