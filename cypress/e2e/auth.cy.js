describe('Autenticação', () => {
  beforeEach(() => {
    cy.clearAllLocalStorage()
  })

  it('exibe a página de login com todos os elementos', () => {
    cy.visit('/login')
    cy.get('[data-cy="login-page"]').should('be.visible')
    cy.get('[data-cy="login-email"]').should('be.visible')
    cy.get('[data-cy="login-password"]').should('be.visible')
    cy.get('[data-cy="login-submit"]').should('be.visible').and('have.value', '')
    cy.get('[data-cy="login-submit"]').should('contain.text', 'Entrar')
    cy.get('[data-cy="toggle-register"]').should('be.visible').and('contain.text', 'Cadastre-se')
    cy.contains('Acesso para teste').should('be.visible')
    cy.contains('gestor@helpdesk.com').should('be.visible')
  })

  it('redireciona para /login ao acessar rota protegida sem autenticação', () => {
    cy.visit('/dashboard', { failOnStatusCode: false })
    cy.url().should('include', '/login')
    cy.get('[data-cy="login-page"]').should('be.visible')

    cy.visit('/tickets/1', { failOnStatusCode: false })
    cy.url().should('include', '/login')

    cy.visit('/tickets/new', { failOnStatusCode: false })
    cy.url().should('include', '/login')

    cy.visit('/tickets/1/edit', { failOnStatusCode: false })
    cy.url().should('include', '/login')
  })

  it('realiza login com sucesso e exibe dashboard', () => {
    cy.login()
    cy.get('[data-cy="dashboard-title"]').should('contain.text', 'Painel de Chamados')
  })

  it('exibe dados corretos do usuário logado no topbar', () => {
    cy.login()
    cy.get('[data-cy="user-info"]').should('contain.text', 'Gestor')
    cy.get('[data-cy="user-info"]').should('contain.text', 'admin')
  })

  it('exibe mensagem de erro para credenciais inválidas', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: { ok: false, message: 'Credenciais inválidas' },
    }).as('loginFail')

    cy.visit('/login')
    cy.get('[data-cy="login-email"]').type('invalido@email.com')
    cy.get('[data-cy="login-password"]').type('senha_errada')
    cy.get('[data-cy="login-submit"]').click()
    cy.wait('@loginFail')
    cy.get('[data-cy="login-message"]').should('contain.text', 'Credenciais inválidas')
    cy.url().should('include', '/login')
  })

  it('exibe erro ao tentar login com campos vazios', () => {
    cy.visit('/login')
    cy.get('[data-cy="login-submit"]').click()
    cy.get('[data-cy="login-message"]').should('contain.text', 'Preencha e-mail e senha')
  })

  it('exibe erro ao tentar login apenas com email preenchido', () => {
    cy.visit('/login')
    cy.get('[data-cy="login-email"]').type('gestor@helpdesk.com')
    cy.get('[data-cy="login-submit"]').click()
    cy.get('[data-cy="login-message"]').should('contain.text', 'Preencha e-mail e senha')
  })

  it('realiza logout e redireciona para login com mensagem', () => {
    cy.login()
    cy.get('[data-cy="logout-button"]').click()
    cy.url().should('include', '/login')
    cy.get('[data-cy="login-message"]').should('contain.text', 'Logout realizado com sucesso')
  })

  it('após logout, dashboard não fica mais acessível', () => {
    cy.login()
    cy.get('[data-cy="logout-button"]').click()
    cy.visit('/dashboard', { failOnStatusCode: false })
    cy.url().should('include', '/login')
  })

  it('alterna entre formulários de login e cadastro', () => {
    cy.visit('/login')
    cy.get('[data-cy="login-submit"]').should('contain.text', 'Entrar')
    cy.get('[data-cy="toggle-register"]').click()
    cy.get('[data-cy="reg-submit"]').should('be.visible').and('contain.text', 'Criar Conta')
    cy.get('[data-cy="reg-name"]').should('be.visible')
    cy.get('[data-cy="reg-email"]').should('be.visible')
    cy.get('[data-cy="reg-password"]').should('be.visible')
    cy.get('[data-cy="toggle-login"]').should('contain.text', 'Faça login')
    cy.get('[data-cy="toggle-login"]').click()
    cy.get('[data-cy="login-submit"]').should('be.visible').and('contain.text', 'Entrar')
  })

  it('realiza cadastro de novo usuário com sucesso', () => {
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 201,
      body: { ok: true, user: { id: 4, name: 'Novo Usuário', email: 'novo@teste.com', role: 'requester' } },
    }).as('registerRequest')

    cy.visit('/login')
    cy.get('[data-cy="toggle-register"]').click()
    cy.get('[data-cy="reg-name"]').type('Novo Usuário')
    cy.get('[data-cy="reg-email"]').type('novo@teste.com')
    cy.get('[data-cy="reg-password"]').type('123456')
    cy.get('[data-cy="reg-submit"]').click()
    cy.wait('@registerRequest')
    cy.get('[data-cy="login-message"]').should('contain.text', 'Conta criada com sucesso')
    cy.get('[data-cy="login-submit"]').should('be.visible')
  })

  it('exibe erro ao cadastrar com e-mail já existente', () => {
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 409,
      body: { ok: false, message: 'E-mail já cadastrado' },
    }).as('registerConflict')

    cy.visit('/login')
    cy.get('[data-cy="toggle-register"]').click()
    cy.get('[data-cy="reg-name"]').type('Gestor')
    cy.get('[data-cy="reg-email"]').type('gestor@helpdesk.com')
    cy.get('[data-cy="reg-password"]').type('123456')
    cy.get('[data-cy="reg-submit"]').click()
    cy.wait('@registerConflict')
    cy.get('[data-cy="login-message"]').should('contain.text', 'E-mail já cadastrado')
  })

  it('exibe erro ao cadastrar com senha menor que 4 caracteres', () => {
    cy.visit('/login')
    cy.get('[data-cy="toggle-register"]').click()
    cy.get('[data-cy="reg-name"]').type('Teste')
    cy.get('[data-cy="reg-email"]').type('teste@teste.com')
    cy.get('[data-cy="reg-password"]').type('123')
    cy.get('[data-cy="reg-submit"]').click()
    cy.get('[data-cy="login-message"]').should('contain.text', 'mínimo 4 caracteres')
  })

  it('exibe erro ao cadastrar com campos vazios', () => {
    cy.visit('/login')
    cy.get('[data-cy="toggle-register"]').click()
    cy.get('[data-cy="reg-submit"]').click()
    cy.get('[data-cy="login-message"]').should('contain.text', 'Preencha todos os campos')
  })
})
