describe('Dashboard', () => {
  beforeEach(() => {
    cy.interceptTickets()
    cy.login()
  })

  it('exibe o título e elementos principais', () => {
    cy.get('[data-cy="dashboard-title"]').should('contain.text', 'Painel de Chamados')
    cy.get('[data-cy="tickets-title"]').should('contain.text', 'Chamados recentes')
    cy.get('[data-cy="btn-new-ticket"]').should('be.visible').and('contain.text', '+ Novo Chamado')
    cy.get('[data-cy="user-info"]').should('be.visible')
    cy.get('[data-cy="logout-button"]').should('be.visible')
  })

  it('exibe os 4 cards de métricas com valores corretos', () => {
    cy.get('[data-cy="metric-abertos"]').should('be.visible').and('contain.text', '1')
    cy.get('[data-cy="metric-atendimento"]').should('be.visible').and('contain.text', '1')
    cy.get('[data-cy="metric-resolvidos"]').should('be.visible').and('contain.text', '1')
    cy.get('[data-cy="metric-encerrados"]').should('be.visible').and('contain.text', '1')
  })

  it('exibe a tabela de chamados com 4 linhas', () => {
    cy.get('[data-cy="tickets-table"]').should('be.visible')
    cy.get('[data-cy="ticket-row"]').should('have.length', 4)
  })

  it('exibe o código correto de cada chamado na tabela', () => {
    cy.get('[data-cy="ticket-row"]').eq(0).should('contain.text', 'TKT-001')
    cy.get('[data-cy="ticket-row"]').eq(1).should('contain.text', 'TKT-002')
    cy.get('[data-cy="ticket-row"]').eq(2).should('contain.text', 'TKT-003')
    cy.get('[data-cy="ticket-row"]').eq(3).should('contain.text', 'TKT-004')
  })

  it('exibe a contagem correta de resultados', () => {
    cy.get('[data-cy="results-count"]').should('contain.text', '4 chamado(s)')
  })

  it('filtra chamados por status "Aberto"', () => {
    cy.get('[data-cy="status-filter"]').select('Aberto')
    cy.get('[data-cy="ticket-row"]').should('have.length', 1)
    cy.get('[data-cy="ticket-row"]').should('contain.text', 'Aberto')
    cy.get('[data-cy="ticket-row"]').should('contain.text', 'TKT-001')
    cy.get('[data-cy="results-count"]').should('contain.text', '1 chamado(s)')
  })

  it('filtra chamados por status "Em Atendimento"', () => {
    cy.get('[data-cy="status-filter"]').select('Em Atendimento')
    cy.get('[data-cy="ticket-row"]').should('have.length', 1)
    cy.get('[data-cy="ticket-row"]').should('contain.text', 'Em Atendimento')
    cy.get('[data-cy="ticket-row"]').should('contain.text', 'TKT-002')
    cy.get('[data-cy="results-count"]').should('contain.text', '1 chamado(s)')
  })

  it('filtra chamados por status "Resolvido"', () => {
    cy.get('[data-cy="status-filter"]').select('Resolvido')
    cy.get('[data-cy="ticket-row"]').should('have.length', 1)
    cy.get('[data-cy="ticket-row"]').should('contain.text', 'Resolvido')
    cy.get('[data-cy="ticket-row"]').should('contain.text', 'TKT-003')
  })

  it('filtra chamados por status "Encerrado"', () => {
    cy.get('[data-cy="status-filter"]').select('Encerrado')
    cy.get('[data-cy="ticket-row"]').should('have.length', 1)
    cy.get('[data-cy="ticket-row"]').should('contain.text', 'Encerrado')
    cy.get('[data-cy="ticket-row"]').should('contain.text', 'TKT-004')
  })

  it('retorna a exibir todos os chamados ao selecionar "Todos"', () => {
    cy.get('[data-cy="status-filter"]').select('Resolvido')
    cy.get('[data-cy="ticket-row"]').should('have.length', 1)
    cy.get('[data-cy="status-filter"]').select('Todos')
    cy.get('[data-cy="ticket-row"]').should('have.length', 4)
    cy.get('[data-cy="results-count"]').should('contain.text', '4 chamado(s)')
  })

  it('cada filtro exibe a badge de status correta', () => {
    const expectedBadges = ['status-aberto', 'status-em-atendimento', 'status-resolvido', 'status-encerrado']
    cy.get('[data-cy="ticket-row"]').each(($row, index) => {
      cy.wrap($row).find('.badge').should('have.class', expectedBadges[index])
    })
  })

  it('navega para o formulário de novo chamado ao clicar no botão', () => {
    cy.interceptReferences()
    cy.get('[data-cy="btn-new-ticket"]').click()
    cy.url().should('include', '/tickets/new')
    cy.get('[data-cy="form-page"]').should('be.visible')
  })

  it('navega para os detalhes ao clicar em uma linha da tabela', () => {
    cy.interceptTicket()
    cy.get('[data-cy="ticket-row"]').first().click()
    cy.url().should('include', '/tickets/1')
    cy.get('[data-cy="detail-page"]').should('be.visible')
  })

  it('navega para edição ao clicar no botão editar', () => {
    cy.interceptReferences()
    cy.interceptTicket()
    cy.get('[data-cy="btn-edit"]').first().click()
    cy.url().should('include', '/tickets/1/edit')
    cy.get('[data-cy="form-page"]').should('be.visible')
  })

  it('remove um chamado ao clicar em remover e confirmar', () => {
    cy.intercept('DELETE', '/api/tickets/1', {
      statusCode: 200,
      body: { ok: true, message: 'Ticket removido com sucesso' },
    }).as('deleteTicket')

    cy.get('[data-cy="btn-delete"]').first().click()
    cy.wait('@deleteTicket')
    cy.get('[data-cy="ticket-row"]').should('have.length', 4)
  })
})
