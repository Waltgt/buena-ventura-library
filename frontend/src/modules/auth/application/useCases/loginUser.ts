import type { AuthRepository } from "../interfaces/AuthRepository";
// import type { PermissionsRepository } from "@/modules/admin/application/interfaces/PermissionRepository";
import type { User } from "../../domain/entities/User";
import { PERMISSIONS } from "@/shared/utils/permissions";
export const loginUser = async (
  authRepo: AuthRepository,
  // permissionRepo: PermissionsRepository,
  username: string,
  password: string,
  signal?: AbortSignal
) => {

  if (!username || !password) {
    throw new Error("Credenciales requeridas");
  }

  const user = await authRepo.login(
    username,
    password,
    signal
  );

  if (!user?.tokenMetadata?.accessToken) {
    throw new Error("Autenticación fallida");
  }

  
  // const permissions = await permissionRepo.getPermissionsByidKeycloak(user.idKeycloak)
  // if (permissions == null)
  //   throw new Error("Error al obtener permisos del usuario");
  
  // user.permissions = permissions ?? []

  return user;
};