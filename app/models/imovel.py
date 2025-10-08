from .. import db
from datetime import datetime

class Imovel(db.Model):
    __tablename__ = 'imoveis'
    id = db.Column(db.Integer, primary_key=True)
    endereco = db.Column(db.String(200), nullable=False)
    tipo = db.Column(db.String(50), nullable=False)  # apartamento, casa, etc.
    quartos = db.Column(db.Integer)
    banheiros = db.Column(db.Integer)
    area = db.Column(db.Float)
    valor_aluguel = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='disponivel')  # disponivel, alugado
    descricao = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    locacoes = db.relationship('Locacao', backref='imovel', lazy=True)

    def __repr__(self):
        return f'<Imovel {self.endereco}>'