Cypress.Commands.add('login', (email = 'gestor@helpdesk.com', password = '123456') => {
  cy.intercept('POST', '/api/auth/login', {
    statusCode: 200,
    body: {
      ok: true,
      user: { id: 1, name: 'Gestor', email, role: 'admin' },
    },
  }).as('loginRequest')

  cy.visit('/login')
  cy.get('[data-cy="login-email"]').clear().type(email)
  cy.get('[data-cy="login-password"]').clear().type(password)
  cy.get('[data-cy="login-submit"]').click()
  cy.wait('@loginRequest')
  cy.url().should('include', '/dashboard')
  cy.get('[data-cy="dashboard-page"]').should('be.visible')
})

Cypress.Commands.add('interceptReferences', () => {
  cy.fixture('references').then((refs) => {
    cy.intercept('GET', '/api/references/statuses', refs.statuses).as('getStatuses')
    cy.intercept('GET', '/api/references/priorities', refs.priorities).as('getPriorities')
    cy.intercept('GET', '/api/references/categories', refs.categories).as('getCategories')
    cy.intercept('GET', '/api/references/users', refs.users).as('getUsers')
  })
})

Cypress.Commands.add('interceptTickets', () => {
  cy.fixture('tickets').then((tickets) => {
    cy.intercept('GET', '/api/tickets', tickets).as('getTickets')
  })
})

Cypress.Commands.add('interceptTicket', () => {
  cy.fixture('ticket').then((ticketData) => {
    cy.intercept('GET', '/api/tickets/*', ticketData).as('getTicket')
  })
})
