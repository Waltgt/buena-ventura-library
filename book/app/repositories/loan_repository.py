from datetime import datetime, timedelta
from app import db
from app.models.loan import Loan
from app.models.book import Book
from app.models.user import User

class LoanRepository:

    @staticmethod
    def get_all_loans():
        return Loan.query.all()

    @staticmethod
    def get_loans_by_book_isbn(isbn):
        return Loan.query.join(Book, Loan.id_book == Book.id_book).filter(Book.isbn == isbn).all()

    @staticmethod
    def get_loans_by_book_title(title):
        return Loan.query.join(Book, Loan.id_book == Book.id_book).filter(Book.title.ilike(f"%{title}%")).all()

    @staticmethod
    def get_loans_by_user_name(name):
        return Loan.query.join(User, Loan.id_user_loan == User.id_user).filter(
            (User.customer_name.ilike(f"%{name}%")) | (User.customer_last_name.ilike(f"%{name}%"))
        ).all()

    @staticmethod
    def get_loans_by_book_id(book_id):
        return Loan.query.filter_by(id_book=book_id).all()

    @staticmethod
    def get_loans_by_user_id(user_id):
        return Loan.query.filter_by(id_user_loan=user_id).all()

    @staticmethod
    def get_loan_by_id(loan_id):
        return Loan.query.get(loan_id)

    @staticmethod
    def get_active_loan_by_user(id_user_loan):
        # Un prestamo esta activo mientras no tenga fecha de devolucion real.
        return Loan.query.filter_by(id_user_loan=id_user_loan, real_return_date=None).first()

    @staticmethod
    def get_loan_by_book_and_date(id_book, day):
        # Busca un prestamo de ese libro entregado dentro del dia indicado.
        start = datetime(day.year, day.month, day.day)
        end = start + timedelta(days=1)
        return Loan.query.filter(
            Loan.id_book == id_book,
            Loan.delivery_date >= start,
            Loan.delivery_date < end
        ).first()

    @staticmethod
    def create_loan(loan, book):
        try:
            book.stock = book.stock - 1
            db.session.add(loan)
            db.session.commit()
            return loan
        except Exception as e:
            db.session.rollback()
            raise e

    @staticmethod
    def return_loan(loan, book, returned_status_id):
        try:
            loan.real_return_date = datetime.now()
            loan.id_loan_status = returned_status_id
            book.stock = book.stock + 1
            db.session.commit()
            return loan
        except Exception as e:
            db.session.rollback()
            raise e
