from flask import Blueprint, request, jsonify, current_app
from werkzeug.exceptions import BadRequest
from app.services.user_service import UserService
from app.enums.rol_name import RolName
from flasgger import swag_from

user_bp = Blueprint('user', __name__, url_prefix='/api/user')

@user_bp.route('/<user_name>', methods=['GET'])
@swag_from('../docs/user/validate_admin_user.yml')
def validate_admin_user(user_name):
    try:
        user_service = UserService()
        user = user_service.validate_credential(user_name, RolName.ADMIN.value)
        if user:
            return jsonify({'message': 'User is valid'}), 200
    except Exception as e:
        current_app.logger.error(f"Error validating admin user: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'message': str(e) if current_app.debug else 'An unexpected error occurred',
            'error_type': 'InternalError'
        }), 500

@user_bp.route('/findByUsername/<username>', methods=['GET'])
@swag_from('../docs/user/find_user_by_username.yml')
def find_user_by_username(username):
    try:
        user_service = UserService()
        user_found = user_service.get_user_by_username(username)
        if user_found:
            return jsonify({
                'success': True,
                'data': user_found.to_dict(),
                'message': 'User found successfully'
            }), 200
        else:
            return jsonify({
                'success': False,
                'data': None,
                'message': 'User not found'
            }), 404
    except Exception as e:
        current_app.logger.error(f"Error finding user by username: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'message': str(e) if current_app.debug else 'An unexpected error occurred',
            'error_type': 'InternalError'
        }), 500
        
@user_bp.route('/', methods=['POST'])
@swag_from('../docs/user/create_user.yml')
def create_user():
    try:
        user_data = request.get_json()
        if not user_data:
            return jsonify({
                'success': False,
                'message': 'No se proporcionaron datos'
            }), 400
        user_service = UserService()
        user = user_service.create_user(user_data)
        
        return jsonify({
            'success': True,
            'message': 'Usuario creado exitosamente',
            'data': user.to_dict()
        }), 201
    except BadRequest as e:
        current_app.logger.warning(f"Bad request error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Bad request',
            'message': str(e),
            'error_type': 'BadRequest'
        }), 400
    except Exception as e:
        current_app.logger.error(f"Error creating user: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'message': str(e) if current_app.debug else 'An unexpected error occurred',
            'error_type': 'InternalError'
        }), 500

@user_bp.route('', methods=['PUT'])
@swag_from('../docs/user/update_user.yml')
def update_user():
    try:
        user_data = request.get_json()
        if not user_data:
            return jsonify({
                'success': False,
                'message': 'No se proporcionaron datos'
            }), 400
            
        user_service = UserService()
        user = user_service.update_user(user_data)
        return jsonify({
            'success': True,
            'message': 'Usuario actualizado exitosamente',
            'data': user.to_dict()
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error updating user: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'message': str(e) if current_app.debug else 'An unexpected error occurred',
            'error_type': 'InternalError'
        }), 500

@user_bp.route('', methods=['GET'])
@swag_from('../docs/user/get_all_users.yml')
def get_all_users():
    try:
        user_service = UserService()
        users = user_service.get_all_users()
        

        users_data = [user.to_dict() for user in users]
        
        return jsonify({
            'success': True,
            'data': users_data,
            'count': len(users_data),
            'message': 'Users retrieved successfully'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Error retrieving users'
        }), 500
        


@user_bp.route('/<int:user_id>', methods=['DELETE'])
@swag_from('../docs/user/delete_user.yml')
def delete_user(user_id):
    try:

        
        user_service = UserService()
        deleted_user = user_service.delete_user(str(user_id))
        
        return jsonify({
            'success': True,
            'message': f'Usuario {deleted_user.username} eliminado exitosamente',
            'data': deleted_user.to_dict()
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error deleting user: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'message': str(e) if current_app.debug else 'An unexpected error occurred',
            'error_type': 'InternalError'
        }), 500