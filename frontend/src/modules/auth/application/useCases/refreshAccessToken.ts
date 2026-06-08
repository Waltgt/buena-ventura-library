import type { AuthRepository } from "../interfaces/AuthRepository";

export const refreshAccessToken = async (
  repo: AuthRepository,
  refreshToken: string
) => {
  const tokenMetadata = await repo.refresh(refreshToken);

  if (!tokenMetadata.accessToken) {
    throw new Error("Refresh sin access token");
  }

  return tokenMetadata;
};