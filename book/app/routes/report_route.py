from flask import Blueprint, request, jsonify, current_app, Response, g
from app.services.report_service import ReportService
from app.utils.auth import roles_required
from app.enums.rol_name import RolName
from flasgger import swag_from

report_bp = Blueprint('report', __name__, url_prefix='/api/report')


def _is_csv_requested():
    return (request.args.get('format') or '').lower() == 'csv'


def _csv_response(loans, filename):
    report_service = ReportService()
    csv_content = report_service.build_loans_csv(loans)

    return Response(
        csv_content,
        mimetype='text/csv; charset=utf-8',
        headers={
            'Content-Disposition': f'attachment; filename={filename}'
        }
    )


@report_bp.route('/loans', methods=['GET'])
@roles_required(RolName.ADMIN.value)
@swag_from('../docs/report/search_loans.yml')
def search_loans():
    try:
        filters = {
            "isbn": request.args.get("isbn"),
            "title": request.args.get("title"),
            "user": request.args.get("user")
        }

        report_service = ReportService()
        loans = report_service.search_loans(**filters)

        if _is_csv_requested():
            return _csv_response(loans, 'reporte_prestamos.csv')

        loans_data = [loan.to_dict() for loan in loans]

        return jsonify({
            'success': True,
            'data': loans_data,
            'count': len(loans_data),
            'message': 'Reporte generado exitosamente'
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

        if _is_csv_requested():
            return _csv_response(loans, f'reporte_libro_{book_id}.csv')

        loans_data = [loan.to_dict() for loan in loans]

        return jsonify({
            'success': True,
            'data': loans_data,
            'count': len(loans_data),
            'message': 'Historial de préstamos por libro obtenido exitosamente'
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

        if _is_csv_requested():
            return _csv_response(loans, f'reporte_usuario_{user_id}.csv')

        loans_data = [loan.to_dict() for loan in loans]

        return jsonify({
            'success': True,
            'data': loans_data,
            'count': len(loans_data),
            'message': 'Préstamos por usuario obtenidos exitosamente'
        }), 200

    except Exception as e:
        current_app.logger.error(f"Error retrieving loans by user: {str(e)}")

        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'message': str(e) if current_app.debug else 'An unexpected error occurred',
            'error_type': 'InternalError'
        }), 500

@report_bp.route('/loans/me', methods=['GET'])
@roles_required(RolName.CLIENTE.value)
@swag_from('../docs/report/get_loans_by_me.yml')
def get_my_loans():
    try:
        current_user = getattr(g, "current_user", None)

        if not current_user:
            return jsonify({
                'success': False,
                'error': 'Usuario no autenticado',
                'message': 'No se encontró usuario en sesión',
                'error_type': 'Unauthorized'
            }), 401

        report_service = ReportService()
        loans = report_service.get_loans_by_user(current_user.id_user)

        if _is_csv_requested():
            return _csv_response(loans, f'mis_prestamos_{current_user.id_user}.csv')

        loans_data = [loan.to_dict() for loan in loans]

        return jsonify({
            'success': True,
            'data': loans_data,
            'count': len(loans_data),
            'message': 'Préstamos del usuario obtenidos exitosamente'
        }), 200

    except Exception as e:
        current_app.logger.error(f"Error retrieving current user loans: {str(e)}")

        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'message': str(e) if current_app.debug else 'An unexpected error occurred',
            'error_type': 'InternalError'
        }), 500