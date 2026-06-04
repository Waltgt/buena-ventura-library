from flask import Blueprint, request, jsonify, current_app
from werkzeug.exceptions import BadRequest
from app.services.book_service import BookService

book_bp = Blueprint('book', __name__, url_prefix='/api/book')

@book_bp.route('/<int:book_id>', methods=['GET'])
def get_book_by_id(book_id):
    book_service = BookService()
    book = book_service.get_book_by_id(book_id)
    if book:
        return jsonify({
        'success': True,
        'data': book.to_dict(),
        'count': 1,
        'message': 'Book retrieved successfully'
        }), 200
    else:
        return jsonify({
            'success': True,
            'data': [],
            'count': 0,
            'message': 'No book found with the given ID: ' + str(book_id)
        }), 200 
    
@book_bp.route('', methods=['GET'])
def get_all_books():
    book_service = BookService()
    books = book_service.get_all_books()
    if not books:
        return jsonify({
            'success': True,
            'data': [],
            'count': 0,
            'message': 'No books found'
        }), 200 
    
    books_data = get_book_data_from_response(books)
    return jsonify({
        'success': True,
        'data': books_data,
        'count': len(books_data),
        'message': 'Books retrieved successfully'
    }), 200

@book_bp.route('', methods=['POST'])
def create_book():
    try:
        book_data = request.get_json()
        
        book_service = BookService()
        new_book = book_service.create_book(book_data)
        
        return jsonify({
            'success': True,
            'data': new_book.to_dict(),
            'message': 'Book created successfully'
        }), 201
        
    except BadRequest as e:
        return jsonify({
            'success': False,
            'error': e.description,
            'message': 'Validation error',
            'error_type': 'BadRequest'
        }), 400
        
    except Exception as e:
        current_app.logger.error(f"Error creating book: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'message': str(e) if current_app.debug else 'An unexpected error occurred',
            'error_type': 'InternalError'
        }), 500

@book_bp.route('', methods=['PUT'])
def update_book():
    try:
        book_data = request.get_json()
        
        book_service = BookService()
        book_updated = book_service.update_book(book_data)
        
        return jsonify({
            'success': True,
            'data': book_updated.to_dict(),
            'message': 'Book updated successfully'
        }), 200
        
    except BadRequest as e:
        return jsonify({
            'success': False,
            'error': e.description,
            'message': 'Validation error',
            'error_type': 'BadRequest'
        }), 400
        
    except Exception as e:
        current_app.logger.error(f"Error updating book: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'message': str(e) if current_app.debug else 'An unexpected error occurred',
            'error_type': 'InternalError'
        }), 500

@book_bp.route('/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    try:
        book_service = BookService()
        book_service.delete_book(book_id)
        return jsonify({
            'success': True,
            'message': 'Book deleted successfully'
        }), 200
        
    except BadRequest as e:
        return jsonify({
            'success': False,
            'error': e.description,
            'message': 'Validation error',
            'error_type': 'BadRequest'
        }), 400
        
    except Exception as e:
        current_app.logger.error(f"Error deleting book: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'message': str(e) if current_app.debug else 'An unexpected error occurred',
            'error_type': 'InternalError'
        }), 500

@book_bp.before_request
def log_request():
    current_app.logger.info(f"Request: {request.method} {request.path}")

def get_book_data_from_response(books):
    return [book.to_dict() for book in books]