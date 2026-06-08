export const adminAccessRoles = ["admin", "auxiliar", "doctor", "ROLE_ADMIN", "SUPERADMIN"] as const;
export const userAccessRoles = ["paciente", "user", "ROLE_USER"] as const;

export type AdminRole = typeof adminAccessRoles[number];
export type UserRole = typeof userAccessRoles[number];

export type Role = AdminRole | UserRole;