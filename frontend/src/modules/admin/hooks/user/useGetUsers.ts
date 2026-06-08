import { useQuery } from "@tanstack/react-query";
import { userRepository } from "@/modules/admin/infrastructure/repositories/UserRepositoryImpl";

export const useGetUsers = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async ({ signal }) => {
      return await userRepository.getAllUsers(signal);
    },
  });
};