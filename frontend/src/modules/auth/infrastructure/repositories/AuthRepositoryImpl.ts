import type { AuthRepository } from "../../application/interfaces/AuthRepository";
import type { HttpClient } from "@/shared/http/HttpClient";
import { createApiClient } from "@/shared/http/createApiClient";

import type {
  LoginRequestDTO
  , LoginResponseDTO
} from "../../domain/dto/LoginDTO";
import { loginDtoToUser } from "../mappers/authMapper";
import { API_ROUTES } from "@/shared/utils/apiRoutes";
import type { ApiResponse } from "@/shared/http/ApiResponse";

export function createAuthRepository(http: HttpClient): AuthRepository {
  return {
    async login(username: string, password: string, signal) {

      const body: LoginRequestDTO = {
        username,
        password
      }

      const dto = await http.request<ApiResponse<LoginResponseDTO>>({
        url: API_ROUTES.AUTH_LOGIN,
        method: "POST",
        body,
        withCredentials: false,
        timeoutMs: 15_000,
        signal
      });

      return loginDtoToUser(dto.data);
    }


  }
}


const httpClient = createApiClient(import.meta.env.VITE_API_BACKEND_URL ?? "");
export const authRepository: AuthRepository = createAuthRepository(httpClient);