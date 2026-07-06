describe('Login - Mini HelpDesk', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/')
  })

  it('deve realizar login com sucesso', () => {
    cy.get('[data-cy="login-email"]').type('gestor@helpdesk.com')
    cy.get('[data-cy="login-password"]').type('123456')
    cy.get('[data-cy="login-submit"]').click()

    cy.get('[data-cy="login-message"]')
      .should('be.visible')
      .and('contain', 'Login realizado com sucesso')
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
})