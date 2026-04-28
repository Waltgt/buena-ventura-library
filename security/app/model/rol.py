from app import db

class Rol(db.Model):
    __tablename__ = 'rol'

    id_rol = db.Column('id_rol',db.String(20), primary_key=True, nullable=False, unique=True)
    rol_name = db.Column('nombre_rol',db.String(50), nullable=False, unique=True)
    description = db.Column('descripcion_rol',db.String(255), nullable=False)