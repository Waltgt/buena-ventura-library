import { useQuery } from "@tanstack/react-query";
import { bookRepository } from "../../infrastructure/repositories/BookRepositoryImpl";

export const useBooks = () => {
  return useQuery({
    queryKey: ["book"],
    queryFn: async ({ signal }) => {
      return await bookRepository.getAllBooks(signal)
    },
  });
};