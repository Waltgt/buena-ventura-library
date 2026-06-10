import type { LoanStatusCode } from "../../types/LoanTypes";

export type Loan = {
    id: number;
    expectedReturnDate: string;
    realReturnDate: string;
    status: LoanStatusCode
    book: {
        title: string;
        id: number;
        isbn: string;
    },
    user: {
        id: number;
        name: string;
    }
}