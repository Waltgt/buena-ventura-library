from app.repositories.user_repository import UserRepository
from werkzeug.exceptions import BadRequest, NotFound
from flask import jsonify
from app.utils.user_util import UserUtils
from app.models.rol import Rol
from app.enums.rol_name import RolName



class UserService:
        
    def get_user_by_username(self, username):
        
        user = UserRepository.get_user_by_username(username)
        if not user:
            return []
        return user
    
    def create_user(self, user, user_name):
        UserUtils.validate_role(user_name, RolName.ADMIN.value)
        old_user = UserRepository.get_user_by_username(user.username)
        if old_user:
            raise BadRequest("User already exists")
        UserRepository.create_user(user)
    
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

    def update_user(self, new_user, user_name):
        UserUtils.validate_role(user_name, RolName.ADMIN.value)
        UserRepository.update_user(new_user)

    def delete_user(self, user_id, user_name):
        UserUtils.validate_role(user_name, RolName.ADMIN.value)
        return UserRepository.delete_user(user_id)
    
    def validate_credential(self, user_name, valid_role):
        role = UserUtils.validate_user(user_name, valid_role)
        return jsonify({"message": "User is valid"}), 200
