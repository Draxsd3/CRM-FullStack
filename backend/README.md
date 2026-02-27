# CRM Full Stack - MongoDB Edition

Sistema de CRM migrado de MySQL/Sequelize para **MongoDB/Mongoose**.

---

## Mudanças em relação à versão MySQL

| Aspecto | Antes (MySQL) | Agora (MongoDB) |
|---|---|---|
| **Banco de dados** | MySQL + Sequelize | MongoDB + Mongoose |
| **IDs** | INTEGER autoincrement | ObjectId (24-char hex) |
| **Transações** | Sequelize transactions | Mongoose sessions (requer ReplicaSet) |
| **Queries** | SQL / Sequelize ORM | MongoDB queries / Mongoose |
| **Joins** | `include` (SQL JOIN) | `populate` (referência) |
| **Agregações** | `fn`, `col`, `literal` | MongoDB Aggregation Pipeline |
| **Migrations** | sequelize-cli | Não necessário (schema-less) |

### Notas sobre transações

As transações MongoDB requerem um **Replica Set**. Para desenvolvimento local sem replica set, as operações funcionarão normalmente mas sem garantia de atomicidade. Em produção, use MongoDB Atlas ou configure um replica set.

---

## Como rodar

### 1. Pré-requisitos

- Node.js >= 18
- MongoDB >= 6.0 (local ou Atlas)

### 2. Instalar dependências

```bash
cd backend
npm install
```

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
# Edite o .env com sua MONGODB_URI
```

### 4. Popular o banco (seed)

```bash
node database/seed.js
```

### 4.1 Setup completo do banco (colecoes + indices)

```bash
npm run db:setup
```

### 4.2 Setup completo com dados iniciais

```bash
npm run db:setup:seed
```

### 4.3 Reset completo do banco com seed

```bash
npm run db:reset
```

### 5. Iniciar o servidor

```bash
npm run dev
```

### 6. Gerar tokens de teste

```bash
node tools/generate-test-token.js
```

---

## Credenciais padrão (após seed)

| Usuário | E-mail | Senha | Role |
|---|---|---|---|
| Administrador | admin@crmleads.com | Admin@2024 | ADM |
| Renan Ramos | renan@crmleads.com | Renan@2004 | SDR |
| Maria Silva | maria@crmleads.com | Maria@2024 | Closer |
| Carlos Supervisor | carlos@crmleads.com | Carlos@2024 | Supervisor |

---

## Estrutura do projeto

```
backend/
├── config/
│   └── database.js          # Conexão MongoDB
├── controllers/              # Controllers (mesma API)
├── middlewares/               # Auth + Role
├── models/                   # Mongoose schemas
│   ├── User.js
│   ├── Company.js
│   ├── Meeting.js
│   ├── PipelineHistory.js
│   └── KYCReport.js
├── routes/                   # Express routes (inalterados)
├── services/                 # Lógica de negócio (MongoDB)
├── tools/
│   ├── seed.js               # Popular banco
│   └── generate-test-token.js
├── server.js
├── package.json
└── .env.example
```

---

## API endpoints (mesmos da versão MySQL)

- `POST /api/users/login` - Login
- `GET /api/users/me` - Usuário atual
- `GET /api/companies` - Listar empresas
- `POST /api/companies` - Criar empresa
- `GET /api/pipeline` - Pipeline Kanban
- `POST /api/pipeline/update-status` - Mover no pipeline
- `GET /api/meetings` - Listar reuniões
- `POST /api/meetings` - Criar reunião
- `GET /api/reports/full` - Relatório completo

---

## Licença

MIT License - Renan Ramos
