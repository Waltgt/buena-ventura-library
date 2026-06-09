from app import db

class Loan(db.Model):
    __tablename__ = 'prestamo'

    id_loan = db.Column('id_prestamo', db.BigInteger, primary_key=True, autoincrement=True)
    id_book = db.Column('id_libro', db.BigInteger, db.ForeignKey('libro.id_libro'), nullable=False)
    id_user_loan = db.Column('id_usuario_prestamo', db.BigInteger, db.ForeignKey('usuario.id_usuario'), nullable=False)
    delivery_date = db.Column('fecha_entrega', db.DateTime, nullable=False)
    expected_return_date = db.Column('fecha_devolucion_esperada', db.DateTime, nullable=False)
    real_return_date = db.Column('fecha_devolucion_real', db.DateTime)
    id_loan_status = db.Column('id_estado_prestamo', db.Integer, db.ForeignKey('estado_prestamo.id_estado_prestamo'), nullable=False)
    id_user_register = db.Column('id_usuario_registro_prestamo', db.BigInteger, db.ForeignKey('usuario.id_usuario'), nullable=False)

    book = db.relationship('Book')
    status = db.relationship('LoanStatus')
    user_loan = db.relationship('User', foreign_keys=[id_user_loan])
    user_register = db.relationship('User', foreign_keys=[id_user_register])

    def __init__(self, id_book, id_user_loan, delivery_date, expected_return_date, id_loan_status, id_user_register, real_return_date=None):
        self.id_book = id_book
        self.id_user_loan = id_user_loan
        self.delivery_date = delivery_date
        self.expected_return_date = expected_return_date
        self.id_loan_status = id_loan_status
        self.id_user_register = id_user_register
        self.real_return_date = real_return_date

    def to_dict(self):
        return {
            'id_loan': self.id_loan,
            'id_book': self.id_book,
            'book_title': self.book.title if self.book else None,
            'isbn': self.book.isbn if self.book else None,
            'id_editorial': self.book.id_editorial if self.book else None,
            'editorial_name': self.book.editorial.name_editorial if self.book and self.book.editorial else None,
            'id_user_loan': self.id_user_loan,
            'user_loan_name': f"{self.user_loan.customer_name} {self.user_loan.customer_last_name}" if self.user_loan else None,
            'delivery_date': self.delivery_date.isoformat() if self.delivery_date else None,
            'expected_return_date': self.expected_return_date.isoformat() if self.expected_return_date else None,
            'real_return_date': self.real_return_date.isoformat() if self.real_return_date else None,
            'status_code': self.status.code if self.status else None,
            'id_user_register': self.id_user_register
        }
