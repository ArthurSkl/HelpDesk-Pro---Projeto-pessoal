Cypress.Commands.add('login', (email = 'gestor@helpdesk.com', password = '123456') => {
  cy.visit('http://localhost:5173/')
  cy.get('[data-cy="login-email"]').type(email)
  cy.get('[data-cy="login-password"]').type(password)
  cy.get('[data-cy="login-submit"]').click()
})