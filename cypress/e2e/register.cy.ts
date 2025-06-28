
describe("Register Functionality", () => {
  beforeEach(() => {
    cy.visit("register")
  })

  it("should display register form elements", () => {
    cy.get("h1").should("contain", "Înregistrare")
    cy.get('input[name="firstName"]').should("be.visible")
    cy.get('input[name="lastName"]').should("be.visible")
    cy.get('input[name="email"]').should("be.visible")
    cy.get('input[name="password"]').should("be.visible")
    cy.get('input[name="confirmPassword"]').should("be.visible")
    cy.get('button[type="submit"]').should("be.visible")
    cy.contains("Ai deja cont?").should("be.visible")
  })

  it("should show validation errors for empty fields", () => {
    cy.get('button[type="submit"]').click()
    cy.contains("Prenumele este obligatoriu").should("be.visible")
    cy.contains("Numele este obligatoriu").should("be.visible")
    cy.contains("Email-ul este obligatoriu").should("be.visible")
    cy.contains("Parola este obligatorie").should("be.visible")
  })

  it("should show error for password mismatch", () => {
    cy.get('input[name="firstName"]').type("Test")
    cy.get('input[name="lastName"]').type("User")
    cy.get('input[name="email"]').type("test@example.com")
    cy.get('input[name="password"]').type("parola123")
    cy.get('input[name="confirmPassword"]').type("altaparola")
    cy.get('button[type="submit"]').click()

    cy.contains("Parolele nu coincid").should("be.visible")
  })

  it("should register successfully with valid data", () => {
    // Interceptăm cererea de înregistrare
    cy.intercept("POST", "/api/auth/register", {
      statusCode: 201,
      body: {
        message: "Înregistrare reușită",
        user: {
          _id: "123",
          firstName: "Test",
          lastName: "User",
          email: "test@example.com",
        },
      },
    }).as("registerRequest")

    cy.get('input[name="firstName"]').type("Test")
    cy.get('input[name="lastName"]').type("User")
    cy.get('input[name="email"]').type("test@example.com")
    cy.get('input[name="password"]').type("parola123")
    cy.get('input[name="confirmPassword"]').type("parola123")
    cy.get('button[type="submit"]').click()

    cy.wait("@registerRequest")

    // Verificăm că suntem redirecționați către login sau dashboard
    cy.url().should("include", "/login")
  })

  it("should navigate to login page", () => {
    cy.contains("Ai deja cont?").click()
    cy.url().should("include", "/login")
  })
})
