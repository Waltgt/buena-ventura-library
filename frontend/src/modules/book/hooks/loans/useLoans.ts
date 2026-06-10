import { useQuery } from "@tanstack/react-query";
import { loanRepository } from "../../infrastructure/repositories/LoanRepositoryImpl";

export const useLoans = () => {
  return useQuery({
    queryKey: ["loans"],
    queryFn: async ({ signal }) => {
      return await loanRepository.getAllLoans(signal)
    },
  });
};