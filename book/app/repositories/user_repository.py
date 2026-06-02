from app import db
from app.models.user import User


class UserRepository:
    @staticmethod
    def get_user_by_username(username):
        return User.query.filter_by(username=username).first()

    @staticmethod
    def create_user(user):
        try: 
        
            db.session.add(user)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise e
        
    @staticmethod
    def get_all_users():
        
        try:
            return User.query.all()
        except Exception as e:
            print(f"Error al obtener usuarios: {str(e)}")
            return []
    
    @staticmethod
    def get_user_by_email(email):
        return User.query.filter_by(email=email).first()
    
    @staticmethod
    def get_user_by_identification_number(identification_number):
        return User.query.filter_by(identification_number=identification_number).first()
    
    @staticmethod
    def exists_user_by_identification_number(identification_number):
        return User.query.filter_by(identification_number=identification_number).first() is not None
    
    @staticmethod
    def update_user(new_user):
        try:
            user = User.query.get(new_user.id_user)
            if user:
                if user.username is not None:
                    user.username = new_user.username
                if user.password is not None:
                    user.password = new_user.password
                if user.customer_name is not None:
                    user.customer_name = new_user.customer_name
                if user.customer_last_name is not None:
                    user.customer_last_name = new_user.customer_last_name
                if user.email is not None:
                    user.email = new_user.email
                if user.phone_number is not None:
                    user.phone_number = new_user.phone_number
                if user.identification_number is not None:
                    user.identification_number = new_user.identification_number
                if user.id_rol is not None:
                    user.id_rol = new_user.id_rol
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise e

    @staticmethod
    def delete_user(user_id):
        try:
            user = User.query.get(user_id)
            if user:
                db.session.delete(user)
                db.session.commit()
            return user
        except Exception as e:
            db.session.rollback()
            raise e



