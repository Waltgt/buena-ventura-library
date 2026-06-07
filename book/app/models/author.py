from app import db
from sqlalchemy import CheckConstraint

class Author(db.Model):
    __tablename__ = 'autor'

    id_author = db.Column('id_autor',db.BigInteger, primary_key=True, autoincrement=True)
    author_name = db.Column('nombre_autor',db.String(250), nullable=False)