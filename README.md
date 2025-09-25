# FRONTEND

# Tela de Listagem de Funcionários

## Funcionalidades Implementadas

### Criação de Registros
- **Formulario**: Data de admissão utilizando calendario para marcacão de data + campo para registrar salário bruto
- **Formatação**: Datas em formato brasileiro (dd/MM/yyyy) e valores monetários em Real (R$)

![FORMULARIO](https://i.ibb.co/03M448N/Captura-de-Tela-2025-09-25-a-s-14-59-12.png)

### Tabela de Registros
- **Colunas**: ID, Data de Admissão, Salário Bruto, Anos, Meses, Dias, Salário + 35%
- **Ordenação**: Clique nos headers das colunas para ordenar (Data de Admissão, Salário Bruto, Salário + 35%)
- **Formatação**: Datas em formato brasileiro (dd/MM/yyyy) e valores monetários em Real (R$)

![TABELA](https://i.ibb.co/spyjwN73/Captura-de-Tela-2025-09-25-a-s-14-59-38.png)

###  Filtros Avançados
- **Faixa de Salário**: Filtro por salário mínimo e máximo
- **Período de Admissão**: Seleção de data range com calendário
- **Registros por Página**: 10, 25, 50 ou 100 registros
- **Aplicação**: Botões para aplicar ou limpar filtros

![filtro](https://i.ibb.co/zWrVK6fc/Captura-de-Tela-2025-09-25-a-s-15-00-16.png)

###  Paginação
- **Navegação**: Anterior/Próximo com numeração de páginas
- **Informações**: Mostra quantos registros estão sendo exibidos
- **Responsiva**: Funciona bem em desktop e mobile

![filtro](https://i.ibb.co/7NzT07fB/Captura-de-Tela-2025-09-25-a-s-15-00-02.png)

###  Busca por ID
- **Modal**: Interface dedicada para busca por ID específico
- **Detalhes**: Exibe todas as informações do funcionário encontrado
- **Tratamento de Erro**: Mensagem amigável quando não encontrado

![TABELA](https://i.ibb.co/1JdhJ5s5/Captura-de-Tela-2025-09-25-a-s-14-59-23.png)

###  Gerenciamento de Estado (react context)
- **Store Centralizado**: `useEmployeeStore` gerencia todo o estado
- **Ações Disponíveis**:
  - `fetchRecords()`: Busca registros com filtros
  - `fetchById(id)`: Busca por ID específico
  - `setFilters(filters)`: Atualiza filtros
  - `setPage(page)`: Muda página
  - `setSort(column, order)`: Define ordenação

###  Interface (shadcn/ui)
- **Componentes**: Table, Pagination, Dialog, Select, Input, Button, Calendar
- **Design**: Interface limpa e responsiva
- **Loading States**: Spinners e skeletons durante carregamento
- **Error Handling**: Mensagens de erro amigáveis

##  Como Usar

### 1. Iniciar o Backend
```bash
cd backend/instivo
npm run start:dev
```

### 2. Iniciar o Frontend
```bash
cd frontend/instivo-front
npm run dev
```

### 3. Acessar a Aplicação
- Abra http://localhost:5173
- Use a navegação para alternar entre "Listar Funcionários" e "Cadastrar Funcionário"

##  Configurações da API

### Query Parameters Suportados
- `page`: Número da página (padrão: 1)
- `limit`: Registros por página (padrão: 10, máx: 100)
- `sortBy`: Campo para ordenação (ex: salarioBruto, dataAdmissao)
- `sortOrder`: Ordem (asc/desc)
- `salarioMin/salarioMax`: Faixa de salário
- `dataAdmissaoInicio/dataAdmissaoFim`: Período de admissão

## Funcionalidades Principais

### Filtros
1. **Salário**: Digite valores mínimo e máximo
2. **Data**: Use o calendário para selecionar período
3. **Limite**: Escolha quantos registros ver por página
4. **Aplicar**: Clique em "Aplicar Filtros" para executar
5. **Limpar**: Use "Limpar" para resetar todos os filtros

### Ordenação
- Clique no header "Data de Admissão" para ordenar por data
- Clique no header "Salário Bruto" para ordenar por salário
- Clique no header "Salário + 35%" para ordenar pelo valor calculado
- O ícone mostra a direção atual da ordenação

### Busca por ID
1. Clique em "Buscar por ID"
2. Digite o ID do funcionário
3. Clique em "Buscar" ou pressione Enter
4. Visualize os detalhes no modal

### Paginação
- Use os botões "Anterior" e "Próximo"
- Clique nos números das páginas
- Veja o resumo de registros na parte inferior

##  Tecnologias Utilizadas

- **React 19** + **TypeScript**
- **Zustand** para gerenciamento de estado
- **shadcn/ui** para componentes de interface
- **Luxon** para manipulação de datas
- **Axios** para requisições HTTP
- **Tailwind CSS** para estilização

# BACKEND

## Descrição

API para gerenciar registros de funcionários com cálculo automático de tempo de trabalho e adicional salarial de 35%.

### Funcionalidades

- Cálculo automático de anos, meses e dias desde a data de admissão
- Cálculo automático de 35% do salário bruto
- Validação de dados com class-validator
- Documentação automática com Swagger
- Filtros de busca e paginação
- Tratamento global de erros
- Testes unitários para funções puras
- Integração com MongoDB via moongoose

### Endpoints

- `POST /registros` - Criar novo registro
- `GET /registros` - Listar registros com filtros e paginação
- `GET /registros/:id` - Buscar registro por ID

### Documentação

Acesse a documentação Swagger em: `http://localhost:3000/api/docs`

![Swagger](https://i.ibb.co/dsBpnFj8/Captura-de-Tela-2025-09-25-a-s-11-43-46.png "Swagger")


## Project setup

```bash
$ npm install
```

## Rodar o projeto

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# docker
$ docker-compose up -d
```

## Exemplos de Uso da API

### Criar um novo registro

```bash
curl -X POST http://localhost:3000/registros \
  -H "Content-Type: application/json" \
  -d '{
    "dataAdmissao": "2022-01-15",
    "salarioBruto": 5000.00
  }'
```

**Resposta:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "dataAdmissao": "2022-01-15T00:00:00.000Z",
  "salarioBruto": 5000,
  "anos": 2,
  "meses": 11,
  "dias": 10,
  "salario35": 6750,
  "createdAt": "2024-12-25T10:30:00.000Z"
}
```

### Listar registros com filtros

```bash
# Listar todos os registros
curl http://localhost:3000/registros

# Com paginação
curl "http://localhost:3000/registros?page=1&limit=5"

# Com filtros de data
curl "http://localhost:3000/registros?dataAdmissaoInicio=2022-01-01&dataAdmissaoFim=2024-12-31"

# Com filtros de salário
curl "http://localhost:3000/registros?salarioMin=3000&salarioMax=8000"
```

### Buscar registro por ID

```bash
curl http://localhost:3000/registros/507f1f77bcf86cd799439011
```

## Rodar tests

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

