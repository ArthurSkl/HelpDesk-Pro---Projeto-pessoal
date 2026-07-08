describe('Navegação e Redirecionamentos', () => {
  beforeEach(() => {
    cy.clearAllLocalStorage()
  })

  it('redireciona de / para /login', () => {
    cy.visit('/')
    cy.url().should('include', '/login')
    cy.get('[data-cy="login-page"]').should('be.visible')
  })

  it('redireciona rotas inexistentes para /login', () => {
    cy.visit('/rota-inexistente', { failOnStatusCode: false })
    cy.url().should('include', '/login')
  })

  it('mantém usuário na dashboard ao recarregar a página', () => {
    cy.interceptTickets()
    cy.login()
    cy.reload()
    cy.get('[data-cy="dashboard-page"]').should('be.visible')
  })

  it('mantém sessão ao navegar entre páginas protegidas', () => {
    cy.interceptTickets()
    cy.interceptReferences()
    cy.interceptTicket()
    cy.login()

    cy.get('[data-cy="btn-new-ticket"]').click()
    cy.url().should('include', '/tickets/new')
    cy.get('[data-cy="form-page"]').should('be.visible')

    cy.visit('/dashboard')
    cy.get('[data-cy="dashboard-page"]').should('be.visible')

    cy.get('[data-cy="ticket-row"]').first().click()
    cy.url().should('match', /\/tickets\/\d+/)
    cy.get('[data-cy="detail-page"]').should('be.visible')

    cy.visit('/dashboard')
    cy.get('[data-cy="dashboard-page"]').should('be.visible')
  })

  it('limpa localStorage ao fazer logout e redireciona', () => {
    cy.interceptTickets()
    cy.login()
    cy.get('[data-cy="logout-button"]').click()

    cy.window().then((win) => {
      const user = win.localStorage.getItem('helpdesk_user')
      expect(user).to.be.null
    })
  })

  it('redireciona para /login com localStorage inválido', () => {
    cy.visit('/login')

    cy.window().then((win) => {
      win.localStorage.setItem('helpdesk_user', '{"nome":"Invalido"}')
    })

    cy.visit('/dashboard', { failOnStatusCode: false })
    cy.url().should('include', '/login')
  })

  it('redireciona para /login com JSON malformado no localStorage', () => {
    cy.visit('/login')

    cy.window().then((win) => {
      win.localStorage.setItem('helpdesk_user', 'not-valid-json')
    })

    cy.visit('/dashboard', { failOnStatusCode: false })
    cy.url().should('include', '/login')
  })
})
