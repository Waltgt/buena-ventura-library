import {
  adminAccessRoles,
  userAccessRoles,
  type AdminRole,
  type UserRole,
} from "@/shared/types/auth/RolesTypes";

type Role = AdminRole | UserRole;

export const getHomeRoute = (role: Role) => {
  if (adminAccessRoles.includes(role as AdminRole)) {
    return "/admin";
  }

  if (userAccessRoles.includes(role as UserRole)) {
    return "/app";
  }

  return "/";
};