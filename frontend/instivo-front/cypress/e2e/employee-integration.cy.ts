/// <reference types="cypress" />

describe('Testes de Integração - Funcionários', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('deve realizar fluxo completo: cadastro -> listagem -> filtro', () => {
        cy.contains('Cadastrar Funcionário').click()
        cy.get('button').contains('Selecione uma data').click()
        cy.get('[role="gridcell"]').contains('20').click()
        cy.get('input[type="number"]').type('4500.00')
        cy.get('button[type="submit"]').click()
        cy.wait(1000)
        cy.get('div').contains('Funcionário cadastrado com sucesso!').should('be.visible')
        cy.contains('Listar Funcionários').click()
        cy.get('table').should('be.visible')
        cy.get('body').then(($body) => {
            if ($body.find('input[placeholder*="salário"]').length > 0) {
                cy.get('input[placeholder*="salário"]').first().type('4000')
                cy.wait(1000)
                cy.get('table').should('be.visible')
            }
        })
    })

    it('deve validar responsividade básica', () => {
        cy.viewport(1200, 800)
        cy.contains('Cadastrar Funcionário').should('be.visible')

        cy.viewport(768, 1024)
        cy.contains('Cadastrar Funcionário').should('be.visible')

        cy.viewport(375, 667)
        cy.contains('Cadastrar Funcionário').should('be.visible')
    })

    it('deve testar navegação entre páginas', () => {
        cy.contains('Listar Funcionários').should('be.visible')
        cy.get('table').should('be.visible')
        cy.contains('Cadastrar Funcionário').click()
        cy.contains('Cadastro de Funcionário').should('be.visible')
        cy.contains('Listar Funcionários').click()
        cy.get('table').should('be.visible')
    })

    it('deve testar persistência de dados após navegação', () => {
        cy.contains('Cadastrar Funcionário').click()
        cy.get('input[type="number"]').type('2800')
        cy.contains('Listar Funcionários').click()
        cy.contains('Cadastrar Funcionário').click()
        cy.get('input[type="number"]').should('have.value', '')
    })

    it('deve testar acessibilidade básica', () => {
        cy.contains('Cadastrar Funcionário').click()
        cy.get('label').contains('Data de Admissão').should('be.visible')
        cy.get('label').contains('Salário Bruto').should('be.visible')
        cy.get('button[type="submit"]').should('be.visible').focus()
        cy.get('input[type="number"]').should('have.attr', 'id')
    })
})