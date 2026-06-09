
export const API_ROUTES = {
  // AUTH ENDPOINTS
  AUTH_LOGIN: '/api/auth/login',
  // USERS
  USER_ENDPOINT: '/api/user',
  // books
  BOOK_ENDPOINT: '/api/book',
  // loan
  LOAN_ENDPOINT: '/api/loan',
  LOAN_REPORT: '/api/loans',
  LOAN_GET_ALL_BY_USER: '/api/report/loans/user',
  LOAN_GET_ALL_BY_BOOK: '/api/report/loans/book',
  LOAN_RETURN: (id: number) => `/api/loan/${id}/return`,
} as const;