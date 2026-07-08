Cypress.Commands.add('login', (email = 'gestor@helpdesk.com', password = '123456') => {
  cy.visit('http://localhost:5173/dashboard#/login')
  cy.get('[data-cy="login-email"]').clear().type(email)
  cy.get('[data-cy="login-password"]').clear().type(password)
  cy.get('[data-cy="login-submit"]').click()
  cy.url().should('include', '/dashboard')
  cy.get('[data-cy="dashboard-page"]').should('be.visible')
})