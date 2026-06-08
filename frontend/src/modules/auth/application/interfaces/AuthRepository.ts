import type { User } from "../../domain/entities/User";
import type { KeycloakToken } from "../../domain/entities/KeycloakToken";

export interface AuthRepository {
  login(
    username: string,
    password: string,
    signal?: AbortSignal
  ): Promise<User>;

  refresh(
    refreshToken: string,
    signal?: AbortSignal
  ): Promise<KeycloakToken>;

  logout(
    refreshToken: string,
    signal?: AbortSignal
  ): Promise<void>;
}