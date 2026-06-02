from app import db

class Rol(db.Model):
    __tablename__ = 'rol'

    id_rol = db.Column('id_rol',db.String(20), primary_key=True, nullable=False, unique=True)
    rol_name = db.Column('nombre_rol',db.String(50), nullable=False, unique=True)
    description = db.Column('descripcion_rol',db.String(255), nullable=False)
    
    def __init__(self, id_rol, rol_name, description):
        self.id_rol = id_rol
        self.rol_name = rol_name
        self.description = description
        
    def to_dict(self):
        return {
            'id_rol': self.id_rol,
            'rol_name': self.rol_name,
            'description': self.description
        }