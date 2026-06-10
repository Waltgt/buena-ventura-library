import { useQuery } from "@tanstack/react-query";
import { loanRepository } from "../../infrastructure/repositories/LoanRepositoryImpl";

export const useLoanById = (
  id: number,
  options?: {
    enabled?: boolean;
  }) => {
  return useQuery({
    queryKey: ["loansById"],
    enabled:
      options?.enabled !== undefined
        ? options.enabled
        : true,
    queryFn: async ({ signal }) => {
      return await loanRepository.getLoanById(id, signal)
    },
  });
};