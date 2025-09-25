/// <reference types="cypress" />

// Comandos customizados para testes de funcionários

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Cadastra um funcionário com dados válidos
       * @param admissionDate - Data de admissão no formato YYYY-MM-DD (opcional)
       * @param salary - Salário bruto (opcional)
       */
      createEmployee(admissionDate?: string, salary?: number): Chainable<Element>
      
      /**
       * Navega para a página de cadastro
       */
      goToRegistration(): Chainable<Element>
      
      /**
       * Navega para a página de listagem
       */
      goToListing(): Chainable<Element>
      
      /**
       * Preenche o formulário de funcionário
       */
      fillEmployeeForm(admissionDate: string, salary: number): Chainable<Element>
      
      /**
       * Verifica se a mensagem de sucesso aparece
       */
      checkSuccessMessage(): Chainable<Element>
    }
  }
}

Cypress.Commands.add('createEmployee', (admissionDate?: string, salary?: number) => {
  cy.goToRegistration()
  
  const defaultSalary = salary || 2500
  const defaultDate = admissionDate || '15' // Dia 15 do mês atual
  
  cy.fillEmployeeForm(defaultDate, defaultSalary)
  cy.get('button[type="submit"]').click()
  cy.checkSuccessMessage()
})

Cypress.Commands.add('goToRegistration', () => {
  cy.contains('Cadastrar Funcionário').click()
  cy.contains('Cadastro de Funcionário').should('be.visible')
})

Cypress.Commands.add('goToListing', () => {
  cy.contains('Listar Funcionários').click()
  cy.get('table').should('be.visible')
})

Cypress.Commands.add('fillEmployeeForm', (day: string, salary: number) => {
  // Preencher data de admissão
  cy.get('button').contains('Selecione uma data').click()
  cy.get('[role="gridcell"]').contains(day).click()
  
  // Preencher salário
  cy.get('input[type="number"]').clear().type(salary.toString())
})

Cypress.Commands.add('checkSuccessMessage', () => {
  cy.wait(1000)
  cy.get('div').contains('Funcionário cadastrado com sucesso!').should('be.visible')
})

// Comando para aguardar carregamento da página
Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('body').should('be.visible')
  cy.wait(500) // Aguarda um pouco para garantir que tudo carregou
})

export {}