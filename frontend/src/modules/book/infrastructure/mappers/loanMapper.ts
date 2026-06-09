import type { Loan } from "../../domain/entities/Loan";
import type {
  LoanResponseDTO
} from "../../domain/dto/LoanDTO";

export function loanToDomain(dto: LoanResponseDTO): Loan {
  return {
    id: dto.id_loan,
    expectedReturnDate: dto.expected_return_date,
    realReturnDate: dto.real_return_date ?? "",
    status: dto.status_code,
    book: {
        title: dto.book_title,
        id: dto.id_book,
        isbn: dto.isbn
    },
    user: {
        id: dto.id_user_loan,
        name: dto.user_loan_name
    }
  };
}

export function loansToDomain(dtos: LoanResponseDTO[]): Loan[] {
  return dtos.map(loanToDomain);
}

