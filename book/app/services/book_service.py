from app.repositories.book_repository import BookRepository
from werkzeug.exceptions import BadRequest
from flask import current_app
from app.models.book import Book
from datetime import datetime


class BookService:

    def get_all_books(self):
        books = BookRepository.get_all_books()
        if not books:
            return []
        return books

    def get_book_by_id(self,book_id):
         book = BookRepository.get_book_by_id(book_id)
         if not book:
            return []
         return book

    def create_book(self, book_data):
        
        try:
            new_book = self.map_book_from_request(book_data)
            
            self.validate_book(new_book)
            self.validate_isbn(new_book)
            book_created = BookRepository.create_book(new_book)
            return book_created
        except Exception as e:
            current_app.logger.error(f'Error al crear libro: {str(e)}')
            raise BadRequest('Book creation failed: ' + str(e))
    
    def map_book_from_request(self, book_data):
        book = Book(
            isbn=book_data.get('isbn'),
            title=book_data.get('title'),
            publication_date=datetime.strptime(book_data.get('publication_date'), '%Y-%m-%d').date() if book_data.get('publication_date') else None,
            stock=book_data.get('stock'),
            id_author=book_data.get('id_author'),
            id_editorial=book_data.get('id_editorial')
        )
        book.id_book = book_data.get('id_book')
        return book
    
    def validate_isbn(self, book):
        if not book.isbn:
            raise BadRequest("ISBN is required")
        
        book_with_same_isbn = BookRepository.get_book_by_isbn(book.isbn)
        if book_with_same_isbn:
            raise BadRequest("A book with the same ISBN already exists")

    def validate_book(self, book):
        if not book:
            raise BadRequest("Book data is required")
        if not book.isbn:
            raise BadRequest("ISBN is required")
        if not book.title:
            raise BadRequest("Title is required")
        if not book.publication_date:
            raise BadRequest("Publication date is required")
        if book.stock is None or book.stock < 0:
            raise BadRequest("Stock is required and cannot be negative")
        if not book.id_author:
            raise BadRequest("Author ID is required")
        if not book.id_editorial:
            raise BadRequest("Editorial ID is required")
        
    def update_book(self, book_data):
        try:
            book = self.map_book_from_request(book_data)
            if not book.id_book:
                raise BadRequest("El campo 'id_book' es obligatorio para actualizar")
            self.validate_book(book)
            updated_book = BookRepository.update_book(book)
            if not updated_book:
                raise BadRequest("El libro no existe")
            return updated_book
        except BadRequest:
            raise
        except Exception as e:
            current_app.logger.error(f'Error updating book: {str(e)}')
            raise BadRequest('Book update failed: ' + str(e))

    def delete_book(self, book_id):
        try:
            BookRepository.delete_book(book_id)
        except Exception as e:
            current_app.logger.error(f'Error deleting book: {str(e)}')
            raise BadRequest('Book deletion failed: ' + str(e))