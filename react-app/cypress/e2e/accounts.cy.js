describe('Accounts', () => {
    beforeEach(() => {
        cy.viewport(2560, 1440)
        cy.visit('http://localhost:3000/login')
        cy.get("input[placeholder=\"Username\"]").click().type("Jerry1");
        cy.get("input[placeholder=\"Password\"]").click().type("testing");
        cy.get("button[type=\"submit\"]").click();
        cy.url({decode: true}).should('eq', 'http://localhost:3000/')
      })
    it('Check Favorites', () => {
        cy.contains('Profile').click();
        cy.get("td").contains("Non-Stop")
        cy.get("td").contains("Breaking Bad")
    })
    it('Logout', () => {
        cy.contains('Logout').click();
        cy.contains('Login/Signup').click();
        cy.url({decode: true}).should('eq', 'http://localhost:3000/login')
    })
    
  
  })