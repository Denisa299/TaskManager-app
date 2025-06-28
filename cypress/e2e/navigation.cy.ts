
describe("Navigation Tests", () => {
  beforeEach(() => {
    cy.visit("/")
  })

  it("should navigate to login page", () => {
    cy.contains("Autentificare").click()
    cy.url().should("include", "/login")
  })

  it("should navigate to register page", () => {
    cy.contains("Înregistrare").click()
    cy.url().should("include", "/register")
  })
})
