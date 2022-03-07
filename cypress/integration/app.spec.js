// https://docs.cypress.io/examples/examples/recipes#Testing-the-DOM
// https://docs.cypress.io/guides/getting-started/testing-your-app#Step-2-Visit-your-server
describe("Navigation", () => {
  it("should visit", () => {
    cy.visit("http://localhost:3000/");
  });
  it("should redirect to login screen", () => {
    cy.clearCookies();
    cy.visit("http://localhost:3000/");
    cy.url().should("include", "login");
  });
  it("should login", () => {
    cy.clearCookies();
    cy.visit("http://localhost:3000/login");
    cy.get("input[name=username]").type("admin");

    // {enter} causes the form to submit
    cy.get("input[name=password]").type(`${"1234"}{enter}`);

    // we should be redirected to /dashboard
    cy.url().should("not.include", "login");

    cy.getCookie("auth").should("exist");
  });
});
