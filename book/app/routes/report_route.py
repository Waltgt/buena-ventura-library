from flask import Blueprint, request, jsonify, current_app
from app.services.report_service import ReportService
from app.utils.auth import roles_required
from app.enums.rol_name import RolName
from flasgger import swag_from

report_bp = Blueprint('report', __name__, url_prefix='/api/report')

@report_bp.route('/loans', methods=['GET'])
@roles_required(RolName.ADMIN.value)
@swag_from('../docs/report/search_loans.yml')
def search_loans():
    try:
        isbn = request.args.get('isbn')
        title = request.args.get('title')
        user = request.args.get('user')

        report_service = ReportService()
        loans = report_service.search_loans(isbn=isbn, title=title, user=user)
        loans_data = [loan.to_dict() for loan in loans]

        return jsonify({
            'success': True,
            'data': loans_data,
            'count': len(loans_data),
            'message': 'Report generated successfully'
        }), 200

    except Exception as e:
        current_app.logger.error(f"Error generating loan report: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'message': str(e) if current_app.debug else 'An unexpected error occurred',
            'error_type': 'InternalError'
        }), 500

@report_bp.route('/loans/book/<int:book_id>', methods=['GET'])
@roles_required(RolName.ADMIN.value)
@swag_from('../docs/report/get_loans_by_book.yml')
def get_loans_by_book(book_id):
    try:
        report_service = ReportService()
        loans = report_service.get_loans_by_book(book_id)
        loans_data = [loan.to_dict() for loan in loans]

        return jsonify({
            'success': True,
            'data': loans_data,
            'count': len(loans_data),
            'message': 'Loan history by book retrieved successfully'
        }), 200

    except Exception as e:
        current_app.logger.error(f"Error retrieving loan history by book: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'message': str(e) if current_app.debug else 'An unexpected error occurred',
            'error_type': 'InternalError'
        }), 500

@report_bp.route('/loans/user/<int:user_id>', methods=['GET'])
@roles_required(RolName.ADMIN.value)
@swag_from('../docs/report/get_loans_by_user.yml')
def get_loans_by_user(user_id):
    try:
        report_service = ReportService()
        loans = report_service.get_loans_by_user(user_id)
        loans_data = [loan.to_dict() for loan in loans]

        return jsonify({
            'success': True,
            'data': loans_data,
            'count': len(loans_data),
            'message': 'Loans by user retrieved successfully'
        }), 200

    except Exception as e:
        current_app.logger.error(f"Error retrieving loans by user: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'message': str(e) if current_app.debug else 'An unexpected error occurred',
            'error_type': 'InternalError'
        }), 500
