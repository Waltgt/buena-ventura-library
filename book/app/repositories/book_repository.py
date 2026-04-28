from app import db
from app.models.book import Book
class BookRepository:
    @staticmethod
    def get_all_books():
        return Book.query.all()

    @staticmethod
    def get_book_by_id(book_id):
        return Book.query.get(book_id)

    @staticmethod
    def create_book(isbn, titel, publication_date, stock, id_author, id_editorial):
        try:
            new_book = Book(isbn=isbn, titel=titel, publication_date=publication_date, stock=stock, id_author=id_author, id_editorial=id_editorial)
            db.session.add(new_book)
            db.session.commit()
            return new_book
        except Exception as e:
            db.session.rollback()
            raise e

    @staticmethod
    def update_book(book_id, isbn=None, titel=None, publication_date=None, stock=None, id_author=None, id_editorial=None):
        try:
            book = Book.query.get(book_id)
            if book:
                if titel is not None:
                    book.titel = titel
                if publication_date is not None:
                    book.publication_date = publication_date
                if stock is not None:
                    book.stock = stock
                if id_author is not None:
                    book.id_author = id_author
                if id_editorial is not None:
                    book.id_editorial = id_editorial
                db.session.commit()
            return book
        except Exception as e:
            db.session.rollback()
            raise e

    @staticmethod
    def delete_book(book_id):
        try:
            book = Book.query.get(book_id)
            if book:
                db.session.delete(book)
                db.session.commit()
            return book
        except Exception as e:
            db.session.rollback()
            raise e