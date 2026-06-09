import type { Loan } from "../../domain/entities/Loan";
import type { ReportExportParams } from "../../types/ReportTypes";

export interface ReportRepository {
    getLoansByUser(userId: number, signal?: AbortSignal): Promise<Loan[]>;
    getLoansByBook(bookId: number, signal?: AbortSignal): Promise<Loan[]>;
    getLoansReport(params: ReportExportParams, signal?: AbortSignal): Promise<Blob>;
}