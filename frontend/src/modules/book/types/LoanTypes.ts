export type LoanRequestParams = {
    delivery_date: string;
    expected_return_date: string
    id_book: number;
    id_user_loan: number;
    id_user_register: number;
}

export type LoanStatusCode = 'ACT' | 'DEV' | 'VENC';

export const LoanStatusMap: Record<LoanStatusCode, string> = {
  ACT: 'Activo - Préstamo vigente',
  DEV: 'Devuelto - Libro regresado a la biblioteca',
  VENC: 'Vencido - Fecha de devolución excedida',
};