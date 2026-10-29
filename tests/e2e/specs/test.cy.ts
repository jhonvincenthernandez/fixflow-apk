describe('FixFlow public experience', () => {
  beforeEach(() => {
    cy.clearAllLocalStorage()
    cy.clearAllSessionStorage()
  })

  it('shows the landing page and changes the appearance preference', () => {
    cy.visit('/')
    cy.contains('h1', 'Repairs, quoted and booked in one place').should('be.visible')

    cy.get('[data-appearance-opt="system"]').should('have.attr', 'aria-pressed', 'true')

    cy.get('[data-appearance-opt="dark"]').click()
    cy.get('html').should('have.attr', 'data-appearance', 'dark')
    cy.get('[data-appearance-opt="dark"]').should('have.attr', 'aria-pressed', 'true')
    cy.get('[data-appearance-opt="system"]').should('have.attr', 'aria-pressed', 'false')

    cy.get('[data-appearance-opt="light"]').click()
    cy.get('html').should('have.attr', 'data-appearance', 'light')
    cy.get('[data-appearance-opt="light"]').should('have.attr', 'aria-pressed', 'true')
    cy.get('[data-appearance-opt="dark"]').should('have.attr', 'aria-pressed', 'false')
  })

  it('stacks the appearance panel on phones and rows it on wide cards', () => {
    cy.viewport(320, 800)
    cy.visit('/')
    cy.contains('h1', 'Repairs, quoted and booked in one place').should('be.visible')
    cy.get('.appearance-panel__body').should('have.css', 'display', 'flex')

    cy.viewport(720, 900)
    cy.get('.appearance-panel__body').should('have.css', 'display', 'grid')
  })

  it('validates the sign-in form before contacting the database', () => {
    cy.visit('/auth')
    cy.get('form button[type="submit"]').click()
    cy.contains('Enter your email address').should('be.visible')
    cy.contains('Enter your password').should('be.visible')
  })
})
