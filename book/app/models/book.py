from app import db
from sqlalchemy import CheckConstraint

class Book(db.Model):
    __tablename__ = 'libro'

    id_book = db.Column('id_libro',db.BigInteger, primary_key=True, autoincrement=True)
    isbn = db.Column('isbn',db.String(60), nullable=False, unique=True)
    title = db.Column('titulo',db.String(100), nullable=False)
    publication_date = db.Column('fecha_publicacion',db.Date, nullable=False)
    stock = db.Column('cantidad_disponible',db.Integer, nullable=False)
    status = db.Column('estado_libro', db.Enum('disponible', 'prestado'), nullable=False, default='disponible')

    id_author = db.Column('id_autor',db.BigInteger, db.ForeignKey('autor.id_autor'), nullable=False)
    id_editorial = db.Column('id_editorial',db.BigInteger, db.ForeignKey('editorial.id_editorial'), nullable=False)

    author = db.relationship('Author', backref=db.backref('books', lazy=True))
    editorial = db.relationship('Editorial', backref=db.backref('books', lazy=True))

    __table_args__ = (
        CheckConstraint('stock >= 0', name='check_stock_non_negative'),
    )
    
    def __init__(self, isbn, title, publication_date, stock, id_author, id_editorial, status='disponible'):
        self.isbn = isbn
        self.title = title
        self.publication_date = publication_date
        self.stock = stock
        self.id_author = id_author
        self.id_editorial = id_editorial
        self.status = status
    
    def to_dict(self):
        
        return {
            'id_book': self.id_book,
            'isbn': self.isbn,
            'title': self.title,
            'publication_date': self.publication_date.isoformat() if self.publication_date else None,
            'stock': self.stock,
            'status': self.status,
            'id_author': self.id_author,
            'id_editorial': self.id_editorial,
            'author_name': self.author.author_name if self.author else None,
            'editorial_name': self.editorial.name_editorial if self.editorial else None
        }