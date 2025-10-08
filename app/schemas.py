from pydantic import BaseModel
from datetime import date
from typing import Optional

class LocacaoBase(BaseModel):
    cliente_id: int
    imovel_id: int
    data_inicio: date
    data_fim: Optional[date] = None
    valor_mensal: float
    status: str = 'ativa'
    tipo: str = 'anual'

class LocacaoCreate(LocacaoBase):
    pass

class LocacaoUpdate(BaseModel):
    cliente_id: Optional[int] = None
    imovel_id: Optional[int] = None
    data_inicio: Optional[date] = None
    data_fim: Optional[date] = None
    valor_mensal: Optional[float] = None
    status: Optional[str] = None
    tipo: Optional[str] = None

class ClienteResponse(BaseModel):
    id: int
    nome: str
    email: str
    telefone: Optional[str]
    cpf: Optional[str]

class ImovelResponse(BaseModel):
    id: int
    endereco: str
    tipo: str
    quartos: Optional[int]
    banheiros: Optional[int]
    area: Optional[float]
    valor_aluguel: float
    status: str

class LocacaoResponse(LocacaoBase):
    id: int
    cliente: ClienteResponse
    imovel: ImovelResponse
    vencimentos: list[date]
    multa_atual: float

    class Config:
        from_attributes = True