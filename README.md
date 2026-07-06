# HelpDesk Pro - Projeto pessoal

Sistema web de gestão de chamados pensado para portfólio técnico e apresentação em
entrevistas de QA, Tester Júnior, Analista de Sistemas ou Desenvolvimento Júnior.
Demonstrar:
modelagem de um produto web com regras de negócio reais;
planejamento de testes funcional e E2E;
automação com Cypress;
organização de documentação técnica;
visão de qualidade de software ponta a ponta.
Usuário solicitante
Técnico
Gestor
Login e logout
Abertura de chamado
Edição de chamado enquanto estiver aberto ou em atendimento
Atribuição de técnico
Mudança de status: Aberto, Em Atendimento, Resolvido, Encerrado
Comentários e histórico
Filtros por status, prioridade, responsável e texto
Dashboard com métricas básicas
Front-end: React + Vite
Back-end: Node.js + Express
Banco: PostgreSQL ou SQLite para demo local
HelpDesk Pro - Projeto para Entrevista
Objetivo
Escopo do sistema
Perfis
Funcionalidades principais
Stack sugerida
Testes E2E: Cypress
Versionamento: Git + GitHub
projeto-helpdesk-cypress/
├── README.md
├── docs/
│ ├── 01-visao-geral.md
│ ├── 02-requisitos.md
│ ├── 03-plano-de-testes.md
│ ├── 04-casos-de-teste.md
│ ├── 05-matriz-de-rastreabilidade.md
│ ├── 06-relatorio-de-bugs.md
│ └── 07-roteiro-de-apresentacao.md
├── cypress/
│ ├── e2e/
│ │ ├── auth.cy.js
│ │ ├── chamados.cy.js
│ │ ├── permissoes.cy.js
│ │ └── smoke.cy.js
│ ├── fixtures/
│ │ └── usuarios.json
│ └── support/
│ ├── commands.js
│ └── e2e.js
└── src/
testes independentes entre si;
uso de seletores data-* para reduzir fragilidade;
evitar cy.wait(tempo) arbitrário;
resetar estado antes de cada teste;
usar baseUrl na configuração;
centralizar comandos reutilizáveis.

1. Criar telas principais no front-end.
2. Implementar API básica com autenticação simples.
3. Adicionar atributos data-cy nos elementos críticos.
4. Configurar Cypress.
5. Implementar suíte smoke.
6. Evoluir para regressão funcional.
Estrutura sugerida
Boas práticas Cypress aplicadas neste projeto
Próximos passos de implementação
7. Publicar código no GitHub com prints e evidências.