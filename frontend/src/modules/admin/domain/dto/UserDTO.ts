

export type UserRequestCreateDTO = {
    customer_last_name: string;
    customer_name: string;
    email: string;
    id_rol: number;
    id_user?: number;
    identification_number: string;
    phone_number: string;
    username: string;
    password: string;
}



export type UserResponseDTO = {
    customer_last_name: string;
    customer_name: string;
    email: string;
    id_rol: number;
    id_user: number;
    identification_number: string;
    phone_number: string;
    rol_name: string;
    username: string
}

