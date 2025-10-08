from app import create_app, db
from app.models import Role, User, Cliente, Imovel

def seed_data():
    app = create_app()
    with app.app_context():
        # Criar roles
        admin_role = Role(name='admin')
        user_role = Role(name='user')
        db.session.add(admin_role)
        db.session.add(user_role)
        db.session.commit()

        # Criar usuário admin
        admin_user = User(
            username='admin',
            email='admin@example.com',
            password_hash='hashed_password',  # Em produção, usar hash real
            role_id=admin_role.id
        )
        db.session.add(admin_user)
        db.session.commit()

        # Seeds de exemplo para clientes
        cliente1 = Cliente(
            nome='João Silva',
            email='joao@example.com',
            telefone='11999999999',
            cpf='12345678901',
            endereco='Rua A, 123'
        )
        db.session.add(cliente1)

        # Seeds de exemplo para imóveis
        imovel1 = Imovel(
            endereco='Rua B, 456',
            tipo='apartamento',
            quartos=2,
            banheiros=1,
            area=60.0,
            valor_aluguel=1500.0,
            descricao='Apartamento aconchegante no centro'
        )
        db.session.add(imovel1)

        db.session.commit()
        print("Dados iniciais inseridos com sucesso!")

if __name__ == '__main__':
    seed_data()