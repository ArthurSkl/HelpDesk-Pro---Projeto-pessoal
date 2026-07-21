HelpDesk Pro
Sistema web de gerenciamento de chamados desenvolvido como projeto de portfólio e entrevista técnica. A aplicação foi estruturada para demonstrar conceitos de desenvolvimento full stack, incluindo autenticação, CRUD completo, integração com API, proteção de rotas e testes end-to-end 
.

Visão geral
O HelpDesk Pro simula um ambiente corporativo de atendimento interno ou suporte técnico, permitindo que usuários façam login, consultem chamados, acompanhem status e realizem operações de criação, edição, visualização e remoção de tickets 
.

No frontend, o projeto utiliza React com Vite e navegação baseada em React Router DOM. O ambiente de desenvolvimento também está configurado para consumir uma API backend local por meio de proxy /api apontando para a porta 3001 
.

Stack utilizada
Camada	Tecnologia
Frontend	React
Build e desenvolvimento	Vite
Roteamento	React Router DOM
Estilização	CSS puro
Sessão no cliente	localStorage
Integração com backend	API local via proxy /api
Testes	Cypress
Funcionalidades
Login e cadastro de usuários 

Persistência de sessão no navegador com localStorage 

Proteção de rotas para páginas autenticadas 

Dashboard com métricas por status e listagem de chamados 

Filtro de chamados por status 

CRUD completo de tickets 

Carregamento dinâmico de status, prioridades, categorias e usuários 

Interface preparada para testes E2E com seletores data-cy 

Estrutura do projeto
bash
HelpDesk Pro/
├── backend/
├── src/
│   ├── components/
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── TicketFormPage.jsx
│   │   └── TicketDetailsPage.jsx
│   ├── index.css
│   └── main.jsx
├── cypress/
├── vite.config.js
└── start-project.txt
Como executar
1. Frontend
Na raiz do projeto:

bash
npm install
npm run dev
A aplicação frontend deve abrir em:

bash
http://localhost:5173/
As instruções operacionais anexadas também indicam esse mesmo fluxo de execução 
.

2. Backend
Na pasta backend:

bash
cd backend
npm install
npm run dev
A API backend deve estar disponível em:

bash
http://localhost:3001/
O frontend está configurado para redirecionar chamadas /api para essa porta durante o desenvolvimento 
.

3. Testes com Cypress
Na raiz do projeto:

bash
npm install cypress --save-dev
npx cypress open
Ou para rodar no terminal:

bash
npx cypress run
Os testes devem ser executados a partir da raiz do projeto, e o frontend precisa estar ativo para que o fluxo funcione corretamente 
.

Fluxo da aplicação
O usuário acessa a tela de login ou cadastro 
.

Após autenticação, os dados do usuário são salvos no navegador 
.

O sistema libera o acesso às rotas protegidas 
.

O dashboard carrega os chamados e exibe métricas operacionais 
.

O usuário pode criar, editar, visualizar ou remover tickets 
.

Autenticação e sessão
O projeto utiliza autenticação integrada ao backend e persistência de sessão no frontend com localStorage. Após o login, o objeto helpdesk_user é armazenado no navegador e utilizado para manter o contexto do usuário autenticado e controlar o acesso às páginas protegidas 
.

Esse mecanismo não substitui o banco de dados. O banco armazena os dados persistentes do sistema, enquanto o localStorage é usado apenas para manter a sessão e facilitar a navegação no cliente 
.

Páginas principais
LoginPage
Responsável pelos fluxos de login e cadastro, validação básica dos campos, mensagens de retorno e armazenamento do usuário autenticado 
.

DashboardPage
Exibe a lista de chamados, métricas por status, filtros de visualização, logout e ações principais sobre cada ticket 
.

TicketFormPage
Centraliza a criação e edição de chamados, carregando dados auxiliares da API e enviando o payload tratado para o backend 
.

TicketDetailsPage
Mostra os detalhes completos de um chamado, incluindo informações operacionais e ações para voltar, editar ou remover 
.

Objetivo do projeto
O HelpDesk Pro foi construído para demonstrar capacidade de desenvolver uma aplicação com interface moderna, navegação entre páginas, integração com API, controle de sessão, estrutura de CRUD e preocupação com testabilidade. Como projeto de portfólio, ele evidencia competências relevantes para vagas júnior em desenvolvimento web e vagas de tester júnior.
.