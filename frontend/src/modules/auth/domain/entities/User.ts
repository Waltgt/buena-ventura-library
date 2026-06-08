import type { KeycloakToken } from "./KeycloakToken";
import type { Permission } from "./Permissions";
export type User = {
  idKeycloak: string;
  username: string;
  roles: string[];
  permissions: Permission[];
  tokenMetadata?: KeycloakToken;
  fullname: string;
};
