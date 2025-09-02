__DELETE_ME__

# CRM Securitizadora

Sistema CRM full‑stack para gestão de prospecção, pipeline e reuniões de uma securitizadora. O projeto inclui API REST em Node.js/Express com Sequelize (MySQL) e uma SPA em React com interface moderna e produtiva.

## Sumário
- Descrição
- Funcionalidades
- Tecnologias utilizadas
- Arquitetura do projeto
- Como executar
- Variáveis de ambiente
- Banco de dados e dados de teste
- Scripts úteis
- Qualidade e segurança
- Como contribuir
- Licença

## Descrição
Este CRM facilita o dia a dia do time comercial: cadastro de empresas, organização do funil (pipeline) em formato Kanban, agendamento/gestão de reuniões, relatórios e histórico de movimentações. Foi projetado para ser claro, seguro e pronto para demonstração em portfólio.

## Funcionalidades
- Autenticação com JWT e controle de acesso
- Gestão de empresas (cadastro, edição, KYC)
- Pipeline Kanban com arrastar/soltar e histórico de mudanças
- Agenda e reuniões (criação, remarcação, listagem por período)
- Relatórios e exportações (gráficos e planilhas)
- Notificações e feedback ao usuário
- API REST padronizada sob /api

## Tecnologias utilizadas
Backend
- Node.js, Express, Sequelize (MySQL), mysql2
- Autenticação JWT, Helmet, CORS, dotenv, morgan
Frontend
- React 18 (CRA), React Router, Axios
- MUI, React Big Calendar, Chart.js
- React Toastify, Formik/Yup
Ferramentas
- Nodemon, concurrently, sequelize-cli

## Arquitetura do projeto
- backend: API, modelos, serviços, controladores e rotas
- frontend: SPA React com páginas, componentes e serviços
- sql: scripts de schema, updates e carga de dados de teste

Consulte project-structure.txt para a visão completa de pastas.

## Como executar
Pré-requisitos
- Node.js 18+
- MySQL 5.7+ ou 8.x

1) Clonar e instalar
- npm install (raiz) irá instalar backend e frontend:
  npm install

2) Configurar variáveis de ambiente
- Copie e ajuste os arquivos .env:
  - backend/.env
  - frontend/.env (opcional, ex: REACT_APP_API_URL)

3) Banco de dados
- Crie o schema no MySQL e garanta as permissões do usuário
- Rode os scripts em /sql conforme seção “Banco de dados e dados de teste”

4) Iniciar em desenvolvimento (API e Web)
- Início simultâneo:
  npm start
- Ou separado:
  cd backend && npm run dev
  cd frontend && npm start

Endpoints e portas (padrão)
- API: http://localhost:3001/api
- Frontend (CRA): http://localhost:3000

## Variáveis de ambiente
Backend (backend/.env)
- PORT: porta da API (ex: 3001)
- NODE_ENV: development | production
- JWT_SECRET: segredo JWT forte e único
- DB_NAME, DB_USER, DB_PASS, DB_HOST, DB_DIALECT: config do MySQL
- ALLOWED_ORIGINS: origens CORS (ex: http://localhost:3000)

Frontend (frontend/.env)
- REACT_APP_API_URL: URL base da API (ex: http://localhost:3001/api)

Nunca faça commit de valores sensíveis; utilize .env locais.

## Banco de dados e dados de teste
1) Schema inicial
- Execute o script SQL do schema:
  sql/securitizadora_crm_schema.sql

2) Atualizações/Migrações manuais
- Caso haja updates (ex.: correção de colunas), rode:
  sql/update_users_table.sql
  e demais scripts de atualização quando aplicável

3) Dados de teste
- Popule com dados sintéticos (ex.: empresas, reuniões):
  sql/insert_test_data.sql

Observação: Se sua base já possuir dados, revise chaves estrangeiras antes de inserts (ex.: assignedUserId deve apontar para um user.id válido).

## Scripts úteis
Raiz
- npm start: inicia backend e frontend juntos
- npm run start:backend | start:frontend

Backend
- npm run dev: inicia API com nodemon
- npm run migrate: executa migrations (se configuradas)
- npm run seed: executa seeds (se configurados)

Frontend
- npm start: inicia CRA
- npm run build: build de produção

## Qualidade e segurança
- Helmet e CORS configurados no backend
- JWT para autenticação
- Log de requisições com morgan (dev)
- Separação de responsabilidades (controllers, services, models)
- Boas práticas de UX (feedbacks, validações)

Checklist antes de publicar
- Defina JWT_SECRET diferente em produção
- Ajuste ALLOWED_ORIGINS
- Revise .env (não versionar)
- Rode build do frontend e sirva com um servidor estático se desejar deploy

## Como contribuir
- Faça um fork
- Crie uma branch feature/nome-da-feature
- Commit mensagens claras
- Abra um Pull Request descrevendo mudanças e contexto

Sugestões são bem-vindas: melhorias de performance, testes, acessibilidade, DX, documentação.

## Licença
Este projeto é disponibilizado para fins de demonstração no portfólio. Adapte a licença conforme sua necessidade (ex.: MIT). Entre em contato para usos comerciais.

