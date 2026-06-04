from app import db

class Editorial(db.Model):
    __tablename__ = 'editorial'

    id_editorial = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    name_editorial = db.Column('nombre_editorial',db.String(250), nullable=False)
