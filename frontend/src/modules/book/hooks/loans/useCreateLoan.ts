import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loanRepository } from "../../infrastructure/repositories/LoanRepositoryImpl";
import type { LoanRequestParams } from "../../types/LoanTypes";


export const useCreateLoan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: LoanRequestParams) =>
      loanRepository.createLoan(params),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loan"] });
    },
  });
};
