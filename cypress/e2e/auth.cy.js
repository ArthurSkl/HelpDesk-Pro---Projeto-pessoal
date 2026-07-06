describe('Autenticação - HelpDesk Pro', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/')
  })

  it('deve realizar login com sucesso', () => {
    cy.login()

    cy.get('[data-cy="dashboard-page"]').should('be.visible')
    cy.get('[data-cy="dashboard-title"]')
      .should('be.visible')
      .and('contain', 'Painel de Chamados')

    cy.get('[data-cy="user-info"]')
      .should('be.visible')
      .and('contain', 'Arthur Frantz')
  })

  it('deve exibir erro para credenciais inválidas', () => {
    cy.get('[data-cy="login-email"]').type('teste@teste.com')
    cy.get('[data-cy="login-password"]').type('111111')
    cy.get('[data-cy="login-submit"]').click()

    cy.get('[data-cy="login-message"]')
      .should('be.visible')
      .and('contain', 'Credenciais inválidas')
  })

  it('deve validar campos obrigatórios', () => {
    cy.get('[data-cy="login-submit"]').click()

    cy.get('[data-cy="login-message"]')
      .should('be.visible')
      .and('contain', 'Preencha e-mail e senha')
  })

  it('deve permitir logout com sucesso', () => {
    cy.login()

    cy.get('[data-cy="logout-button"]')
      .should('be.visible')
      .click()

    cy.get('[data-cy="login-submit"]').should('be.visible')
    cy.get('[data-cy="login-message"]')
      .should('be.visible')
      .and('contain', 'Logout realizado com sucesso')
  })
})