describe('FixFlow sign in', () => {
  beforeEach(() => {
    cy.clearAllSessionStorage()
  })

  it('signs in with the demo customer and opens the home tab', () => {
    cy.visit('/auth')
    cy.contains('FixFlow', { timeout: 60000 }).should('be.visible')
    cy.contains('button', 'Customer', { timeout: 60000 }).click()
    cy.location('pathname', { timeout: 60000 }).should('eq', '/tabs/home')
    cy.contains('Home', { timeout: 60000 }).should('be.visible')
    cy.contains('Lenovo IdeaPad 3', { timeout: 60000 }).click()
    cy.location('pathname', { timeout: 60000 }).should('match', /^\/request\/[0-9a-f]{32}$/)
    cy.contains('FF-0002', { timeout: 60000 }).should('be.visible')
  })

  it('signs in with the demo owner and opens the dashboard', () => {
    cy.visit('/auth')
    cy.contains('button', 'Business owner', { timeout: 60000 }).click()
    cy.location('pathname', { timeout: 60000 }).should('eq', '/tabs/home')
    cy.contains('Dashboard', { timeout: 60000 }).should('be.visible')
  })
})
