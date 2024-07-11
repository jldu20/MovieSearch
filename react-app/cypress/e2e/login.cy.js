

describe('login', () => {

    it('login', () => {
      cy.visit('http://localhost:3000/login')
        cy.get("input[placeholder=\"Username\"]").click().type("Jerry1");
        cy.get("input[placeholder=\"Password\"]").click().type("testing");
        cy.get("button[type=\"submit\"]").click();
        cy.url({decode: true}).should('eq', 'http://localhost:3000/')
    })
    it('register', () => {
      let username = (Math.random() + 1).toString(36).substring(2);
      let password = (Math.random() + 1).toString(36).substring(2);
      cy.visit('http://localhost:3000/register')
      cy.get("input[placeholder=\"Username\"]").click().type(username);
      cy.get("input[placeholder=\"Password\"]").click().type(password);
      cy.get("button[type=\"submit\"]").click();
      cy.wait(3000);
      cy.get("input[placeholder=\"Username\"]").click().type(username);
      cy.get("input[placeholder=\"Password\"]").click().type(password);
      cy.get("button[type=\"submit\"]").click();
      cy.url({decode: true}).should('eq', 'http://localhost:3000/')
    })
  
  })