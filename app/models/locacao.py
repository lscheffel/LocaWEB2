from .. import db
from datetime import datetime, date
from dateutil.relativedelta import relativedelta

class Locacao(db.Model):
    __tablename__ = 'locacoes'
    id = db.Column(db.Integer, primary_key=True)
    cliente_id = db.Column(db.Integer, db.ForeignKey('clientes.id'), nullable=False)
    imovel_id = db.Column(db.Integer, db.ForeignKey('imoveis.id'), nullable=False)
    data_inicio = db.Column(db.Date, nullable=False)
    data_fim = db.Column(db.Date)
    valor_mensal = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='ativa')  # ativa, finalizada, cancelada
    tipo = db.Column(db.String(20), default='anual')  # anual, sazonal
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def calcular_vencimentos(self):
        """Calcula as datas de vencimento mensais até a data atual ou data_fim"""
        vencimentos = []
        data_atual = self.data_inicio
        hoje = date.today()
        while data_atual <= (self.data_fim or hoje):
            vencimentos.append(data_atual)
            data_atual = data_atual + relativedelta(months=1)
        return vencimentos

    def calcular_multa(self, dias_atraso=0):
        """Calcula multa por atraso (exemplo: 2% ao dia)"""
        if dias_atraso <= 0:
            return 0.0
        return self.valor_mensal * 0.02 * dias_atraso

    def __repr__(self):
        return f'<Locacao {self.id} - Cliente {self.cliente_id}>'