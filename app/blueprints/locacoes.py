from flask import Blueprint, jsonify

locacoes_bp = Blueprint('locacoes', __name__)

@locacoes_bp.route('/', methods=['GET'])
def get_locacoes():
    return jsonify({'message': 'Lista de locações'})

@locacoes_bp.route('/', methods=['POST'])
def create_locacao():
    return jsonify({'message': 'Criar locação'})

# Adicionar mais routes conforme desenvolvimento