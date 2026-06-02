
from typing import Optional, Dict
from app.utils.jwt_token import JWTToken

class SecurityClient:
    
    def __init__(self, client_name: str):
        self.client_name = client_name
    
    def authenticate(self, username: str, email: str, rolename: str) -> str:
        payload = {
            'username': username,
            'email': email,
            'rolename': rolename,
            'client_name': self.client_name,  # Quién emitió el token
            'token_type': 'access'
        }
        
        token = JWTToken.generate(payload)
        
        return token
    
    def verify_token(self, token: str) -> bool:
        payload = JWTToken.decode(token)
        
        if not payload:
            return False
        
        if payload.get('client_name') != self.client_name:
            return False
        
        return True
    
    def get_user_from_token(self, token: str) -> Optional[Dict]:
        payload = JWTToken.decode(token)
        
        if not payload:
            return None
        
        if payload.get('client_name') != self.client_name:
            return None
        
        return {
            'username': payload.get('username'),
            'email': payload.get('email'),
            'rolename': payload.get('rolename'),
            'client_name': payload.get('client_name')
        }
    
    def refresh_token(self, token: str) -> Optional[str]:
        user_data = self.get_user_from_token(token)
        
        if not user_data:
            return None
        
        return self.authenticate(
            username=user_data['username'],
            email=user_data['email'],
            rolename=user_data['rolename']
        )