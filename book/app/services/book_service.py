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
            raise BadRequest('Error al crear libro: ' + str(e))
    
    def map_book_from_request(self, book_data):
        book = Book(
            isbn=book_data.get('isbn'),
            title=book_data.get('title'),
            publication_date=datetime.strptime(book_data.get('publication_date'), '%Y-%m-%d').date() if book_data.get('publication_date') else None,
            stock=book_data.get('stock'),
            id_author=book_data.get('id_author'),
            id_editorial=book_data.get('id_editorial'),
            status=book_data.get('status')
        )
        book.id_book = book_data.get('id_book')
        return book
    
    def validate_isbn(self, book):
        if not book.isbn:
            raise BadRequest("ISBN es requerido")
        
        book_with_same_isbn = BookRepository.get_book_by_isbn(book.isbn)
        if book_with_same_isbn:
            raise BadRequest("Un libro con el mismo ISBN ya existe")

    def validate_book(self, book):
        if not book:
            raise BadRequest("La información del libro es requerida")
        if not book.isbn:
            raise BadRequest("ISBN es requerida")
        if not book.title:
            raise BadRequest("Titulo es requerida")
        if not book.publication_date:
            raise BadRequest("Fecha de publicación es requerida")
        if book.stock is None or book.stock < 0:
            raise BadRequest("El stock es requerido y no puede ser negativo")
        if not book.id_author:
            raise BadRequest("El ID del autor es requerido")
        if not book.id_editorial:
            raise BadRequest("El ID de la editorial es requerido")
        
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
            raise BadRequest('Error al actualizar el libro: ' + str(e))

    def delete_book(self, book_id):
        try:
            book = BookRepository.get_book_entity_by_id(book_id)

            if not book:
                raise BadRequest("El libro no existe")

            has_loans = BookRepository.has_loans(book_id)

            if has_loans:
                raise BadRequest("No se puede eliminar el libro porque tiene préstamos asociados")

            BookRepository.delete_book(book_id)

        except BadRequest:
            raise
        except Exception as e:
            current_app.logger.error(f'Error deleting book: {str(e)}')
            raise BadRequest('Error al eliminar el libro: ' + str(e))