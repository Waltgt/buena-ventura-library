from app import db

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
    
    id_rol = db.Column('id_rol',db.ForeignKey('rol.id_rol'), nullable=False)
    rol = db.relationship('Rol')

    def __init__(self, username, password, customer_name, customer_last_name, email, phone_number, identification_number, id_rol):
        self.username = username
        self.password = password
        self.customer_name = customer_name
        self.customer_last_name = customer_last_name
        self.email = email
        self.phone_number = phone_number
        self.identification_number = identification_number
        self.id_rol = id_rol
    
    def to_dict(self):
        return {
            'id_user': self.id_user or None,
            'username': self.username,
            'customer_name': self.customer_name,
            'customer_last_name': self.customer_last_name,
            'email': self.email,
            'phone_number': self.phone_number,
            'identification_number': self.identification_number,
            'id_rol': self.id_rol,
            'rol_name': self.rol.rol_name if self.rol else None
        }