# app/routes/auth_route.py
from flask import Blueprint, request, jsonify
from app.utils.security_utils import security_client
from datetime import datetime

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Endpoint para autenticar usuario y obtener token JWT
    Espera: { "username": "admin", "email": "admin@email.com", "rolename": "ADMIN" }
    """
    try:
        data = request.get_json()
        
        # Validar datos requeridos
        required_fields = ['username', 'email', 'rolename']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}',
                    'message': 'Invalid request'
                }), 400
        
        # Aquí podrías verificar las credenciales contra tu base de datos
        # Ejemplo: verificar que username y email coincidan con un usuario real
        
        # Generar token JWT
        token = security_client.authenticate(
            username=data['username'],
            email=data['email'],
            rolename=data['rolename']
        )
        
        # Decodificar token para obtener información de expiración
        from app.utils.security_utils import JWTToken
        payload = JWTToken.decode_token(token)
        
        return jsonify({
            'success': True,
            'token': token,
            'token_type': 'Bearer',
            'expires_in': JWTToken.ACCESS_TOKEN_EXPIRE_HOURS * 3600,  # en segundos
            'message': 'Authentication successful',
            'user': {
                'username': data['username'],
                'email': data['email'],
                'rolename': data['rolename']
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Authentication failed'
        }), 500


@auth_bp.route('/verify', methods=['POST'])
def verify_token():
    """Verifica un token JWT"""
    try:
        data = request.get_json()
        token = data.get('token')
        
        if not token:
            return jsonify({
                'success': False,
                'error': 'Token is required'
            }), 400
        
        # Remover 'Bearer ' si viene incluido
        if token.startswith('Bearer '):
            token = token[7:]
        
        user_data = security_client.get_user_from_token(token)
        
        if user_data:
            return jsonify({
                'success': True,
                'valid': True,
                'user': user_data,
                'message': 'Token is valid'
            }), 200
        else:
            return jsonify({
                'success': False,
                'valid': False,
                'message': 'Token is invalid or expired'
            }), 401
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@auth_bp.route('/refresh', methods=['POST'])
def refresh_token():
    """Renueva un token JWT (sin necesidad de volver a autenticar)"""
    try:
        data = request.get_json()
        token = data.get('token')
        
        if not token:
            return jsonify({
                'success': False,
                'error': 'Token is required'
            }), 400
        
        if token.startswith('Bearer '):
            token = token[7:]
        
        new_token = security_client.refresh_token(token)
        
        if new_token:
            return jsonify({
                'success': True,
                'token': new_token,
                'token_type': 'Bearer',
                'message': 'Token refreshed successfully'
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': 'Cannot refresh token (invalid or expired)'
            }), 401
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500