export type LoanRequestDTO = {
    delivery_date: string;
    expected_return_date: string
    id_book: number;
    id_user_loan: number;
    id_user_register: number;
}

export type LoanResponseDTO = {
    book_title: string;
    delivery_date: string;
    expected_return_date: string;
    id_book: number;
    id_loan: number;
    id_user_loan: number;
    id_user_register: number;
    isbn: string;
    real_return_date?: string;
    status_code: string;
    user_loan_name: string;
}

export type LoanReportRequestDTO = {
    isbn?: string;
    title?: string;
    user?: string;
    format: 'csv'
}