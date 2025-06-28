
describe("Projects management", () => {
  beforeEach(() => {
    // Login real înainte de fiecare test
    cy.visit("/login")
    cy.get('input[name="email"]').type("admin@gmail.com") // Folosește un user real din DB
    cy.get('input[name="password"]').type("admin")
    cy.get('button[type="submit"]').click()

    // Așteaptă să se încarce dashboard-ul
    cy.url().should("include", "/dashboard")

    // Navighează la pagina de proiecte
    cy.visit("/dashboard/projects")
  })

  it("should display projects page", () => {
    cy.contains("Proiecte").should("be.visible")
    cy.get("h1").should("contain", "Proiecte")
  })

  it("should open create project dialog", () => {
    cy.contains("button", "Proiect nou").click()
    cy.contains("Creează un proiect nou").should("be.visible")
    cy.get('input[name="name"]').should("be.visible")
    cy.get('textarea[name="description"]').should("be.visible")
  })

  it("should create a new project", () => {
    const projectName = `Test project automat`
    const projectDescription = "Proiect creat prin test automat"

    // Deschide dialogul de creare
    cy.contains("button", "Proiect nou").click()

    // Completează formularul
    cy.get('input[name="name"]').type(projectName)
    cy.get('textarea[name="description"]').type(projectDescription)

    // Trimite formularul
    cy.contains("button", "Creează proiect").click()

    // Verifică că proiectul a fost creat
    cy.contains(projectName).should("be.visible")

    // Verifică că dialogul s-a închis
    cy.contains("Creează un proiect nou").should("not.exist")
  })

  it("should navigate to project tasks", () => {
    // Așteaptă să se încarce proiectele
    cy.get('[data-testid="project-card"]', { timeout: 10000 }).should("exist")

    // Click pe primul proiect disponibil
    cy.get('[data-testid="project-card"]')
      .first()
      .within(() => {
        cy.contains("Vezi taskuri").click()
      })

    // Verifică navigarea la pagina de taskuri
    cy.url().should("include", "/dashboard/tasks")
  })
})
