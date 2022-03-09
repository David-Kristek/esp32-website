// https://docs.cypress.io/examples/examples/recipes#Testing-the-DOM
// https://docs.cypress.io/guides/getting-started/testing-your-app#Step-2-Visit-your-server
describe("App", () => {
  it("should visit", () => {
    cy.visit("http://localhost:3000/");
  });

});
