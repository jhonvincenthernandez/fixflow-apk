describe('FixFlow public experience', () => {
  beforeEach(() => {
    cy.clearAllLocalStorage()
    cy.clearAllSessionStorage()
  })

  it('opens the appearance panel from the landing header and changes the preference', () => {
    cy.visit('/')
    cy.get('#landing-title').should('be.visible')
    cy.get('#landing-title').should('have.attr', 'aria-label', 'Repairs, quoted and booked in one place')
    cy.get('.ff-typewriter__live', { timeout: 5000 }).should('have.text', 'Repairs, quoted and booked in one place')
    cy.get('footer').find('[data-appearance-opt]').should('not.exist')

    cy.get('#landing-appearance-trigger')
      .should('be.visible')
      .and('have.attr', 'aria-expanded', 'false')
      .click()

    cy.get('#landing-appearance-popover').should('have.attr', 'role', 'dialog')
    cy.get('#landing-appearance').should('be.visible').and('have.text', 'Appearance')
    cy.get('[data-appearance-opt="system"]')
      .should('be.visible')
      .and('have.attr', 'aria-pressed', 'true')
    cy.get('#landing-appearance-trigger').should('have.attr', 'aria-expanded', 'true')

    cy.get('[data-appearance-opt="dark"]').click()
    cy.get('html').should('have.attr', 'data-appearance', 'dark')
    cy.get('[data-appearance-opt="dark"]').should('have.attr', 'aria-pressed', 'true')
    cy.get('[data-appearance-opt="system"]').should('have.attr', 'aria-pressed', 'false')

    cy.get('[data-appearance-opt="light"]').click()
    cy.get('html').should('have.attr', 'data-appearance', 'light')
    cy.get('[data-appearance-opt="light"]').should('have.attr', 'aria-pressed', 'true')
    cy.get('[data-appearance-opt="dark"]').should('have.attr', 'aria-pressed', 'false')

    cy.get('body').type('{esc}')
    cy.get('#landing-appearance-trigger').should('have.attr', 'aria-expanded', 'false')
  })

  it('keeps the header appearance panel usable on a phone', () => {
    cy.viewport(320, 800)
    cy.visit('/')
    cy.get('#landing-title').should('be.visible')
    cy.get('.landing__cta').should('not.be.visible')
    cy.get('.landing__bar-inner').should(($bar) => {
      expect($bar[0].scrollWidth).to.be.lte($bar[0].clientWidth + 1)
    })

    cy.viewport(1024, 900)
    cy.get('.landing__appearance-trigger-label').should('be.visible')

    cy.viewport(320, 800)
    cy.get('#landing-appearance-trigger').should('be.visible').click()
    cy.get('[data-appearance-opt="system"]').should('be.visible')
    cy.get('.appearance-panel__body').should('have.css', 'display', 'flex')
    cy.get('[data-appearance-opt="system"]').should(($button) => {
      const box = $button[0].getBoundingClientRect()
      expect(box.width).to.be.gte(44)
      expect(box.height).to.be.gte(44)
    })
  })

  it('validates the sign-in form before contacting the database', () => {
    cy.visit('/auth')
    cy.get('#auth-title').should('have.attr', 'aria-label', 'Repairs, quoted and booked in one place')
    cy.get('.ff-typewriter__live', { timeout: 5000 })
      .should('be.visible')
      .and('have.text', 'Repairs, quoted and booked in one place')
    cy.get('form button[type="submit"]').click()
    cy.contains('Enter your email address').should('be.visible')
    cy.contains('Enter your password').should('be.visible')
  })

  it('centers the sign-in content on the page', () => {
    cy.viewport(1280, 1000)
    cy.visit('/auth')
    cy.get('main.auth').should(($main) => {
      const box = $main[0].getBoundingClientRect()
      const view = $main[0].ownerDocument.defaultView
      if (view === null) throw new Error('Expected the auth page to have a window')
      expect(Math.abs(box.top - (view.innerHeight - box.bottom))).to.be.lessThan(3)
      expect(Math.abs(box.left + box.width / 2 - view.innerWidth / 2)).to.be.lessThan(3)
    })
  })
})
