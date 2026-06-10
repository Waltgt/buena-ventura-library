import { useQuery } from "@tanstack/react-query";
import { loanRepository } from "../../infrastructure/repositories/LoanRepositoryImpl";

export const useLoansByAuthUser = () => {
  return useQuery({
    queryKey: ["loans"],
    queryFn: async ({ signal }) => {
      return await loanRepository.getAuthUserLoans(signal)
    },
  });
};