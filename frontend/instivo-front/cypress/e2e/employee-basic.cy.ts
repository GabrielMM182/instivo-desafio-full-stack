/// <reference types="cypress" />

describe('Testes Básicos - Funcionários', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('deve carregar a página inicial', () => {
    cy.contains('Listar Funcionários').should('be.visible')
    cy.contains('Cadastrar Funcionário').should('be.visible')
  })

  it('deve navegar para página de cadastro', () => {
    cy.contains('Cadastrar Funcionário').click()
    cy.contains('Cadastro de Funcionário').should('be.visible')
    cy.get('label').contains('Data de Admissão').should('be.visible')
    cy.get('label').contains('Salário Bruto').should('be.visible')
  })

  it('deve preencher e submeter formulário com dados válidos', () => {
    cy.contains('Cadastrar Funcionário').click()
    cy.get('button').contains('Selecione uma data').click()
    cy.get('[role="gridcell"]').contains('10').click()
    cy.get('input[type="number"]').type('2500')
    cy.get('button[type="submit"]').click()
    cy.wait(2000)
    cy.get('body').then(($body) => {
      if ($body.text().includes('sucesso')) {
        cy.get('body').should('contain', 'sucesso')
      } else {
        cy.get('input[type="number"]').should('have.value', '')
      }
    })
  })

  it('deve navegar para listagem', () => {
    cy.contains('Listar Funcionários').click()
    cy.get('table').should('be.visible')
    cy.get('thead').should('contain', 'ID')
    cy.get('thead').should('contain', 'Data de Admissão')
    cy.get('thead').should('contain', 'Salário')
  })
})