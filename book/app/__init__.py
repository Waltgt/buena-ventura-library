from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from app.config.settings import DevelopmentConfig
from werkzeug.exceptions import HTTPException
from datetime import datetime
from flasgger import Swagger
import logging

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    app.config['SWAGGER'] = {
        'title': 'BuenaVentura API',
        'uiversion': 3,
        'version': '1.0.0',
        'description': 'API del sistema de gestión de biblioteca BuenaVentura'
    }
    Swagger(app)
    db.init_app(app)
    CORS(app)
    
    from app.routes.book_route import book_bp
    from app.routes.user_route import user_bp
    from app.routes.loan_route import loan_bp
    from app.routes.report_route import report_bp
    
    app.register_blueprint(book_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(loan_bp)
    app.register_blueprint(report_bp)    

    @app.errorhandler(HTTPException)
    def handle_http_exception(e):
        response = {
            'success': False,
            'message': e.description,
            'error_code': e.name.upper().replace(' ', '_'),
            'timestamp': _get_current_timestamp()
        }
        
        if hasattr(e, 'data') and e.data:
            response['details'] = e.data

        return jsonify(response), e.code
    
    @app.errorhandler(Exception)
    def handle_unexpected_exception(e):
        logging.error(f"Unexpected error: {str(e)}", exc_info=True)

        response = {
            'success': False,
            'message': 'Unexpected error occurred.',
            'error_code': 'INTERNAL_SERVER_ERROR',
            'timestamp': _get_current_timestamp()
        }

        return jsonify(response), 500

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({
            'success': False,
            'message': 'Resource not found.',
            'error_code': 'NOT_FOUND',
            'timestamp': _get_current_timestamp()
        }), 404

    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({
            'success': False,
            'message': 'Bad request.',
            'error_code': 'BAD_REQUEST',
            'timestamp': _get_current_timestamp()
        }), 400
    
    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({'status': 'ok'}), 200
    
    def _get_current_timestamp():
        return datetime.utcnow().isoformat()

    return app

    
    