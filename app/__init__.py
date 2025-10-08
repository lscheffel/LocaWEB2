from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os
from dotenv import load_dotenv
import logging
import structlog

# Carregar variáveis de ambiente
load_dotenv()

# Inicializar extensões
db = SQLAlchemy()
migrate = Migrate()

def create_app():
    # Configurar logging estruturado
    structlog.configure(
        processors=[
            structlog.stdlib.filter_by_level,
            structlog.stdlib.add_logger_name,
            structlog.stdlib.add_log_level,
            structlog.stdlib.PositionalArgumentsFormatter(),
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            structlog.processors.UnicodeDecoder(),
            structlog.processors.JSONRenderer()
        ],
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )

    app = Flask(__name__)

    # Configurações
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///app.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Inicializar extensões
    db.init_app(app)
    migrate.init_app(app, db)

    # Importar modelos para registro
    from . import models

    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Recurso não encontrado'}), 404

    @app.errorhandler(500)
    def internal_error(error):
        app.logger.error(f'Erro interno: {error}')
        return jsonify({'error': 'Erro interno do servidor'}), 500

    # Registrar blueprints
    from .blueprints.locacoes import locacoes_bp
    from .blueprints.clientes import clientes_bp
    from .blueprints.imoveis import imoveis_bp

    app.register_blueprint(locacoes_bp, url_prefix='/api/v1/locacoes')
    app.register_blueprint(clientes_bp, url_prefix='/api/v1/clientes')
    app.register_blueprint(imoveis_bp, url_prefix='/api/v1/imoveis')

    # Rotas básicas
    @app.route('/')
    def index():
        return {'message': 'Bem-vindo ao Painel de Gerenciamento Imobiliário'}

    @app.route('/health')
    def health():
        return {'status': 'ok'}

    return app