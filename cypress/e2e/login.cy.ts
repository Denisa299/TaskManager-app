
describe("Login Page", () => {
  beforeEach(() => {
    // Visit the login page before each test
    cy.visit("/login")

    // Setup API mocks
    cy.intercept("POST", "/api/auth/login", {
      statusCode: 200,
      body: {
        message: "Autentificare reușită",
        user: {
          _id: "123",
          firstName: "Test",
          lastName: "User",
          email: "test@example.com",
          role: "admin",
        },
      },
    }).as("loginRequest")
  })

  it("displays the login form", () => {
    // Check if form elements exist
    cy.get('input[name="email"]').should("be.visible")
    cy.get('input[name="password"]').should("be.visible")
    cy.get('button[type="submit"]').should("be.visible")
  })

  it("allows entering credentials", () => {
    // Type in the form
    cy.get('input[name="email"]').type("test@example.com")
    cy.get('input[name="password"]').type("password123")

    // Verify the values were entered
    cy.get('input[name="email"]').should("have.value", "test@example.com")
    cy.get('input[name="password"]').should("have.value", "password123")
  })

  it("submits the form", () => {
    // Fill and submit the form
    cy.get('input[name="email"]').type("test@example.com")
    cy.get('input[name="password"]').type("password123")
    cy.get('button[type="submit"]').click()

    // Wait for the API request
    cy.wait("@loginRequest")
  })
})
