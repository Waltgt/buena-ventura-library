import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CORS_ORIGIN = os.getenv("CORS_ORIGIN", "http://localhost:5173")
    
    
    SQLALCHEMY_ENGINE_OPTIONS = {
        "connect_args": {
            "charset": "utf8mb4",
            "use_unicode": True,
            "init_command": "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
        }
    }



class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False