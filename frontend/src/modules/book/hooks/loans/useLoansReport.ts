import { useMutation } from "@tanstack/react-query";
import { loanRepository } from "../../infrastructure/repositories/LoanRepositoryImpl";
import type { ReportExportParams } from "../../types/ReportTypes";

export const useLoansReport = () => {
    return useMutation({
        mutationFn: (params: ReportExportParams) =>
            loanRepository.getLoansReport(params)
    });
};