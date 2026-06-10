import { useQuery } from "@tanstack/react-query";
import { bookRepository } from "../../infrastructure/repositories/BookRepositoryImpl";

export const useBookById = (
  id: number,
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery({
    queryKey: ["bookById", id],
    enabled:
      options?.enabled !== undefined
        ? options.enabled
        : true,
    queryFn: async ({ signal }) => {
      return await bookRepository.getBookById(id, signal)
    },
  });
};