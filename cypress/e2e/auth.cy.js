describe('Fluxo de autenticação', () => {
  beforeEach(() => {
    // limpa o armazenamento local antes de cada teste
    cy.clearLocalStorage()

    // acessa a tela de login
    cy.visit('http://localhost:5173/login')
  })

  it('exibe a página de login e aceita as credenciais', () => {
    // valida se os elementos principais da tela de login estão visíveis
    cy.get('[data-cy="login-page"]').should('be.visible')
    cy.get('[data-cy="login-email"]').should('exist')
    cy.get('[data-cy="login-password"]').should('exist')

    // realiza login com o comando customizado
    cy.login()
  })

  it('impede o acesso a /dashboard quando não estiver autenticado', () => {
    // tenta acessar a dashboard sem login
    cy.visit('http://localhost:5173/dashboard', { failOnStatusCode: false })

    // valida se o usuário continua na tela de login
    cy.get('[data-cy="login-page"]').should('be.visible')
    cy.get('[data-cy="login-submit"]').should('be.visible')
  })

  it('permite o logout e redireciona para a página de login com a mensagem', () => {
    // faz login
    cy.login()

    // realiza logout
    cy.get('[data-cy="logout-button"]').click()

    // valida o retorno para a tela de login e a mensagem exibida
    cy.url().should('include', '/login')
    cy.get('[data-cy="login-message"]').should('contain.text', 'Logout realizado com sucesso')
  })
})