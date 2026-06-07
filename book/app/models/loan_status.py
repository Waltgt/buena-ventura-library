from app import db

class LoanStatus(db.Model):
    __tablename__ = 'estado_prestamo'

    id_loan_status = db.Column('id_estado_prestamo', db.Integer, primary_key=True, autoincrement=True)
    code = db.Column('codigo_estado_prestamo', db.String(5), nullable=False, unique=True)
    description = db.Column('descripcion_estado_prestamo', db.String(100))

    def to_dict(self):
        return {
            'id_loan_status': self.id_loan_status,
            'code': self.code,
            'description': self.description
        }
