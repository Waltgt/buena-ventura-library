from functools import wraps
from flask import request, jsonify
from app.utils.security_client import security_client

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return jsonify({
                'success': False,
                'error': 'Token is missing',
                'message': 'Authorization header required'
            }), 401
        
        if not auth_header.startswith('Bearer '):
            return jsonify({
                'success': False,
                'error': 'Invalid token format',
                'message': 'Authorization header must start with Bearer'
            }), 401
        
        token = auth_header[7:]
        
        if not security_client.verify_token(token):
            return jsonify({
                'success': False,
                'error': 'Token is invalid or expired',
                'message': 'Authentication failed'
            }), 401
        
        user_data = security_client.get_user_from_token(token)
        request.current_user = user_data
        
        return f(*args, **kwargs)
    
    return decorated


def role_required(required_role):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            auth_header = request.headers.get('Authorization')
            
            if not auth_header or not auth_header.startswith('Bearer '):
                return jsonify({
                    'success': False,
                    'error': 'Authentication required'
                }), 401
            
            token = auth_header[7:]
            user_data = security_client.get_user_from_token(token)
            
            if not user_data:
                return jsonify({
                    'success': False,
                    'error': 'Invalid or expired token'
                }), 401
            
            if user_data.get('rolename') != required_role:
                return jsonify({
                    'success': False,
                    'error': f'Role {required_role} required',
                    'message': 'Insufficient permissions',
                    'current_role': user_data.get('rolename')
                }), 403
            
            request.current_user = user_data
            return f(*args, **kwargs)
        
        return decorated
    
    return decorator


def optional_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header[7:]
            user_data = security_client.get_user_from_token(token)
            request.current_user = user_data
        
        return f(*args, **kwargs)
    
    return decorated