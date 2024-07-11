

describe('Search', () => {
  beforeEach(() => {
    cy.viewport(2560, 1440)
    cy.visit('http://localhost:3000')
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
      cy.log(username)
  })
  
  it('Search TV', () => {
    cy.visit('http://localhost:3000/tv-shows');
    cy.contains('TV Shows ').click();
    cy.get("input[placeholder=\"Search\"]").click().type("breaking bad {enter}");
    assert(cy.get('h1').contains("Breaking Bad"));
    cy.get('.Result_pic__32ZQP').first().click();
    cy.origin('https://www.themoviedb.org', () => {
    cy.url().should('include', 'https://www.themoviedb.org/tv/1396-breaking-bad');
    })
  })

  it('Search Movie', () => {
    cy.visit('http://localhost:3000/tv-shows');
    cy.contains('Movies ').click();
    cy.get("input[placeholder=\"Search\"]").click().type("nonstop {enter}");
    assert(cy.get('h1').contains("Non-Stop"));
    cy.get('.Result_pic__32ZQP').first().click();
    cy.origin('https://www.themoviedb.org', () => {
      cy.url().should('include', 'https://www.themoviedb.org/movie/225574-non-stop');
    })
  })
  it.only('Add to Favorite', () => {
    cy.visit('http://localhost:3000/tv-shows');
    cy.contains('Movies ').click();
    cy.get("input[placeholder=\"Search\"]").click().type("nonstop {enter}");
    assert(cy.get('h1').contains("Non-Stop"));
    cy.get('p').contains("Add to favorite").click()

  })

})