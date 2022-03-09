describe("Auth", () => {
  it("should redirect to login screen", () => {
    cy.clearCookies();
    cy.visit("http://localhost:3000/");
    cy.url().should("include", "login");
  });
  it("should login", () => {
    cy.clearCookies();
    cy.visit("http://localhost:3000/login");
    cy.get("input[name=username]").type("admin");
    cy.get("input[name=password]").type(`${"1234"}{enter}`);
    cy.url().should("not.include", "login");
    cy.getCookie("auth").should("exist");
    cy.get('[id="user"]').contains("admin");
  });
  it("should logout", () => {
    cy.get('[id="logout"]').click({ force: true });
    cy.url().should("include", "/login");
    cy.getCookie("auth").should("have.property", "value", "%220%22");
  });
});
