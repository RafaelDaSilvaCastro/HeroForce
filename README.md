# 🦸 HeroForce

Portal web fullstack de gestão de projetos heroicos. Construído com NestJS, ReactJS, TypeScript, TypeORM e PostgreSQL.

## 🌐 Deploy

| Serviço | URL |
|---|---|
| Frontend | https://heroforceweb.up.railway.app |
| Backend | https://heroforce-production.up.railway.app |
| Swagger | https://heroforce-production.up.railway.app/api |

---

## 🧰 Tecnologias

**Backend**
- NestJS + TypeScript
- TypeORM + PostgreSQL
- JWT Authentication
- Swagger (documentação da API)
- Jest (testes unitários)

**Frontend**
- ReactJS + TypeScript
- Vite
- Tailwind CSS
- Axios

**Infraestrutura**
- Docker + Docker Compose
- GitHub Actions (CI)
- Railway (deploy)

---

## 🚀 Executando com Docker (recomendado)

### Pré-requisitos
- [Docker](https://www.docker.com/products/docker-desktop) instalado

### Passos

```bash
# Clone o repositório
git clone https://github.com/RafaelDaSilvaCastro/HeroForce.git
cd HeroForce

# Suba todos os serviços
docker-compose up --build
```

Aguarde os containers subirem e acesse:

| Serviço | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:3000 |
| Swagger | http://localhost:3000/api |

---

## 💻 Executando localmente (sem Docker)

### Pré-requisitos
- Node.js 20+
- PostgreSQL 16+

### Backend

```bash
cd backend

# Instale as dependências
npm install --legacy-peer-deps

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais do PostgreSQL

# Inicie em modo desenvolvimento
npm run start:dev
```

### Frontend

```bash
cd frontend/heroforce-web

# Instale as dependências
npm install

# Inicie em modo desenvolvimento
npm run dev
```

### Variáveis de ambiente — backend (.env)

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=hero_force
JWT_SECRET=sua_chave_secreta_aqui
```

### Variáveis de ambiente — frontend (.env)

```env
VITE_API_URL=http://localhost:3000
```

---

## 📚 Documentação da API

Com o backend rodando, acesse o Swagger em:

```
http://localhost:3000/api
```

> ⚠️ Endpoints de criação, edição e exclusão de projetos requerem token de usuário com role `admin`.

### Autenticação

```http
POST /auth/signup   # Cadastro de usuário
POST /auth/signin     # Login — retorna access_token
```

### Usuários

```http
GET    /user          # Listar usuários (autenticado)
GET    /user/:id      # Buscar usuário por ID (autenticado)
PATCH  /user/:id      # Atualizar usuário (autenticado)
DELETE /user/:id      # Excluir usuário (autenticado)
```

### Projetos

```http
GET    /projects                # Listar projetos
GET    /projects/:id            # Buscar projeto por ID
GET    /projects/user/:userId   # Listar projetos por usuário
POST   /projects                # Criar projeto (admin)
PATCH  /projects/:id            # Atualizar projeto (admin)
DELETE /projects/:id            # Excluir projeto (admin)
```

---

## 🧪 Testes

```bash
cd backend

# Testes unitários
npm run test

# Cobertura
npm run test:cov
```

---

## 🗂️ Estrutura do projeto

```
HeroForce/
  backend/
    src/
      auth/         # Autenticação JWT
      user/         # Módulo de usuários
      projects/     # Módulo de projetos
      enum/         # Enums compartilhados (Character)
    test/           # Testes e2e
  frontend/
    heroforce-web/
      src/
        pages/      # Login, Register, Dashboard
        services/   # Integração com a API
        hooks/      # useAuth
        constants/  # Characters
  docker-compose.yml
  .github/
    workflows/
      ci.yml        # Pipeline de CI
```

---

## 🖹 Observação

Cadastro de usuários com permissão de administrador só está disponivel via API de cadastro, caso queria testar já deixei cadastrado no deploy um usuário pronto
* E-mail: Admin@gmail.com
* Senha: acess_admin

---

## 👤 Autor

**Rafael da Silva Castro**  
Desenvolvedor Fullstack  
[LinkedIn](https://www.linkedin.com/in/swrafael-castro/) · [GitHub](https://github.com/RafaelDaSilvaCastro)
