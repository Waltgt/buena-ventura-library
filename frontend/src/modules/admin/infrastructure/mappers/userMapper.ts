import type { User } from "../../domain/entities/User";
import type {
  UserResponseDTO
} from "../../domain/dto/UserDTO";

export function userToDomain(dto: UserResponseDTO): User {
  return {
    id: dto.id_user,
    role: {
      id: dto.id_rol,
      name: dto.rol_name
    },
    email: dto.email,
    personId: dto.identification_number,
    name: dto.customer_name,
    lastname: dto.customer_last_name,
    fullname: `${dto.customer_name} ${dto.customer_last_name}`,
    phone: dto.phone_number,
    username: dto.username
  };
}

export function usersToDomain(dtos: UserResponseDTO[]): User[] {
  return dtos.map(userToDomain);
}

