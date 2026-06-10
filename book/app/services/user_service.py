import re

from app.repositories.user_repository import UserRepository
from werkzeug.exceptions import BadRequest, NotFound, Unauthorized
from flask import jsonify, g
from app.utils.user_util import UserUtils
from app.models.rol import Rol
from app.enums.rol_name import RolName
from app.models.user import User


class UserService:

    ROLE_HIERARCHY = {
        RolName.ADMIN.value: ["*"],
        RolName.GESTOR.value: [RolName.CLIENTE.value]
    }

    def get_current_user(self):
        return getattr(g, "current_user", None)

    def validate_role_permission(self, creator_user, target_role):

        if not creator_user:
            raise BadRequest("Usuario no autenticado")

        creator_role = creator_user.rol.rol_name if creator_user.rol else None
        allowed_roles = self.ROLE_HIERARCHY.get(creator_role, [])

        if "*" in allowed_roles:
            return

        if target_role not in allowed_roles:
            raise BadRequest("No tienes permisos para esta acción")

    def get_user_by_username(self, username):

        user = UserRepository.get_user_by_username(username)
        if not user:
            return []
        return user

    def authenticate(self, username, password):
        if not username or not password:
            raise BadRequest("Usuario y contraseña son obligatorios")
        user = UserRepository.get_user_by_username(username)
        if not user or user.password != password:
            raise Unauthorized("Usuario o contraseña incorrectos")
        return user

    def create_user(self, user_data):
        self.validate_user_request(user_data)
        user = self.map_user_data_to_user(user_data)

        creator_user = self.get_current_user()

        if user.id_rol:
            role = Rol.query.get(user.id_rol)
            if role:
                self.validate_role_permission(creator_user, role.rol_name)

        if UserRepository.exists_user_by_identification_number(user.identification_number):
            raise BadRequest("Ya existe un usuario con este número de identificación")

        if not self.validate_email(user.email):
            raise BadRequest("Formato de correo electrónico inválido")

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

        creator_user = self.get_current_user()

        if creator_user and creator_user.rol and creator_user.rol.rol_name == RolName.GESTOR.value:
            return [u for u in users if u.rol and u.rol.rol_name == RolName.CLIENTE.value]

        return users if users else []

    def update_user(self, user_data):
        if not user_data.get('id_user'):
            raise BadRequest("El campo 'id_user' es obligatorio para actualizar")

        if not user_data.get("password"):
            user_data.pop("password", None)

        self.validate_user_request(user_data, is_update=True)

        creator_user = self.get_current_user()

        if user_data.get('id_rol'):
            role = Rol.query.get(user_data.get('id_rol'))
            if role:
                self.validate_role_permission(creator_user, role.rol_name)

        user = self.map_user_data_to_user(user_data)
        user.id_user = user_data.get('id_user')

        updated_user = UserRepository.update_user(user)

        if not updated_user:
            raise NotFound("Usuario no encontrado")

        return updated_user

    def delete_user(self, user_id):

        creator_user = self.get_current_user()

        user_to_delete = UserRepository.get_user_by_id(user_id)

        if not user_to_delete:
            raise BadRequest("Usuario no encontrado")

        target_role = user_to_delete.rol.rol_name if user_to_delete.rol else None
        self.validate_role_permission(creator_user, target_role)

        if creator_user and creator_user.id_user == user_to_delete.id_user:
            raise BadRequest("No puedes eliminar tu propio usuario")

        if user_to_delete.rol and user_to_delete.rol.rol_name == RolName.ADMIN.value:
            raise BadRequest("No se puede eliminar un usuario administrador")

        if UserRepository.has_loans(user_id):
            raise BadRequest("No se puede eliminar el usuario porque tiene préstamos asociados")

        return UserRepository.delete_user(user_id)

    def validate_credential(self, user_name, valid_role):
        role = UserUtils.validate_user(user_name, valid_role)
        return jsonify({"message": "Usuario válido"}), 200

    def validate_user_request(self, user_data, is_update=False):
        if not user_data:
            raise BadRequest("No se proporcionaron datos")

        if not user_data.get('username'):
            raise BadRequest("El campo 'username' es obligatorio")

        if not is_update:
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
            raise BadRequest(f"El correo '{email}' no es válido")

        return True