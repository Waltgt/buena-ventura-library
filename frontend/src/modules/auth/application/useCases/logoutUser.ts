import type { AuthRepository } from "../interfaces/AuthRepository";

export const logoutUser = async (
    repo: AuthRepository,
    refreshToken: string
) => {
    await repo.logout(refreshToken);
};