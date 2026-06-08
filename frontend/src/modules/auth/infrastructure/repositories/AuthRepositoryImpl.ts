import type { AuthRepository } from "../../application/interfaces/AuthRepository";
import type { HttpClient } from "@/shared/http/HttpClient";
import { createApiClient } from "@/shared/http/createApiClient";

import type { LoginRequestDto, LoginResponseDto, LogoutRequestDto } from "../../domain/dto/authLogin.dto";
import type { RefreshRequestDto, RefreshResponseDto } from "../../domain/dto/authRefresh.dto";
import { loginDtoToUser, refreshDtoToTokenMetadata } from "../mappers/authMapper";
import { API_ROUTES } from "@/shared/utils/apiRoutes";
import type { ApiResponse } from "@/shared/http/ApiResponse";

export function createAuthRepository(http: HttpClient): AuthRepository {
  return {
    async login(username: string, password: string, signal) {
      const body: LoginRequestDto = {
        username,
        password
      }

      const dto = await http.request<ApiResponse<LoginResponseDto>>({
        url: API_ROUTES.KEYCLOAK_LOGIN,
        method: "POST",
        body,
        withCredentials: false,
        timeoutMs: 15_000,
        signal
      });

      return loginDtoToUser(dto.data);
    },

    async refresh(refreshToken: string, signal: AbortSignal) {

      const body : RefreshRequestDto = {
        refreshToken : refreshToken,
      }

      const dto = await http.request<ApiResponse<RefreshResponseDto>>({
        url: API_ROUTES.KEYCLOAK_REFRESH,
        method: "POST",
        body,
        withCredentials: false,
        timeoutMs: 15000,
        signal,
      });

      return refreshDtoToTokenMetadata(dto.data);
    },

    async logout(refreshToken: string, signal: AbortSignal) {

      const body : LogoutRequestDto = {
        refreshToken: refreshToken,
      }
      const dto = await http.request<void>({
        url: API_ROUTES.KEYCLOAK_LOGOUT,
        method: "POST",
        body,
        withCredentials: false,
        timeoutMs: 15000,
        signal,
      });

      
    },
  };
}


const httpClient = createApiClient(import.meta.env.VITE_API_BACKEND_URL ?? "");
export const authRepository: AuthRepository = createAuthRepository(httpClient);