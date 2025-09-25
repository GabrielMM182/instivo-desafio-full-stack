## Descrição

API para gerenciar registros de funcionários com cálculo automático de tempo de trabalho e adicional salarial de 35%.

### Deploy

A aplicação está disponível online:

- **Frontend**: https://instivo-desafio-full-stack.vercel.app/
- **API**: https://instivo-desafio.onrender.com/
- **Documentação Swagger**: https://instivo-desafio.onrender.com/api/docs

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
