import type { Loan } from "../../domain/entities/Loan";
import type { LoanRequestParams } from "../../types/LoanTypes";
import type { ReportExportParams } from "../../types/ReportTypes";


export interface LoanRepository {
    getAllLoans(signal?: AbortSignal): Promise<Loan[]>;
    getLoanById(loanId: number, signal?: AbortSignal): Promise<Loan>;
    createLoan(params: LoanRequestParams, signal?: AbortSignal): Promise<Loan>;
    returnLoan(loanId: number, signal?: AbortSignal): Promise<Loan>;

    getLoansByUser(userId: number, signal?: AbortSignal): Promise<Loan[]>;
    getLoansByBook(bookId: number, signal?: AbortSignal): Promise<Loan[]>;
    getAuthUserLoans(signal?: AbortSignal): Promise<Loan[]>;
    getLoansReport(params: ReportExportParams, signal?: AbortSignal): Promise<Blob>;
}