describe('CRUD de Chamados', () => {
  describe('Criação', () => {
    beforeEach(() => {
      cy.interceptReferences()
      cy.interceptTickets()
      cy.login()
      cy.get('[data-cy="btn-new-ticket"]').click()
      cy.url().should('include', '/tickets/new')
    })

    it('exibe o formulário de criação com todos os campos', () => {
      cy.get('[data-cy="form-page"]').should('be.visible')
      cy.get('[data-cy="form-title"]').should('be.visible')
      cy.get('[data-cy="form-description"]').should('be.visible')
      cy.get('[data-cy="form-category"]').should('be.visible')
      cy.get('[data-cy="form-priority"]').should('be.visible')
      cy.get('[data-cy="form-status"]').should('be.visible')
      cy.get('[data-cy="form-assignee"]').should('be.visible')
      cy.get('[data-cy="form-cancel"]').should('be.visible')
      cy.get('[data-cy="form-submit"]').should('be.visible')
      cy.contains('Novo Chamado').should('be.visible')
    })

    it('popula os selects com dados da API', () => {
      cy.wait('@getStatuses')
      cy.wait('@getPriorities')
      cy.wait('@getCategories')
      cy.wait('@getUsers')

      cy.get('[data-cy="form-category"]').find('option').should('have.length', 4)
      cy.get('[data-cy="form-category"]').find('option').eq(1).should('have.text', 'Hardware')
      cy.get('[data-cy="form-category"]').find('option').eq(2).should('have.text', 'Software')

      cy.get('[data-cy="form-priority"]').find('option').should('have.length', 4)
      cy.get('[data-cy="form-priority"]').find('option').eq(1).should('have.text', 'Baixa')
      cy.get('[data-cy="form-priority"]').find('option').eq(3).should('have.text', 'Alta')

      cy.get('[data-cy="form-status"]').find('option').should('have.length', 5)
      cy.get('[data-cy="form-status"]').find('option').eq(1).should('have.text', 'Aberto')
      cy.get('[data-cy="form-status"]').find('option').eq(3).should('have.text', 'Resolvido')

      cy.get('[data-cy="form-assignee"]').find('option').should('have.length', 4)
      cy.get('[data-cy="form-assignee"]').find('option').eq(1).should('have.text', 'Gestor')
    })

    it('cria um novo chamado com sucesso', () => {
      cy.intercept('POST', '/api/tickets', {
        statusCode: 201,
        body: { ok: true, ticket: { id: 5 } },
      }).as('createTicket')

      cy.get('[data-cy="form-title"]').type('Novo chamado de teste')
      cy.get('[data-cy="form-description"]').type('Descrição detalhada do problema')
      cy.get('[data-cy="form-category"]').select('Hardware')
      cy.get('[data-cy="form-priority"]').select('Alta')
      cy.get('[data-cy="form-status"]').select('Aberto')
      cy.get('[data-cy="form-submit"]').click()
      cy.wait('@createTicket')
      cy.url().should('include', '/dashboard')
    })

    it('volta para dashboard ao clicar em cancelar', () => {
      cy.get('[data-cy="form-cancel"]').click()
      cy.url().should('include', '/dashboard')
    })
  })

  describe('Edição', () => {
    beforeEach(() => {
      cy.interceptReferences()
      cy.interceptTickets()
      cy.intercept('GET', '/api/tickets/*', { fixture: 'ticket' }).as('getTicket')
      cy.login()
      cy.get('[data-cy="btn-edit"]').first().click()
      cy.url().should('include', '/tickets/')
    })

    it('exibe formulário de edição com dados carregados', () => {
      cy.wait('@getTicket')
      cy.get('[data-cy="form-page"]').should('be.visible')
      cy.contains('Editar Chamado').should('be.visible')
      cy.get('[data-cy="form-title"]').should('have.value', 'Computador não liga')
      cy.get('[data-cy="form-description"]').should('have.value', 'Máquina da sala 203 não apresenta sinal de energia após queda de energia ontem à noite. Já verifiquei a tomada e o cabo de força, ambos estão ok.')
    })

    it('atualiza título do chamado com sucesso', () => {
      cy.intercept('PUT', '/api/tickets/*', {
        statusCode: 200,
        body: { ok: true, ticket: { id: 1 } },
      }).as('updateTicket')

      cy.wait('@getTicket')
      cy.get('[data-cy="form-title"]').clear().type('Título atualizado')
      cy.get('[data-cy="form-submit"]').click()
      cy.wait('@updateTicket')
      cy.url().should('include', '/dashboard')
    })
  })

  describe('Visualização de detalhes', () => {
    beforeEach(() => {
      cy.interceptTickets()
      cy.intercept('GET', '/api/tickets/*', { fixture: 'ticket' }).as('getTicket')
      cy.login()
      cy.get('[data-cy="ticket-row"]').first().click()
      cy.url().should('match', /\/tickets\/\d+/)
    })

    it('exibe todos os campos do chamado', () => {
      cy.get('[data-cy="detail-page"]').should('be.visible')
      cy.get('[data-cy="detail-title"]').should('contain.text', 'TKT-001')
      cy.contains('Computador não liga').should('be.visible')
      cy.contains('Hardware').should('be.visible')
      cy.contains('Alta').should('be.visible')
      cy.contains('Maria Souza').should('be.visible')
      cy.contains('Gestor').should('be.visible')
    })

    it('exibe os botões de ação na página de detalhes', () => {
      cy.get('[data-cy="detail-back"]').should('be.visible').and('contain.text', 'Voltar')
      cy.get('[data-cy="detail-edit"]').should('be.visible').and('contain.text', 'Editar')
      cy.get('[data-cy="detail-delete"]').should('be.visible').and('contain.text', 'Remover')
    })

    it('navega de volta para dashboard', () => {
      cy.get('[data-cy="detail-back"]').click()
      cy.url().should('include', '/dashboard')
    })

    it('navega para edição a partir dos detalhes', () => {
      cy.interceptReferences()
      cy.intercept('GET', '/api/tickets/*', { fixture: 'ticket' }).as('getTicketEdit')
      cy.get('[data-cy="detail-edit"]').click()
      cy.url().should('include', '/tickets/1/edit')
    })

    it('remove chamado a partir dos detalhes', () => {
      cy.intercept('DELETE', '/api/tickets/*', {
        statusCode: 200,
        body: { ok: true, message: 'Ticket removido com sucesso' },
      }).as('deleteFromDetail')

      cy.get('[data-cy="detail-delete"]').click()
      cy.wait('@deleteFromDetail')
      cy.url().should('include', '/dashboard')
    })
  })
})
