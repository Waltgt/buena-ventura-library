from flask import Blueprint, request, jsonify, current_app
from werkzeug.exceptions import BadRequest, NotFound
from app.services.loan_service import LoanService
from app.utils.auth import roles_required
from app.enums.rol_name import RolName
from flasgger import swag_from

loan_bp = Blueprint('loan', __name__, url_prefix='/api/loan')

@loan_bp.route('', methods=['GET'])
@swag_from('../docs/loan/get_all_loans.yml')
def get_all_loans():
    loan_service = LoanService()
    loans = loan_service.get_all_loans()
    loans_data = [loan.to_dict() for loan in loans]
    return jsonify({
        'success': True,
        'data': loans_data,
        'count': len(loans_data),
        'message': 'Préstamos obtenidos exitosamente'
    }), 200

@loan_bp.route('/<int:loan_id>', methods=['GET'])
@swag_from('../docs/loan/get_loan_by_id.yml')
def get_loan_by_id(loan_id):
    loan_service = LoanService()
    loan = loan_service.get_loan_by_id(loan_id)
    if loan:
        return jsonify({
            'success': True,
            'data': loan.to_dict(),
            'count': 1,
            'message': 'Préstamo encontrado exitosamente'
        }), 200
    return jsonify({
        'success': True,
        'data': [],
        'count': 0,
        'message': 'No se encontró un préstamo con el ID: ' + str(loan_id)
    }), 200

@loan_bp.route('', methods=['POST'])
@roles_required(RolName.GESTOR.value, RolName.ADMIN.value)
@swag_from('../docs/loan/create_loan.yml')
def create_loan():
    try:
        loan_data = request.get_json()

        loan_service = LoanService()
        new_loan = loan_service.create_loan(loan_data)

        return jsonify({
            'success': True,
            'data': new_loan.to_dict(),
            'message': 'Préstamo creado exitosamente'
        }), 201

    except BadRequest as e:
        return jsonify({
            'success': False,
            'error': e.description,
            'message': 'Validation error',
            'error_type': 'BadRequest'
        }), 400

    except NotFound as e:
        return jsonify({
            'success': False,
            'error': e.description,
            'message': 'Not found',
            'error_type': 'NotFound'
        }), 404

    except Exception as e:
        current_app.logger.error(f"Error creating loan: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'message': str(e) if current_app.debug else 'An unexpected error occurred',
            'error_type': 'InternalError'
        }), 500

@loan_bp.route('/<int:loan_id>/return', methods=['PUT'])
@roles_required(RolName.GESTOR.value, RolName.ADMIN.value)
@swag_from('../docs/loan/return_loan.yml')
def return_loan(loan_id):
    try:
        loan_service = LoanService()
        loan = loan_service.return_loan(loan_id)

        return jsonify({
            'success': True,
            'data': loan.to_dict(),
            'message': 'Préstamo devuelto exitosamente'
        }), 200

    except BadRequest as e:
        return jsonify({
            'success': False,
            'error': e.description,
            'message': 'Validation error',
            'error_type': 'BadRequest'
        }), 400

    except NotFound as e:
        return jsonify({
            'success': False,
            'error': e.description,
            'message': 'Not found',
            'error_type': 'NotFound'
        }), 404

    except Exception as e:
        current_app.logger.error(f"Error returning loan: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'message': str(e) if current_app.debug else 'An unexpected error occurred',
            'error_type': 'InternalError'
        }), 500
