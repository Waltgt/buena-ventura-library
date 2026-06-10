import { useQuery } from "@tanstack/react-query";
import { loanRepository } from "../../infrastructure/repositories/LoanRepositoryImpl";

export const useLoanByUser = (
    id?: number,
    options?: {
        enabled?: boolean;
    }
) => {
    return useQuery({
        queryKey: ["loansByUser", id],
        enabled: !!id && (options?.enabled ?? true),

        queryFn: async ({ signal }) => {
            if (!id) return []
            return await loanRepository.getLoansByUser(id, signal)
        },
    });
};