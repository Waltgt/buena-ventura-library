import { useMutation } from "@tanstack/react-query";

import { logoutUser } from "../application/useCases/logoutUser";
import { authRepository } from "../infrastructure/repositories/AuthRepositoryImpl";
import { useAuthStore } from "../store/authStore";

export const useLogout = () => {
  const clearSession = useAuthStore(
    (state) => state.logout
  );

  return useMutation({
    mutationFn: async () => {
      const refreshToken =
        useAuthStore.getState().user?.tokenMetadata
          ?.refreshToken;

      if (!refreshToken) return;

      await logoutUser(
        authRepository,
        refreshToken
      );
    },

    onSettled: () => {
      clearSession();
    },
  });
};