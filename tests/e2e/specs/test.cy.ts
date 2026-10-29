describe('FixFlow public experience', () => {
  beforeEach(() => {
    cy.clearAllLocalStorage()
    cy.clearAllSessionStorage()
  })

  it('shows the landing page and changes the appearance preference', () => {
    cy.visit('/')
    cy.contains('h1', 'Repairs, quoted and booked in one place').should('be.visible')

    cy.get('[data-appearance-opt="dark"]').click()
    cy.get('html').should('have.attr', 'data-appearance', 'dark')

    cy.get('[data-appearance-opt="light"]').click()
    cy.get('html').should('have.attr', 'data-appearance', 'light')
  })

  it('validates the sign-in form before contacting the database', () => {
    cy.visit('/auth')
    cy.get('form button[type="submit"]').click()
    cy.contains('Enter your email address').should('be.visible')
    cy.contains('Enter your password').should('be.visible')
  })
})
