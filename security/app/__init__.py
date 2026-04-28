from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from app.config.settings import DevelopmentConfig

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)

    db.init_app(app)
    CORS(app)

    @app.errorhandler(404)
    def not_found(error):
        return {'error': 'Recurso no encontrado'}, 404

    return app