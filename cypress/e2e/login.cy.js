describe('Login e Dashboard - HelpDesk Pro', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('http://localhost:5173/dashboard#/login')
  })

  it('deve realizar login com sucesso e abrir a dashboard', () => {
    cy.login()
    cy.get('[data-cy="dashboard-page"]').should('be.visible')
    cy.get('[data-cy="dashboard-title"]').should('be.visible').and('contain', 'Painel de Chamados')
    cy.get('[data-cy="user-info"]').should('be.visible').and('contain', 'Arthur Frantz')
    cy.get('[data-cy="tickets-table"]').should('be.visible')
    cy.get('[data-cy="ticket-row"]').should('have.length', 4)
  })

  it('deve exibir erro para credenciais inválidas', () => {
    cy.get('[data-cy="login-email"]').type('teste@teste.com')
    cy.get('[data-cy="login-password"]').type('111111')
    cy.get('[data-cy="login-submit"]').click()
    cy.get('[data-cy="login-message"]').should('be.visible').and('contain', 'Credenciais inválidas')
  })

  it('deve validar campos obrigatórios', () => {
    cy.get('[data-cy="login-submit"]').click()
    cy.get('[data-cy="login-message"]').should('be.visible').and('contain', 'Preencha e-mail e senha')
  })

  it('deve permitir logout e voltar para a tela de login', () => {
    cy.login()
    cy.get('[data-cy="logout-button"]').should('be.visible').click()
    cy.get('[data-cy="login-submit"]').should('be.visible')
    cy.get('[data-cy="login-message"]').should('be.visible').and('contain', 'Logout realizado com sucesso')
  })
})