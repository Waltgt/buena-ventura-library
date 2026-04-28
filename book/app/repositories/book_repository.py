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
    def create_book(book):
        try:
            db.session.add(book)
            db.session.commit()
            return book
        except Exception as e:
            db.session.rollback()
            raise e

    @staticmethod
    def update_book(bookUpdate):
        try:
            book = Book.query.get(bookUpdate.book_id)
            if book:
                if bookUpdate.title is not None:
                    book.title = bookUpdate.title
                if bookUpdate.publication_date is not None:
                    book.publication_date = bookUpdate.publication_date
                if bookUpdate.stock is not None:
                    book.stock = bookUpdate.stock
                if bookUpdate.id_author is not None:
                    book.id_author = bookUpdate.id_author
                if bookUpdate.id_editorial is not None:
                    book.id_editorial = bookUpdate.id_editorial
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