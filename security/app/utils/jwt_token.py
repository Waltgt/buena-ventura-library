import jwt
from datetime import datetime, timedelta
from typing import Optional, Dict
import os

class JWTToken:
    SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'tu-secret-key-muy-segura-cambia-en-produccion')
    ALGORITHM = os.environ.get('ALGORITHM', 'HS256')
    ACCESS_TOKEN_EXPIRE_HOURS = int(os.environ.get('ACCESS_TOKEN_EXPIRE_HOURS', 8))
    
    @staticmethod
    def generate_token(username: str, email: str, rolename: str, client_name: str) -> str:
      
        payload = {
            'sub': username,  
            'iat': datetime.utcnow(),  
            'exp': datetime.utcnow() + timedelta(hours=JWTToken.ACCESS_TOKEN_EXPIRE_HOURS),
            'iss': client_name,             
            
            'username': username,
            'email': email,
            'rolename': rolename,
            'client_name': client_name
        }
        
        token = jwt.encode(payload, JWTToken.SECRET_KEY, algorithm=JWTToken.ALGORITHM)
        return token
    
    @staticmethod
    def decode_token(token: str) -> Optional[Dict]:
        try:
            payload = jwt.decode(
                token, 
                JWTToken.SECRET_KEY, 
                algorithms=[JWTToken.ALGORITHM],
                options={'require': ['exp', 'iat']} 
            )
            return payload    
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
    
    @staticmethod
    def validate_token(token: str) -> bool:
        payload = JWTToken.decode_token(token)
        return payload is not None
    
    @staticmethod
    def get_user_from_token(token: str) -> Optional[Dict]:
        payload = JWTToken.decode_token(token)
        if not payload:
            return None
        
        return {
            'username': payload.get('username'),
            'email': payload.get('email'),
            'rolename': payload.get('rolename'),
            'client_name': payload.get('client_name'),
            'expires_at': payload.get('exp')
        }
    
    @staticmethod
    def refresh_token(token: str) -> Optional[str]:
        """
        Renueva un token si aún no ha expirado
        
        Args:
            token: Token actual
        
        Returns:
            Nuevo token o None si no se puede renovar
        """
        payload = JWTToken.decode_token(token)
        if not payload:
            return None
        
        # Generar nuevo token con los mismos datos
        return JWTToken.generate_token(
            username=payload['username'],
            email=payload['email'],
            rolename=payload['rolename'],
            client_name=payload['client_name']
        )