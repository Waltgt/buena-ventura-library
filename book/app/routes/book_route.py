from flask import Blueprint, request, jsonify, current_app
from werkzeug.exceptions import BadRequest
from app.services.book_service import BookService
from app.utils.auth import roles_required
from app.enums.rol_name import RolName
from flasgger import swag_from

book_bp = Blueprint('book', __name__, url_prefix='/api/book')


def serialize_book(row):
    book, author, editorial = row

    data = book.to_dict()

    return data


@book_bp.route('/<int:book_id>', methods=['GET'])
@swag_from('../docs/book/get_book_by_id.yml')
def get_book_by_id(book_id):
    book_service = BookService()
    row = book_service.get_book_by_id(book_id)

    if row:
        data = serialize_book(row)

        return jsonify({
            'success': True,
            'data': data,
            'count': 1,
            'message': 'Libro encontrado exitosamente'
        }), 200
    else:
        return jsonify({
            'success': True,
            'data': [],
            'count': 0,
            'message': 'No se encontró un libro con el ID: ' + str(book_id)
        }), 200


@book_bp.route('', methods=['GET'])
@swag_from('../docs/book/get_all_books.yml')
def get_all_books():
    book_service = BookService()
    books = book_service.get_all_books()

    if not books:
        return jsonify({
            'success': True,
            'data': [],
            'count': 0,
            'message': 'No se encontraron libros'
        }), 200

    books_data = [serialize_book(row) for row in books]

    return jsonify({
        'success': True,
        'data': books_data,
        'count': len(books_data),
        'message': 'Libros obtenidos exitosamente'
    }), 200


@book_bp.route('', methods=['POST'])
@roles_required(RolName.GESTOR.value, RolName.ADMIN.value)
@swag_from('../docs/book/create_book.yml')
def create_book():
    try:
        book_data = request.get_json()

        book_service = BookService()
        row = book_service.create_book(book_data)

        data = serialize_book(row)

        return jsonify({
            'success': True,
            'data': data,
            'message': 'Libro creado exitosamente'
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
@roles_required(RolName.GESTOR.value, RolName.ADMIN.value)
@swag_from('../docs/book/update_book.yml')
def update_book():
    try:
        book_data = request.get_json()

        book_service = BookService()
        row = book_service.update_book(book_data)

        data = serialize_book(row)

        return jsonify({
            'success': True,
            'data': data,
            'message': 'Libro actualizado exitosamente'
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
@roles_required(RolName.GESTOR.value, RolName.ADMIN.value)
@swag_from('../docs/book/delete_book.yml')
def delete_book(book_id):
    try:
        book_service = BookService()
        book_service.delete_book(book_id)

        return jsonify({
            'success': True,
            'message': 'Libro eliminado exitosamente'
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