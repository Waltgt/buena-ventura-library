export type UserRequestParams = {
    id?: number;
    username: string;
    email: string;
    roleId: number;
    personId: string;
    name: string;
    lastname: string;
    password: string;
    phone: string;
}

export type UserRoles = {
    idRol: number;
    nombreRol: string;
}

export type UserForm = {
    id?: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roles: number[];
};

export type UserTableRow = {
    id: number;
    username: string;
    email: string;
    statusLabel: string;
};