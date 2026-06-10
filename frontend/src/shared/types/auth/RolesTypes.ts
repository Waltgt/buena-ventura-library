export const adminAccessRoles = ["Administrador", "Gestor"] as const;
export const userAccessRoles = ["Cliente"] as const;

export type AdminRole = typeof adminAccessRoles[number];
export type UserRole = typeof userAccessRoles[number];

export type Role = AdminRole | UserRole;