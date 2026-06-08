export const adminAccessRoles = ["Administrador"] as const;
export const userAccessRoles = ["Gestor"] as const;

export type AdminRole = typeof adminAccessRoles[number];
export type UserRole = typeof userAccessRoles[number];

export type Role = AdminRole | UserRole;