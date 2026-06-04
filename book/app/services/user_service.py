import re

from app.repositories.user_repository import UserRepository
from werkzeug.exceptions import BadRequest, NotFound
from flask import jsonify
from app.utils.user_util import UserUtils
from app.models.rol import Rol
from app.enums.rol_name import RolName
from app.models.user import User



class UserService:
        
    def get_user_by_username(self, username):
        
        user = UserRepository.get_user_by_username(username)
        if not user:
            return []
        return user
    
    def create_user(self, user_data):
        #UserUtils.validate_role(user_name, RolName.ADMIN.value)
        
        self.validate_user_request(user_data)
        user = self.map_user_data_to_user(user_data)
        
        if UserRepository.exists_user_by_identification_number(user.identification_number):
            raise BadRequest("User with this identification number already exists")
        if not self.validate_email(user.email):
            raise BadRequest("Invalid email format")
        
        return UserRepository.create_user(user)
        
    def map_user_data_to_user(self, user_data):
        return User(
            username=user_data.get('username'),
            password=user_data.get('password'),
            customer_name=user_data.get('customer_name'),
            customer_last_name=user_data.get('customer_last_name'),
            email=user_data.get('email'),
            phone_number=user_data.get('phone_number'),
            identification_number=user_data.get('identification_number'),
            id_rol=user_data.get('id_rol')
        )
    
    def get_user_by_email(self, email):
        user = UserRepository.get_user_by_email(email)
        if not user:
            return []
        return user

    def get_user_by_identification_number(self, identification_number):
        user = UserRepository.get_user_by_identification_number(identification_number)
        if not user:
            return []
        return user

    def get_all_users(self):
        users = UserRepository.get_all_users()
        return users if users else []

    def update_user(self, new_user, user_name):
        UserUtils.validate_role(user_name, RolName.ADMIN.value)
        UserRepository.update_user(new_user)

    def delete_user(self, user_id, user_name):
        UserUtils.validate_role(user_name, RolName.ADMIN.value)
        return UserRepository.delete_user(user_id)
    
    def validate_credential(self, user_name, valid_role):
        role = UserUtils.validate_user(user_name, valid_role)
        return jsonify({"message": "User is valid"}), 200
    
    def validate_user_request(self,user_data):
        if not user_data:
            raise BadRequest("No se proporcionaron datos")
        if not user_data.get('username'):
            raise BadRequest("El campo 'username' es obligatorio")
        if not user_data.get('password'):
            raise BadRequest("El campo 'password' es obligatorio")
        if not user_data.get('customer_name'):
            raise BadRequest("El campo 'customer_name' es obligatorio")
        if not user_data.get('customer_last_name'):
            raise BadRequest("El campo 'customer_last_name' es obligatorio")
        if not user_data.get('email'):
            raise BadRequest("El campo 'email' es obligatorio")
        if not user_data.get('phone_number'):
            raise BadRequest("El campo 'phone_number' es obligatorio")
        if not user_data.get('identification_number'):
            raise BadRequest("El campo 'identification_number' es obligatorio")
    
    def validate_email(self, email):        
        
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        
        if not re.match(email_regex, email):
            raise ValueError(f"El correo '{email}' no es válido")
        
        return True
