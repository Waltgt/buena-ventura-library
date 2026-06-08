
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../application/useCases/loginUser";
import { authRepository } from "../infrastructure/repositories/AuthRepositoryImpl";
import { useAuthStore } from "../store/authStore";

type LoginVars = { username: string; password: string; signal?: AbortSignal }

export const useLogin = () => {
  const setUser = useAuthStore((state) => state.setUser);
  // const setPermissionsLoaded = useAuthStore((state) => state.)
  return useMutation({
    mutationFn: ({ username, password, signal}: LoginVars) =>
      loginUser(authRepository,username, password, signal),

    onSuccess: (user) => {
      setUser(user);
      // setPermissionsLoaded(true);
    },
  });
};
