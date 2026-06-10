export type LoginRequestDTO = {
    username: string;
    password: string;
}

export type LoginResponseDTO = {
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