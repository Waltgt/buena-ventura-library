from app.repositories.loan_repository import LoanRepository


class ReportService:

    def search_loans(self, isbn=None, title=None, user=None):
        if isbn:
            loans = LoanRepository.get_loans_by_book_isbn(isbn)
        elif title:
            loans = LoanRepository.get_loans_by_book_title(title)
        elif user:
            loans = LoanRepository.get_loans_by_user_name(user)
        else:
            loans = LoanRepository.get_all_loans()
        return loans if loans else []

    def get_loans_by_book(self, book_id):
        loans = LoanRepository.get_loans_by_book_id(book_id)
        return loans if loans else []

    def get_loans_by_user(self, user_id):
        loans = LoanRepository.get_loans_by_user_id(user_id)
        return loans if loans else []
