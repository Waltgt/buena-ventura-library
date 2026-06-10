import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loanRepository } from "../../infrastructure/repositories/LoanRepositoryImpl";


export const useReturnLoan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => loanRepository.returnLoan(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loans"] });
    },
  });
};
