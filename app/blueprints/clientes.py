from flask import Blueprint, jsonify

clientes_bp = Blueprint('clientes', __name__)

@clientes_bp.route('/', methods=['GET'])
def get_clientes():
    return jsonify({'message': 'Lista de clientes'})

@clientes_bp.route('/', methods=['POST'])
def create_cliente():
    return jsonify({'message': 'Criar cliente'})

# Adicionar mais routes conforme desenvolvimento