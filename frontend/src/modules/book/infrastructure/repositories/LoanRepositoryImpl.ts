
import type { HttpClient } from "@/shared/http/HttpClient";
import type { ApiResponse } from "@/shared/http/ApiResponse";
import { createApiClient } from "@/shared/http/createApiClient";

import type { LoanRepository } from "../../application/interfaces/LoanRepository";

import { API_ROUTES } from "@/shared/utils/apiRoutes";
import type {
    LoanReportRequestDTO,
    LoanRequestDTO,
    LoanResponseDTO,
} from "../../domain/dto/LoanDTO";
import {
    loanToDomain,
    loansToDomain
} from "../mappers/loanMapper";

import { withUserHeader } from "@/shared/utils/withUserHeader";
import { buildQuery } from "@/shared/utils/queryBuilder";


export function createLoanRepository(http: HttpClient): LoanRepository {
    return {


        async getAllLoans(signal) {
            const dto = await http.request<ApiResponse<LoanResponseDTO[]>>({
                url: API_ROUTES.LOAN_ENDPOINT,
                method: "GET",
                signal,
            });

            return loansToDomain(dto.data);
        },
        async getLoanById(id, signal) {
            const dto = await http.request<ApiResponse<LoanResponseDTO>>({
                url: `${API_ROUTES.LOAN_ENDPOINT}/${id}`,
                method: "GET",
                signal,
            });

            return loanToDomain(dto.data);
        },
        async createLoan(params, signal) {

            const body: LoanRequestDTO = { ...params }
            const dto = await http.request<ApiResponse<LoanResponseDTO>>({
                url: API_ROUTES.USER_ENDPOINT,
                method: "POST",
                body,
                ...withUserHeader(),
                withCredentials: false,
                timeoutMs: 15_000,
                signal,
            });

            return loanToDomain(dto.data)
        },

        async returnLoan(id, signal) {

            const dto = await http.request<ApiResponse<LoanResponseDTO>>({
                url: API_ROUTES.LOAN_RETURN(id),
                method: "DELETE",
                ...withUserHeader(),
                withCredentials: false,
                timeoutMs: 15_000,
                signal,
            });

            return loanToDomain(dto.data)
        },
        // Acceso admin
        async getLoansByUser(userId, signal) {
            const dto = await http.request<ApiResponse<LoanResponseDTO[]>>({
                url: `${API_ROUTES.LOAN_GET_ALL_BY_USER}/${userId}`,
                method: "GET",
                ...withUserHeader(),
                signal,
            });

            return loansToDomain(dto.data);
        },

        async getLoansByBook(userId, signal) {
            const dto = await http.request<ApiResponse<LoanResponseDTO[]>>({
                url: `${API_ROUTES.LOAN_GET_ALL_BY_BOOK}/${userId}`,
                method: "GET",
                ...withUserHeader(),
                signal,
            });

            return loansToDomain(dto.data);
        },

        async getLoansReport(params, signal) {

            const query : LoanReportRequestDTO = {
                isbn: params.isbn,
                title: params.title,
                user: params.user,
                format: "csv"
            }

            const queryString = buildQuery(query)

            const file = await http.request<Blob>({
                url: `${API_ROUTES.LOAN_REPORT}/${queryString}`,
                method: "GET",
                responseType: "blob",
                ...withUserHeader(),
                signal,
            });

            return file
        }
    };
}

const httpClient = createApiClient(import.meta.env.VITE_API_BACKEND_URL ?? "");

export const loanRepository: LoanRepository =
    createLoanRepository(httpClient);