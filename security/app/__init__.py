from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.exceptions import HTTPException
from app.config.settings import DevelopmentConfig
from logging import basicConfig, INFO
import logging
from datetime import datetime

basicConfig(level=INFO)

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)

    db.init_app(app)
    CORS(app)
    
    from app.routes.user_route import user_bp
    app.register_blueprint(user_bp, url_prefix='/api/user')
    

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
        
        
    @app.route('/health')
    def health():
        return jsonify({
            'status': 'healthy',
            'timestamp': _get_current_timestamp()
        }), 200
    
    def _get_current_timestamp():
        return datetime.utcnow().isoformat()

    return app

