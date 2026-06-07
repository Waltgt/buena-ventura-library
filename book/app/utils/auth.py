from functools import wraps
from flask import request, jsonify
from app.repositories.user_repository import UserRepository


def roles_required(*allowed_roles):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            user_name = request.headers.get('X-Username')
            if not user_name:
                return jsonify({
                    'success': False,
                    'error': 'Authentication required',
                    'message': "Falta el encabezado 'X-Username'"
                }), 401

            user = UserRepository.get_user_by_username(user_name)
            if not user:
                return jsonify({
                    'success': False,
                    'error': 'User not found',
                    'message': 'El usuario no existe'
                }), 401

            if not user.rol or user.rol.rol_name not in allowed_roles:
                return jsonify({
                    'success': False,
                    'error': 'Insufficient permissions',
                    'message': 'Se requiere rol Gestor o Administrador'
                }), 403

            request.current_user = user
            return f(*args, **kwargs)
        return wrapper
    return decorator
