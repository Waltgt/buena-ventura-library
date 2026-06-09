import csv
import io

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

    def build_loans_csv(self, loans):
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow([
            'ID Prestamo', 'Libro', 'ISBN', 'Usuario', 'Fecha entrega',
            'Fecha devolucion esperada', 'Fecha devolucion real', 'Estado'
        ])
        for loan in loans:
            data = loan.to_dict()
            writer.writerow([
                data.get('id_loan'),
                data.get('book_title'),
                data.get('isbn'),
                data.get('user_loan_name'),
                data.get('delivery_date'),
                data.get('expected_return_date'),
                data.get('real_return_date'),
                data.get('status_code'),
            ])
        return '\ufeff' + output.getvalue()
