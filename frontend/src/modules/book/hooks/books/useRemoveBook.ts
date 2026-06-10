import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookRepository } from "../../infrastructure/repositories/BookRepositoryImpl";

export const useRemoveBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      bookRepository.removeBook(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["book"] });
    },
  });
};