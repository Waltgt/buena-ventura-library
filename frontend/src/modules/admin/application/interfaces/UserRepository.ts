
import type { User } from "../../domain/entities/User";
import type { UserRequestParams } from "../../types/UserTypes";

export interface UserRepository {
    getAllUsers(signal?: AbortSignal): Promise<User[]>;
    // revokeUser(id: number, signal?: AbortSignal): Promise<User>;
    getUserById(id: number, signal?: AbortSignal): Promise<User>
    createUser(params: UserRequestParams, signal?: AbortSignal): Promise<User>
    updateUser(params: UserRequestParams, signal?: AbortSignal): Promise<User>    
}