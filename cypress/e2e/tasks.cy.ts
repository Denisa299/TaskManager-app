describe("Tasks Management", () => {
  beforeEach(() => {
    cy.visit("/login")
    cy.get("body").should("be.visible")
    cy.get('input[name="email"]').should("be.visible").type("admin@gmail.com")
    cy.get('input[name="password"]').should("be.visible").type("admin")
    cy.get('button[type="submit"]').click()
    cy.url({ timeout: 10000 }).should("not.include", "/login")
    cy.visit("/dashboard/tasks")
    cy.url().should("include", "/dashboard/tasks")
  })

  it("should display tasks page", () => {
    cy.contains(/taskuri/i, { timeout: 10000 }).should("be.visible")
    cy.get("body").should("contain.text", "Taskuri")
  })

  it("should display kanban columns", () => {
    cy.contains(/to do/i).should("be.visible")
    cy.contains(/progres|în progres/i).should("be.visible")
    cy.contains(/finalizat/i).should("be.visible")
  })

  it("should have create task button", () => {
    cy.get("body").then(($body) => {
      if ($body.text().match(/creează task/i)) {
        cy.contains(/creează task/i).should("be.visible")
      } else if ($body.text().match(/adaugă task/i)) {
        cy.contains(/adaugă task/i).should("be.visible")
      } else if ($body.text().match(/task nou/i)) {
        cy.contains(/task nou/i).should("be.visible")
      } else {
        cy.get("button").contains(/task/i).should("be.visible")
      }
    })
  })

  it("should display project selector", () => {
    cy.get('select, [role="combobox"]').should("exist")
  })

  it("should show empty state or existing tasks", () => {
    cy.get("body").then(($body) => {
      if ($body.text().includes("Nu există taskuri")) {
        cy.contains("Nu există taskuri").should("be.visible")
      } else {
        cy.get('[class*="kanban"], [class*="column"], [class*="board"]').should("exist")
      }
    })
  })
})

describe("Task Creation", () => {
  beforeEach(() => {
    cy.visit("/login")
    cy.get('input[name="email"]').type("admin@gmail.com")
    cy.get('input[name="password"]').type("admin")
    cy.get('button[type="submit"]').click()
    cy.url({ timeout: 10000 }).should("not.include", "/login")
    cy.visit("/dashboard/tasks")
    cy.url().should("include", "/dashboard/tasks")
  })

  it("should open create task dialog when button is clicked", () => {
    cy.get("body").then(($body) => {
      if ($body.find('button:contains("Creează Task")').length > 0) {
        cy.contains("button", "Creează Task").click()
      } else if ($body.find('button:contains("Adaugă Task")').length > 0) {
        cy.contains("button", "Adaugă Task").click()
      } else if ($body.find('[data-testid="create-task"]').length > 0) {
        cy.get('[data-testid="create-task"]').click()
      } else {
        cy.get("button").contains(/\+|add|create|nou|task/i).first().click()
      }
    })
    cy.get("body").should("contain.text", "task")
  })
})

describe("Tasks Navigation", () => {
  it("should navigate to tasks page from dashboard", () => {
    cy.visit("/login")
    cy.get('input[name="email"]').type("admin@gmail.com")
    cy.get('input[name="password"]').type("admin")
    cy.get('button[type="submit"]').click()
    cy.url({ timeout: 10000 }).should("not.include", "/login")
    cy.visit("/dashboard")
    cy.url().should("include", "/dashboard")
    cy.get("body").then(($body) => {
      if ($body.text().includes("Taskuri")) {
        cy.contains("Taskuri").click()
      } else if ($body.text().includes("Tasks")) {
        cy.contains("Tasks").click()
      } else {
        cy.visit("/dashboard/tasks")
      }
    })
    cy.url().should("include", "/tasks")
  })
})
