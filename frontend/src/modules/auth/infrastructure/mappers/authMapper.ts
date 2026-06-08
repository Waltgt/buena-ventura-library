import type { User } from "../../domain/entities/User";
import type {
  LoginRequestDTO,
  LoginResponseDTO
} from "../../domain/dto/LoginDTO";


export function loginDtoToUser(dto: LoginResponseDTO): User {

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
