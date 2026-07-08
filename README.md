# HelpDesk Pro

Sistema corporativo de gerenciamento de chamados (helpdesk/ticketing) com arquitetura REST + React. Construído como projeto para entrevista, demonstrando boas práticas de desenvolvimento full-stack.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | React 19 + Vite 8 + React Router 7 |
| **Backend** | Express 5 + PostgreSQL |
| **Autenticação** | bcryptjs (hash de senha) |
| **Testes** | Cypress 15 (E2E com mocks) |
| **Proxy** | Vite dev server → backend (`/api` → `:3001`) |

---

## Funcionalidades

- **Autenticação** — Login e cadastro com bcryptjs, sessão via localStorage, rotas protegidas
- **Dashboard** — Métricas em tempo real (abertos, em atendimento, resolvidos, encerrados), filtro por status, tabela com badges coloridas
- **CRUD completo** — Criar, editar, visualizar e remover chamados com validação de campos
- **Referências dinâmicas** — Status, prioridades, categorias e usuários carregados da API
- **Interface moderna** — Tema escuro corporativo, glassmorphism, animações CSS, responsivo
- **Código do chamado** — Geração automática no formato `TKT-001`, `TKT-002`...

---

## Estrutura do projeto

```
HelpDesk Pro/
├── backend/
│   ├── controllers/       # Lógica das rotas (tickets, auth, references)
│   ├── routes/            # Definição das rotas REST
│   ├── src/
│   │   ├── config/db.js   # Pool PostgreSQL
│   │   └── models/        # Ticket, User, Reference (queries SQL)
│   └── seed.js            # Cria usuário gestor no banco
├── src/
│   ├── api/index.js       # Cliente HTTP (request, ticketsApi, authApi, referencesApi)
│   ├── components/        # ProtectedRoute
│   ├── pages/             # LoginPage, DashboardPage, TicketFormPage, TicketDetailsPage
│   ├── App.css            # Estilos globais (1200+ linhas)
│   ├── index.css          # Fonte Inter, scrollbar customizada
│   └── main.jsx           # Entry point React
├── cypress/
│   ├── e2e/               # Testes: auth, dashboard, tickets, navigation
│   ├── fixtures/          # Dados mock (tickets, ticket, references, auth)
│   └── support/           # Comandos customizados (login, intercepts)
├── cypress.config.js      # Config Cypress (baseUrl, viewport)
├── vite.config.js         # Proxy /api → backend :3001
└── package.json           # Scripts dev, build, cy:open, cy:run
```

---

## Como rodar

### 1. Banco de dados

Crie um banco PostgreSQL chamado `Help-Desk` e execute o script de schema (tabelas `users`, `tickets`, `ticket_statuses`, `ticket_priorities`, `ticket_categories`).

```bash
# Config padrão esperada:
# host: localhost
# port: 5432
# user: postgres
# password: 123
# database: Help-Desk
```

### 2. Backend

```bash
cd backend
npm install
npm run seed    # Cria gestor@helpdesk.com / 123456
npm start       # Inicia na porta 3001
```

### 3. Frontend

```bash
# Na raiz do projeto
npm install
npm run dev     # Inicia na porta 5173
```

Acesse `http://localhost:5173` e faça login com:

> **E-mail:** gestor@helpdesk.com  
> **Senha:** 123456

---

## Testes

Os testes usam `cy.intercept()` para mockar todas as APIs — rodam **sem dependência do backend**.

```bash
# Terminal (headless)
npm run cy:run

# Interface gráfica
npm run cy:open
```

### Cobertura (47 testes)

| Arquivo | Testes | O que valida |
|---------|--------|--------------|
| `auth.cy.js` | 14 | Login, register, logout, toggle, validações, redirect de rotas protegidas, erro de credenciais, e-mail duplicado, senha curta |
| `dashboard.cy.js` | 15 | Métricas, filtro por cada status, contagem, badges, navegação para novo/detalhes/edição, remover |
| `navigation.cy.js` | 7 | Redirect `/` → `/login`, 404, sessão entre páginas, localStorage inválido, JSON malformado |
| `tickets.cy.js` | 11 | CRUD completo: criar com selects populados, editar com dados carregados, visualizar detalhes, remover |

---

## API

### Autenticação
```
POST /auth/login    { email, password }   → { ok, user }
POST /auth/register { name, email, password, role? } → { ok, user }
```

### Tickets
```
GET    /tickets       → Ticket[]
GET    /tickets/:id   → { ok, ticket }
POST   /tickets       → { ok, ticket }
PUT    /tickets/:id   → { ok, ticket }
DELETE /tickets/:id   → { ok, message }
```

### Referências
```
GET /references/statuses
GET /references/priorities
GET /references/categories
GET /references/users
```

---

## Licença

Projeto pessoal — código livre para estudo e referência.
