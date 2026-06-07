from app import db
from app.models.rol import Rol

class RolRepository:
    
    @staticmethod
    def get_all_roles():
        return Rol.query.all()

    @staticmethod
    def get_role_by_id(role_id):
        return Rol.query.get(role_id)
    
    @staticmethod
    def get_role_by_name(role_name):
        return Rol.query.filter_by(rol_name=role_name).first()