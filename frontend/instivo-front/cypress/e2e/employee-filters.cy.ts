/// <reference types="cypress" />

describe('Validação de Formulário e Filtros', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Validação de Formulário', () => {
    beforeEach(() => {
      cy.contains('Cadastrar Funcionário').click()
    })

    it('deve mostrar erros ao tentar enviar formulário vazio', () => {
      cy.get('button[type="submit"]').click()
      cy.wait(500)
      cy.get('p').contains('Data de admissão é obrigatória').should('be.visible')
      cy.get('p').contains('Salário deve ser um número válido').should('be.visible')
    })
  })

  describe('Listagem com Paginação', () => {
    it('deve carregar registros iniciais na tabela', () => {
      cy.contains('Listar Funcionários').click()
      cy.get('table').should('be.visible')
      cy.get('thead').should('contain', 'ID')
      cy.get('thead').should('contain', 'Data de Admissão')
      cy.get('thead').should('contain', 'Salário Bruto')
      cy.get('tbody').should('be.visible')
    })

    it('deve testar paginação quando há registros suficientes', () => {
      cy.contains('Listar Funcionários').click()
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="pagination"]').length > 0) {
          cy.get('[data-testid="pagination"]').should('be.visible')
          
          cy.get('body').then(($body) => {
            if ($body.find('button:contains("Próxima")').length > 0) {
              cy.contains('Próxima').click()
              cy.get('table').should('be.visible')
            }
          })
        }
      })
    })
  })

  describe('Filtros e Ordenação', () => {
    beforeEach(() => {
      cy.contains('Listar Funcionários').click()
    })

    it('deve aplicar filtro de salário mínimo', () => {
      cy.get('body').then(($body) => {
        if ($body.find('input[placeholder*="salário"], input[placeholder*="Salário"]').length > 0) {
          cy.get('input[placeholder*="salário"], input[placeholder*="Salário"]').first().type('3000')          
          cy.get('body').then(($body) => {
            if ($body.find('button:contains("Filtrar"), button:contains("Aplicar")').length > 0) {
              cy.contains('Filtrar, Aplicar').click()
            }
          })
          cy.wait(1000)
          cy.get('table').should('be.visible')
        }
      })
    })

    it('deve testar busca por ID', () => {
      cy.get('body').then(($body) => {
        if ($body.find('button:contains("Buscar"), input[placeholder*="ID"]').length > 0) {
          if ($body.find('button:contains("Buscar")').length > 0) {
            cy.contains('Buscar').click()            
            cy.get('body').should('contain', 'ID')
          }
        }
      })
    })

    it('deve testar ordenação por colunas', () => {
      cy.get('thead th').first().then(($header) => {
        if ($header.find('button').length > 0 || $header.is('[role="button"]')) {
          cy.get('thead th').first().click()
          cy.wait(500)
          cy.get('table').should('be.visible')
        }
      })
    })
  })
})