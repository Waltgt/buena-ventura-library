from flask import Blueprint, request, jsonify, current_app
from werkzeug.exceptions import BadRequest, Unauthorized
from app.services.user_service import UserService
from flasgger import swag_from

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/login', methods=['POST'])
@swag_from('../docs/auth/login.yml')
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                'success': False,
                'message': 'No se proporcionaron datos'
            }), 400

        user_service = UserService()
        user = user_service.authenticate(data.get('username'), data.get('password'))

        return jsonify({
            'success': True,
            'message': 'Autenticación exitosa',
            'data': user.to_dict()
        }), 200

    except BadRequest as e:
        return jsonify({
            'success': False,
            'error': 'Bad request',
            'message': e.description,
            'error_type': 'BadRequest'
        }), 400

    except Unauthorized as e:
        return jsonify({
            'success': False,
            'error': 'Unauthorized',
            'message': e.description,
            'error_type': 'Unauthorized'
        }), 401

    except Exception as e:
        current_app.logger.error(f"Error en login: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'message': str(e) if current_app.debug else 'An unexpected error occurred',
            'error_type': 'InternalError'
        }), 500


@auth_bp.route('/logout', methods=['POST'])
@swag_from('../docs/auth/logout.yml')
def logout():
    return jsonify({
        'success': True,
        'message': 'Sesión cerrada exitosamente'
    }), 200
