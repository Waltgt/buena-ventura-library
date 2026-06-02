from app.repositories.user_repository import UserRepository  
from app.repositories.rol_repository import RolRepository  
from werkzeug.exceptions import BadRequest, NotFound

class UserUtils:
    
    @staticmethod
    def validate_user(user_name, valid_role):
        current_user = UserRepository.get_user_by_username(user_name)
        if not current_user:
            raise NotFound("User not valid ")
        UserUtils.validate_role(current_user.rol.rol_name, valid_role)
        
        
    @staticmethod
    def validate_role(role_name, valid_role):
        role = RolRepository.get_role_by_name(role_name)
        if not role:
            raise BadRequest("Invalid role")
        if role.rol_name != valid_role:
            raise BadRequest("Role not valid for this action")
        return role
        