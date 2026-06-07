from app.models.loan_status import LoanStatus

class LoanStatusRepository:

    @staticmethod
    def get_by_code(code):
        return LoanStatus.query.filter_by(code=code).first()
