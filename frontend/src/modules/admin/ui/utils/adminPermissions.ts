export const ADMIN_PERMISSIONS = {
    MODULE_ACCESS: 'admin.module',
    ROLES: 'admin.manager.roles',
    ROLES_CREATE: 'admin.manager.roles.create',
    ROLES_EDIT: 'admin.manager.roles.edit',
    INACTIVATE_ROLES: 'admin.manager.roles.inactivate',
    USERS: 'admin.manager.users',
    PERMISSIONS: 'admin.manager.permissions',
    PERMISSIONS_EDIT: 'admin.manager.permissions.edit',
    PERMISSIONS_CREATE: 'admin.manager.permissions.create',
    PERMISSIONS_INACTIVATE: 'admin.manager.permissions.inactivate',
    ETL_LOADS: 'admin.etl.loads'
} as const

export type AdminPermission =
    typeof ADMIN_PERMISSIONS[keyof typeof ADMIN_PERMISSIONS]