from flask import Blueprint, jsonify

imoveis_bp = Blueprint('imoveis', __name__)

@imoveis_bp.route('/', methods=['GET'])
def get_imoveis():
    return jsonify({'message': 'Lista de imóveis'})

@imoveis_bp.route('/', methods=['POST'])
def create_imovel():
    return jsonify({'message': 'Criar imóvel'})

# Adicionar mais routes conforme desenvolvimento