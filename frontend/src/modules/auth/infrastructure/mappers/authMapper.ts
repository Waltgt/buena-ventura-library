import type { User } from "../../domain/entities/User";
import type { KeycloakToken } from "../../domain/entities/KeycloakToken";

import type { LoginResponseDto } from "../../domain/dto/authLogin.dto";
import type { RefreshResponseDto } from "../../domain/dto/authRefresh.dto";

import { parseJwtPayload } from "@/shared/utils/jwt";

export function loginDtoToUser(dto: LoginResponseDto): User {

  console.log(dto)
  const payload = parseJwtPayload(dto.access_token);

  console.log(payload)

  return {
    idKeycloak: payload?.sub ?? "",
    fullname: payload?.name ?? "",
    username: payload?.preferred_username ?? "",
    roles: payload?.realm_access?.roles ?? [],
    permissions: [],
    tokenMetadata: {
      accessToken: dto.access_token,
      accessTokenExpiresIn: dto.expires_in,
      refreshToken: dto.refresh_token,
      accessTokenExpiresAt: Date.now() + dto.expires_in * 1000,
      tokenType: dto.token_type,
      scope: dto.scope,
    }
  };
}

export function refreshDtoToTokenMetadata(
  dto: RefreshResponseDto
): KeycloakToken {

  return {
    accessToken: dto.access_token,
    accessTokenExpiresIn: dto.expires_in,
    refreshToken: dto.refresh_token,

    accessTokenExpiresAt:
      Date.now() + dto.expires_in * 1000,

    tokenType: dto.token_type,
    scope: dto.scope,
  }
}