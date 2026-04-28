from .book_repository import BookRepository

class BookService:
    @staticmethod
    def get_all_books():
        try:
            return BookRepository.get_all_books()
        except Exception as e:
            raise e

    @staticmethod
    def get_book_by_id(book_id):
        return BookRepository.query.get(book_id)

    @staticmethod
    def create_book(isbn, titel, publication_date, stock, id_author, id_editorial):
        new_book = BookRepository.create_book(isbn=isbn, titel=titel, publication_date=publication_date, stock=stock, id_author=id_author, id_editorial=id_editorial)
        return new_book

    @staticmethod
    def update_book(book_id, isbn=None, titel=None, publication_date=None, stock=None, id_author=None, id_editorial=None):
        book = BookRepository.query.get(book_id)
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
        return book

    @staticmethod
    def delete_book(book_id):
        BookRepository.delete_book(book_id)