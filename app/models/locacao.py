from .. import db
from datetime import datetime

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

    def __repr__(self):
        return f'<Locacao {self.id} - Cliente {self.cliente_id}>'