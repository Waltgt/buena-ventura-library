import { useAuthStore } from "../store/authStore";
import { refreshAccessToken } from "../application/useCases/refreshAccessToken";
import { authRepository } from "../infrastructure/repositories/AuthRepositoryImpl";

let isRefreshing = false;
let queue: (() => void)[] = [];

export async function getValidAccessToken() {
  const user = useAuthStore.getState().user;

  const accessToken = user?.tokenMetadata?.accessToken;
  const refreshToken = user?.tokenMetadata?.refreshToken;
  const expiresAt = user?.tokenMetadata?.accessTokenExpiresAt;

  if (!accessToken || !refreshToken) return null;

  const isExpired =
    !expiresAt || Date.now() >= expiresAt;

  if (!isExpired) {
    return accessToken;
  }

  if (isRefreshing) {
    await new Promise<void>((resolve) => queue.push(resolve));
    return useAuthStore.getState().user?.tokenMetadata?.accessToken;
  }

  isRefreshing = true;
  try {
    const newTokens = await refreshAccessToken(authRepository, refreshToken);

    useAuthStore.getState().updateToken(newTokens);

    queue.forEach((r) => r());
    queue = [];

    return newTokens.accessToken;
  } catch (err) {
    useAuthStore.getState().logout();
    return null;
  } finally {
    isRefreshing = false;
  }
}