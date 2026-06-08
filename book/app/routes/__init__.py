from .book_route import book_bp
from .user_route import user_bp
from .loan_route import loan_bp
from .report_route import report_bp
from .auth_route import auth_bp

__all__ = ['book_bp', 'user_bp', 'loan_bp', 'report_bp', 'auth_bp']