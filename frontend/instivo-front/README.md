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
