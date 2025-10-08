from flask import Blueprint, request, jsonify, abort, send_file
from .. import db
from ..models.locacao import Locacao
from ..models.cliente import Cliente
from ..models.imovel import Imovel
from ..schemas import LocacaoCreate, LocacaoUpdate, LocacaoResponse, ClienteResponse, ImovelResponse
from pydantic import ValidationError
from datetime import date
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from openpyxl import Workbook
import io

locacoes_bp = Blueprint('locacoes', __name__)

@locacoes_bp.route('/', methods=['GET'])
def get_locacoes():
    locacoes = Locacao.query.all()
    result = []
    for locacao in locacoes:
        cliente = Cliente.query.get(locacao.cliente_id)
        imovel = Imovel.query.get(locacao.imovel_id)
        vencimentos = locacao.calcular_vencimentos()
        multa_atual = locacao.calcular_multa()  # Assuming no atraso for now
        cliente_resp = ClienteResponse(
            id=cliente.id,
            nome=cliente.nome,
            email=cliente.email,
            telefone=cliente.telefone,
            cpf=cliente.cpf
        )
        imovel_resp = ImovelResponse(
            id=imovel.id,
            endereco=imovel.endereco,
            tipo=imovel.tipo,
            quartos=imovel.quartos,
            banheiros=imovel.banheiros,
            area=imovel.area,
            valor_aluguel=imovel.valor_aluguel,
            status=imovel.status
        )
        locacao_data = LocacaoResponse(
            id=locacao.id,
            cliente_id=locacao.cliente_id,
            imovel_id=locacao.imovel_id,
            data_inicio=locacao.data_inicio,
            data_fim=locacao.data_fim,
            valor_mensal=locacao.valor_mensal,
            status=locacao.status,
            tipo=locacao.tipo,
            cliente=cliente_resp,
            imovel=imovel_resp,
            vencimentos=vencimentos,
            multa_atual=multa_atual
        )
        result.append(locacao_data.dict())
    return jsonify(result)

@locacoes_bp.route('/', methods=['POST'])
def create_locacao():
    try:
        data = request.get_json()
        locacao_data = LocacaoCreate(**data)
        locacao = Locacao(
            cliente_id=locacao_data.cliente_id,
            imovel_id=locacao_data.imovel_id,
            data_inicio=locacao_data.data_inicio,
            data_fim=locacao_data.data_fim,
            valor_mensal=locacao_data.valor_mensal,
            status=locacao_data.status,
            tipo=locacao_data.tipo
        )
        db.session.add(locacao)
        db.session.commit()
        return jsonify({'message': 'Locação criada com sucesso', 'id': locacao.id}), 201
    except ValidationError as e:
        return jsonify({'error': 'Dados inválidos', 'details': e.errors()}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@locacoes_bp.route('/<int:id>', methods=['GET'])
def get_locacao(id):
    locacao = Locacao.query.get_or_404(id)
    cliente = Cliente.query.get(locacao.cliente_id)
    imovel = Imovel.query.get(locacao.imovel_id)
    vencimentos = locacao.calcular_vencimentos()
    multa_atual = locacao.calcular_multa()
    cliente_resp = ClienteResponse(
        id=cliente.id,
        nome=cliente.nome,
        email=cliente.email,
        telefone=cliente.telefone,
        cpf=cliente.cpf
    )
    imovel_resp = ImovelResponse(
        id=imovel.id,
        endereco=imovel.endereco,
        tipo=imovel.tipo,
        quartos=imovel.quartos,
        banheiros=imovel.banheiros,
        area=imovel.area,
        valor_aluguel=imovel.valor_aluguel,
        status=imovel.status
    )
    locacao_data = LocacaoResponse(
        id=locacao.id,
        cliente_id=locacao.cliente_id,
        imovel_id=locacao.imovel_id,
        data_inicio=locacao.data_inicio,
        data_fim=locacao.data_fim,
        valor_mensal=locacao.valor_mensal,
        status=locacao.status,
        tipo=locacao.tipo,
        cliente=cliente_resp,
        imovel=imovel_resp,
        vencimentos=vencimentos,
        multa_atual=multa_atual
    )
    return jsonify(locacao_data.dict())

@locacoes_bp.route('/<int:id>', methods=['PUT'])
def update_locacao(id):
    locacao = Locacao.query.get_or_404(id)
    try:
        data = request.get_json()
        update_data = LocacaoUpdate(**data)
        for field, value in update_data.dict(exclude_unset=True).items():
            setattr(locacao, field, value)
        db.session.commit()
        return jsonify({'message': 'Locação atualizada com sucesso'})
    except ValidationError as e:
        return jsonify({'error': 'Dados inválidos', 'details': e.errors()}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@locacoes_bp.route('/<int:id>', methods=['DELETE'])
def delete_locacao(id):
    locacao = Locacao.query.get_or_404(id)
    try:
        db.session.delete(locacao)
        db.session.commit()
        return jsonify({'message': 'Locação deletada com sucesso'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@locacoes_bp.route('/relatorios/pdf', methods=['GET'])
def gerar_relatorio_pdf():
    locacoes = Locacao.query.all()
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    c.drawString(100, 750, "Relatório de Locações")
    y = 720
    for locacao in locacoes:
        cliente = Cliente.query.get(locacao.cliente_id)
        imovel = Imovel.query.get(locacao.imovel_id)
        c.drawString(100, y, f"ID: {locacao.id}, Cliente: {cliente.nome}, Imóvel: {imovel.endereco}, Valor: {locacao.valor_mensal}")
        y -= 20
        if y < 50:
            c.showPage()
            y = 750
    c.save()
    buffer.seek(0)
    return send_file(buffer, as_attachment=True, download_name='relatorio_locacoes.pdf', mimetype='application/pdf')

@locacoes_bp.route('/relatorios/excel', methods=['GET'])
def gerar_relatorio_excel():
    locacoes = Locacao.query.all()
    wb = Workbook()
    ws = wb.active
    ws.title = "Locações"
    ws.append(['ID', 'Cliente', 'Imóvel', 'Data Início', 'Valor Mensal', 'Status'])
    for locacao in locacoes:
        cliente = Cliente.query.get(locacao.cliente_id)
        imovel = Imovel.query.get(locacao.imovel_id)
        ws.append([locacao.id, cliente.nome, imovel.endereco, str(locacao.data_inicio), locacao.valor_mensal, locacao.status])
    buffer = io.BytesIO()
    wb.save(buffer)
    buffer.seek(0)
    return send_file(buffer, as_attachment=True, download_name='relatorio_locacoes.xlsx', mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')