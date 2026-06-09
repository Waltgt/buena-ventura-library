import { useQuery } from "@tanstack/react-query";
import { loanRepository } from "../../infrastructure/repositories/LoanRepositoryImpl";

export const useLoans = () => {
  return useQuery({
    queryKey: ["book"],
    queryFn: async ({ signal }) => {
      return await loanRepository.getAllLoans(signal)
    },
  });
};