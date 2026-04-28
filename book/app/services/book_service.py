from .book_repository import BookRepository
from werkzeug.exceptions import BadRequest, NotFound
from flask import current_app

class BookService:

    def get_all_books():
        book = BookRepository.get_all_books()
        if not book:
            raise NotFound("No books found")
        return book

    def get_book_by_id(book_id):
         book = BookRepository.get_book_by_id(book_id)
         if not book:
            raise NotFound("Book not found with ID: " + str(book_id))
         return book

    def create_book(self, book):
        self.validate_book(book)
        self.validate_isbn(book)
        try:
            new_book = BookRepository.create_book(isbn=book.isbn, titel=book.titel, publication_date=book.publication_date, stock=book.stock, id_author=book.id_author, id_editorial=book.id_editorial)
            return new_book
        except Exception as e:
            current_app.logger.error(f'Error al crear libro: {str(e)}')
            raise BadRequest('No se pudo crear el libro. Verifique los datos')
    
    def validate_isbn(self, book):
        if not book.isbn:
            raise BadRequest("ISBN is required")
        
        book_with_same_isbn = BookRepository.get_book_by_isbn(book.isbn)
        if book_with_same_isbn:
            raise BadRequest("A book with the same ISBN already exists")
       

    def update_book(self, book):   
        self.validate_book(book)
        BookRepository.update_book(book)



    def validate_book(self, book):
        if not book:
            raise BadRequest("Book data is required")
        if not book.isbn:
            raise BadRequest("ISBN is required")
        if not book.title:
            raise BadRequest("Title is required")
        if not book.publication_date:
            raise BadRequest("Publication date is required")
        if book.stock is None or book.stock <= 0:
            raise BadRequest("Stock is required")
        if not book.id_author:
            raise BadRequest("Author ID is required")
        if not book.id_editorial:
            raise BadRequest("Editorial ID is required")

    def delete_book(book_id):
        BookRepository.delete_book(book_id)