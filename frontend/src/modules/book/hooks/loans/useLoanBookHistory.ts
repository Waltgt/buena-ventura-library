import { useQuery } from "@tanstack/react-query";
import { loanRepository } from "../../infrastructure/repositories/LoanRepositoryImpl";

export const useLoanBookHistory = (id: number) => {
  return useQuery({
    queryKey: ["loan-book-history"],
    queryFn: async ({ signal }) => {
      return await loanRepository.getLoansByBook(id, signal)
    },
  });
};