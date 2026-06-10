from datetime import datetime
from flask import current_app
from werkzeug.exceptions import BadRequest, NotFound

from app.models.loan import Loan
from app.repositories.loan_repository import LoanRepository
from app.repositories.loan_status_repository import LoanStatusRepository
from app.repositories.book_repository import BookRepository
from app.repositories.user_repository import UserRepository
from app.enums.loan_status_code import LoanStatusCode


class LoanService:

    def get_all_loans(self):
        loans = LoanRepository.get_all_loans()
        return loans if loans else []

    def get_loan_by_id(self, loan_id):
        loan = LoanRepository.get_loan_by_id(loan_id)
        if not loan:
            return None
        return loan

    def create_loan(self, loan_data):
        try:
            loan = self.map_loan_from_request(loan_data)
            self.validate_loan(loan)

            book = book = BookRepository.get_book_entity_by_id(loan.id_book)
            self.validate_book_available(book)
            self.validate_user_exists(loan.id_user_loan)
            self.validate_user_has_no_active_loan(loan.id_user_loan)
            self.validate_book_not_assigned_same_day(loan.id_book, loan.delivery_date)

            loan.id_loan_status = self.get_status_id(LoanStatusCode.ACTIVE.value)
            return LoanRepository.create_loan(loan, book)
        except (BadRequest, NotFound):
            raise
        except Exception as e:
            current_app.logger.error(f'Error al crear prestamo: {str(e)}')
            raise BadRequest('Error al crear el préstamo: ' + str(e))

    def return_loan(self, loan_id):
        try:
            loan = LoanRepository.get_loan_by_id(loan_id)
            if not loan:
                raise NotFound("Prestamo no encontrado")
            if loan.real_return_date is not None:
                raise BadRequest("El prestamo ya fue devuelto")

            book = book = BookRepository.get_book_entity_by_id(loan.id_book)
            returned_status_id = self.get_status_id(LoanStatusCode.RETURNED.value)
            return LoanRepository.return_loan(loan, book, returned_status_id)
        except (BadRequest, NotFound):
            raise
        except Exception as e:
            current_app.logger.error(f'Error al devolver prestamo: {str(e)}')
            raise BadRequest('Error al devolver el préstamo: ' + str(e))

    def map_loan_from_request(self, loan_data):
        delivery_raw = loan_data.get('delivery_date')
        delivery_date = datetime.strptime(delivery_raw, '%Y-%m-%d') if delivery_raw else datetime.now()

        expected_raw = loan_data.get('expected_return_date')
        expected_return_date = datetime.strptime(expected_raw, '%Y-%m-%d') if expected_raw else None

        return Loan(
            id_book=loan_data.get('id_book'),
            id_user_loan=loan_data.get('id_user_loan'),
            delivery_date=delivery_date,
            expected_return_date=expected_return_date,
            id_loan_status=None,
            id_user_register=loan_data.get('id_user_register')
        )

    def validate_loan(self, loan):
        if not loan.id_book:
            raise BadRequest("El campo 'id_book' es obligatorio")
        if not loan.id_user_loan:
            raise BadRequest("El campo 'id_user_loan' es obligatorio")
        if not loan.id_user_register:
            raise BadRequest("El campo 'id_user_register' es obligatorio")
        if not loan.expected_return_date:
            raise BadRequest("La fecha de devolucion esperada es obligatoria")

    def validate_book_available(self, book):
        if not book:
            raise BadRequest("El libro no existe")
        if book.stock is None or book.stock <= 0:
            raise BadRequest("No hay ejemplares disponibles del libro")

    def validate_user_exists(self, id_user_loan):
        user = UserRepository.get_user_by_id(id_user_loan)
        if not user:
            raise BadRequest("El usuario no existe")

    def validate_user_has_no_active_loan(self, id_user_loan):
        active_loan = LoanRepository.get_active_loan_by_user(id_user_loan)
        if active_loan:
            raise BadRequest("El usuario ya tiene un libro prestado")

    def validate_book_not_assigned_same_day(self, id_book, delivery_date):
        existing = LoanRepository.get_loan_by_book_and_date(id_book, delivery_date.date())
        if existing:
            raise BadRequest("El libro ya fue asignado a otra persona el mismo dia")

    def get_status_id(self, code):
        status = LoanStatusRepository.get_by_code(code)
        if not status:
            raise BadRequest(f"El estado de prestamo '{code}' no esta configurado")
        return status.id_loan_status
