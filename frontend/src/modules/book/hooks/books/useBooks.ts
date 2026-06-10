import { useQuery } from "@tanstack/react-query";
import { bookRepository } from "../../infrastructure/repositories/BookRepositoryImpl";

export const useBooks = (
  options?: {
    enabled?: boolean;
  }) => {
  return useQuery({
    queryKey: ["book"],
    enabled:
      options?.enabled !== undefined
        ? options.enabled
        : true,
    queryFn: async ({ signal }) => {
      return await bookRepository.getAllBooks(signal)
    },
  });
};