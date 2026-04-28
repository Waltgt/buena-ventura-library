from app import db
from sqlalchemy import CheckConstraint

class Book(db.Model):
    __tablename__ = 'libro'

    id_book = db.Column('id_libro',db.BigInteger, primary_key=True, autoincrement=True)
    isbn = db.Column('isbn',db.String(60), nullable=False, unique=True)
    title = db.Column('titulo',db.String(100), nullable=False)
    publication_date = db.Column('fecha_publicacion',db.Date, nullable=False)
    stock = db.Column('cantidad_disponible',db.Integer, nullable=False)

    id_author = db.Column('id_autor',db.BigInteger, db.ForeignKey('autor.id_autor'), nullable=False)
    id_editorial = db.Column('id_editorial',db.BigInteger, db.ForeignKey('editorial.id_editorial'), nullable=False)

    author = db.relationship('Author', backref=db.backref('books', lazy=True))
    editorial = db.relationship('Editorial', backref=db.backref('books', lazy=True))

    __table_args__ = (
        CheckConstraint('stock >= 0', name='check_stock_non_negative'),
    )