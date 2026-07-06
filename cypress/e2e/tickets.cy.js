describe('Chamados - HelpDesk Pro', () => {
  it('deve exibir a dashboard com os chamados carregados', () => {
    cy.login()

    cy.get('[data-cy="dashboard-page"]').should('be.visible')
    cy.get('[data-cy="dashboard-title"]')
      .should('be.visible')
      .and('contain', 'Painel de Chamados')

    cy.get('[data-cy="tickets-title"]')
      .should('be.visible')
      .and('contain', 'Chamados recentes')

    cy.get('[data-cy="tickets-table"]').should('be.visible')
    cy.get('[data-cy="ticket-row"]').should('have.length', 4)
    cy.get('[data-cy="results-count"]')
      .should('be.visible')
      .and('contain', 'Exibindo 4 chamado(s)')
  })

  it('deve filtrar chamados por status Resolvido', () => {
    cy.login()

    cy.get('[data-cy="status-filter"]').should('be.visible').select('Resolvido')

    cy.get('[data-cy="results-count"]')
      .should('be.visible')
      .and('contain', 'Exibindo 1 chamado(s)')

    cy.get('[data-cy="ticket-row"]').should('have.length', 1)
    cy.get('[data-cy="tickets-table"]').should('contain', 'CH-1003')
    cy.get('[data-cy="tickets-table"]').should('contain', 'Resolvido')
  })

  it('deve filtrar chamados por status Encerrado', () => {
    cy.login()

    cy.get('[data-cy="status-filter"]').should('be.visible').select('Encerrado')

    cy.get('[data-cy="results-count"]')
      .should('be.visible')
      .and('contain', 'Exibindo 1 chamado(s)')

    cy.get('[data-cy="ticket-row"]').should('have.length', 1)
    cy.get('[data-cy="tickets-table"]').should('contain', 'CH-1004')
    cy.get('[data-cy="tickets-table"]').should('contain', 'Encerrado')
  })

  it('deve voltar a exibir todos os chamados ao selecionar Todos', () => {
    cy.login()

    cy.get('[data-cy="status-filter"]').select('Resolvido')
    cy.get('[data-cy="ticket-row"]').should('have.length', 1)

    cy.get('[data-cy="status-filter"]').select('Todos')

    cy.get('[data-cy="results-count"]')
      .should('be.visible')
      .and('contain', 'Exibindo 4 chamado(s)')

    cy.get('[data-cy="ticket-row"]').should('have.length', 4)
  })
})