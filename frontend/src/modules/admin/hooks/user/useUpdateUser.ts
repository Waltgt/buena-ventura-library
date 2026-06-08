import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userRepository } from "@/modules/admin/infrastructure/repositories/UserRepositoryImpl";
import type { UserRequestParams } from "../../types/UserTypes";


export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UserRequestParams) =>
      userRepository.updateUser(params),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};
