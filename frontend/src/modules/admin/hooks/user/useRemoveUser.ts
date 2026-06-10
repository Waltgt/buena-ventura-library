import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userRepository } from "../../infrastructure/repositories/UserRepositoryImpl";

export const useRemoveUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => userRepository.revokeUser(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};