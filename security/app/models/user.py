from app import db
from sqlalchemy import CheckConstraint

class User(db.Model):
    __tablename__ = 'usuario'

    id_user = db.Column('id_usuario',db.BigInteger, primary_key=True, autoincrement=True)
    username = db.Column('nombre_usuario',db.String(60), nullable=False, unique=True)
    password = db.Column('contrasena',db.String(255), nullable=False)
    customer_name = db.Column('nombre_cliente',db.String(100), nullable=False)
    customer_last_name = db.Column('apellido_cliente',db.String(100), nullable=False)
    email = db.Column('correo',db.String(100), nullable=False, unique=True)
    phone_number = db.Column('telefono',db.String(20), nullable=False)
    identification_number = db.Column('numero_identificacion',db.String(20), nullable=False, unique=True)
    
    id_rol = db.Column('id_rol',db.String(20), nullable=False)
    rol = db.relationship('Rol', backref=db.backref('users', lazy=True))
    

    __table_args__ = (
        CheckConstraint("id_role IN ('admin', 'user')", name='check_role_valid'),
    )