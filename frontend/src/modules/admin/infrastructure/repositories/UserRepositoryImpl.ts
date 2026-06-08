
import type { HttpClient } from "@/shared/http/HttpClient";
import type { ApiResponse } from "@/shared/http/ApiResponse";
import { createApiClient } from "@/shared/http/createApiClient";

import type { UserRepository } from "../../application/interfaces/UserRepository";

import { API_ROUTES } from "@/shared/utils/apiRoutes";
import type {
    UserRequestCreateDTO,
    UserResponseDTO,
} from "../../domain/dto/UserDTO";
import {
    usersToDomain, userToDomain
} from "../mappers/userMapper";

import { withUserHeader } from "@/shared/utils/withUserHeader";


export function createUserRepository(http: HttpClient): UserRepository {
    return {


        async getAllUsers(signal) {
            const dto = await http.request<ApiResponse<UserResponseDTO[]>>({
                url: API_ROUTES.USER_ENDPOINT,
                method: "GET",
                signal,
            });

            return usersToDomain(dto.data);
        },
        async getUserById(id, signal) {
            const dto = await http.request<ApiResponse<UserResponseDTO>>({
                url: `${API_ROUTES.USER_ENDPOINT}/${id}`,
                method: "GET",
                signal,
            });

            return userToDomain(dto.data);
        },
        async createUser(params, signal) {

            const body: UserRequestCreateDTO = {
                customer_name: params.name,
                customer_last_name: params.lastname,
                email: params.email,
                id_rol: params.roleId,
                identification_number: params.personId,
                password: params.password,
                phone_number: params.phone,
                username: params.username
            };
            const dto = await http.request<ApiResponse<UserResponseDTO>>({
                url: API_ROUTES.USER_ENDPOINT,
                method: "POST",
                body,
                ...withUserHeader(),
                withCredentials: false,
                timeoutMs: 15_000,
                signal,
            });

            return userToDomain(dto.data)
        },
        async updateUser(params, signal) {

            const body: UserRequestCreateDTO = {
                id_user: params.id,
                customer_name: params.name,
                customer_last_name: params.lastname,
                email: params.email,
                id_rol: params.roleId,
                identification_number: params.personId,
                password: params.password,
                phone_number: params.phone,
                username: params.username
            };
            const dto = await http.request<ApiResponse<UserResponseDTO>>({
                url: API_ROUTES.USER_ENDPOINT,
                method: "PUT",
                body,
                ...withUserHeader(),
                withCredentials: false,
                timeoutMs: 15_000,
                signal,
            });

            return userToDomain(dto.data)
        },
    };
}

const httpClient = createApiClient(import.meta.env.VITE_API_BACKEND_URL ?? "");

export const userRepository: UserRepository =
    createUserRepository(httpClient);