import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookRepository } from "../../infrastructure/repositories/BookRepositoryImpl";
import type { BookRequestParams } from "../../types/BookTypes";


export const useCreateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: BookRequestParams) =>
      bookRepository.createBook(params),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["book"] });
    },
  });
};
