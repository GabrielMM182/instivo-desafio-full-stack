import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { CreateRegistroDto } from '../dto/create-employees.dto';
import { QueryEmployeesDto } from '../dto/query-employees.dto';
import { Employee } from '../employees.schema';
import { EmployeesService } from '../service/employees.service';

@ApiTags('Registros de Funcionários')
@Controller('registros')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar novo registro de funcionário',
    description: 'Recebe dados do funcionário, calcula tempo de trabalho e adicional de 35% do salário, e salva no MongoDB',
  })
  @ApiBody({
    type: CreateRegistroDto,
    description: 'Dados do funcionário para criar registro',
    examples: {
      exemplo1: {
        summary: 'Funcionário com 2 anos de trabalho',
        value: {
          dataAdmissao: '2022-01-15',
          salarioBruto: 5000.00,
        },
      },
      exemplo2: {
        summary: 'Funcionário recém contratado',
        value: {
          dataAdmissao: '2024-11-01',
          salarioBruto: 3500.00,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Registro criado com sucesso',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
        dataAdmissao: { type: 'string', format: 'date-time', example: '2022-01-15T00:00:00.000Z' },
        salarioBruto: { type: 'number', example: 5000.00 },
        anos: { type: 'number', example: 2 },
        meses: { type: 'number', example: 10 },
        dias: { type: 'number', example: 15 },
        salario35: { type: 'number', example: 6750.00 },
        createdAt: { type: 'string', format: 'date-time', example: '2024-12-25T10:30:00.000Z' },
        updatedAt: { type: 'string', format: 'date-time', example: '2024-12-25T10:30:00.000Z' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Data de admissão não pode ser futura' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  async criarRegistro(@Body() createRegistroDto: CreateRegistroDto): Promise<Employee> {
    return this.employeesService.criarRegistro(createRegistroDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar registros de funcionários',
    description: 'Lista todos os registros com filtros opcionais e paginação',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número da página (padrão: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Quantidade de registros por página (padrão: 10)',
    example: 10,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    description: 'Campo para ordenação (padrão: createdAt)',
    example: 'createdAt',
    enum: ['createdAt', 'dataAdmissao', 'salarioBruto', 'anos'],
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    type: String,
    description: 'Ordem da classificação (padrão: desc)',
    example: 'desc',
    enum: ['asc', 'desc'],
  })
  @ApiQuery({
    name: 'dataAdmissaoInicio',
    required: false,
    type: String,
    format: 'date',
    description: 'Data de admissão inicial para filtro',
    example: '2022-01-01',
  })
  @ApiQuery({
    name: 'dataAdmissaoFim',
    required: false,
    type: String,
    format: 'date',
    description: 'Data de admissão final para filtro',
    example: '2024-12-31',
  })
  @ApiQuery({
    name: 'salarioMin',
    required: false,
    type: Number,
    description: 'Salário mínimo para filtro',
    example: 2000,
  })
  @ApiQuery({
    name: 'salarioMax',
    required: false,
    type: Number,
    description: 'Salário máximo para filtro',
    example: 10000,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de registros retornada com sucesso',
    schema: {
      type: 'object',
      properties: {
        registros: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
              dataAdmissao: { type: 'string', format: 'date-time' },
              salarioBruto: { type: 'number', example: 5000.00 },
              anos: { type: 'number', example: 2 },
              meses: { type: 'number', example: 10 },
              dias: { type: 'number', example: 15 },
              salario35: { type: 'number', example: 6750.00 },
              createdAt: { type: 'string', format: 'date-time' },
            },
          },
        },
        total: { type: 'number', example: 50 },
        pagina: { type: 'number', example: 1 },
        totalPaginas: { type: 'number', example: 5 },
      },
    },
  })
  async listarRegistros(@Query() queryDto: QueryEmployeesDto) {
    return this.employeesService.listarRegistros(queryDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar registro por ID',
    description: 'Retorna um registro específico pelo seu ID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID do registro (ObjectId do MongoDB)',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Registro encontrado com sucesso',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
        dataAdmissao: { type: 'string', format: 'date-time', example: '2022-01-15T00:00:00.000Z' },
        salarioBruto: { type: 'number', example: 5000.00 },
        anos: { type: 'number', example: 2 },
        meses: { type: 'number', example: 10 },
        dias: { type: 'number', example: 15 },
        salario35: { type: 'number', example: 6750.00 },
        createdAt: { type: 'string', format: 'date-time', example: '2024-12-25T10:30:00.000Z' },
        updatedAt: { type: 'string', format: 'date-time', example: '2024-12-25T10:30:00.000Z' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'ID inválido',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'ID inválido' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Registro não encontrado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Registro com ID 507f1f77bcf86cd799439011 não encontrado' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  async buscarRegistroPorId(@Param('id') id: string): Promise<Employee> {
    return this.employeesService.buscarRegistroPorId(id);
  }
}