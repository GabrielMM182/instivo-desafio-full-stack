import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Employee, EmployeeSchema } from '../employees.schema';
import { CreateRegistroDto } from '../dto/create-employees.dto';
import { QueryEmployeesDto } from '../dto/query-employees.dto';

describe('EmployeesService', () => {
  let service: EmployeesService;
  let model: Model<Employee>;
  let mongod: MongoMemoryServer;
  let module: TestingModule;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([{ name: Employee.name, schema: EmployeeSchema }]),
      ],
      providers: [EmployeesService],
    }).compile();

    service = module.get<EmployeesService>(EmployeesService);
    model = module.get<Model<Employee>>(getModelToken(Employee.name));
  });

  afterAll(async () => {
    await module.close();
    await mongod.stop();
  });

  beforeEach(async () => {
    await model.deleteMany({});
  });

  describe('Funções puras (métodos estáticos)', () => {
    describe('calcularTempoTrabalho', () => {
      it('deve calcular corretamente o tempo de trabalho', () => {
        const dataAdmissao = new Date('2022-01-15');
        const dataReferencia = new Date('2024-12-25');
        
        const resultado = EmployeesService.calcularTempoTrabalho(dataAdmissao, dataReferencia);
        
        expect(resultado.anos).toBe(2);
        expect(resultado.meses).toBeGreaterThanOrEqual(10);
        expect(resultado.dias).toBeGreaterThanOrEqual(0);
      });

      it('deve usar data atual quando dataReferencia não for fornecida', () => {
        const dataAdmissao = new Date('2023-01-01');
        
        const resultado = EmployeesService.calcularTempoTrabalho(dataAdmissao);
        
        expect(resultado.anos).toBeGreaterThanOrEqual(0);
        expect(resultado.meses).toBeGreaterThanOrEqual(0);
        expect(resultado.dias).toBeGreaterThanOrEqual(0);
      });

      it('deve calcular corretamente para períodos menores que um ano', () => {
        const dataAdmissao = new Date('2024-06-01');
        const dataReferencia = new Date('2024-12-25');
        
        const resultado = EmployeesService.calcularTempoTrabalho(dataAdmissao, dataReferencia);
        
        expect(resultado.anos).toBe(0);
        expect(resultado.meses).toBeGreaterThanOrEqual(6);
      });
    });

    describe('calcularSalario35', () => {
      it('deve calcular corretamente 35% do salário', () => {
        const salarioBruto = 5000;
        const resultado = EmployeesService.calcularSalario35(salarioBruto);
        
        expect(resultado).toBe(6750);
      });

      it('deve arredondar para 2 casas decimais', () => {
        const salarioBruto = 3333.33;
        const resultado = EmployeesService.calcularSalario35(salarioBruto);
        
        expect(resultado).toBe(4500);
      });

      it('deve lançar erro para salário inválido', () => {
        expect(() => {
          EmployeesService.calcularSalario35(0);
        }).toThrow('Salário bruto deve ser maior que zero');

        expect(() => {
          EmployeesService.calcularSalario35(-1000);
        }).toThrow('Salário bruto deve ser maior que zero');
      });
    });

    describe('calcularResultadoCompleto', () => {
      it('deve combinar todos os cálculos corretamente', () => {
        const dataAdmissao = new Date('2022-01-15');
        const salarioBruto = 4000;
        const dataReferencia = new Date('2024-12-25');
        
        const resultado = EmployeesService.calcularResultadoCompleto(
          dataAdmissao, 
          salarioBruto, 
          dataReferencia
        );
        
        expect(resultado.anos).toBe(2);
        expect(resultado.meses).toBeGreaterThanOrEqual(10);
        expect(resultado.dias).toBeGreaterThanOrEqual(0);
        expect(resultado.salario35).toBe(5400);
      });

      it('deve usar data atual quando não fornecida', () => {
        const dataAdmissao = new Date('2023-01-01');
        const salarioBruto = 3000;
        
        const resultado = EmployeesService.calcularResultadoCompleto(dataAdmissao, salarioBruto);
        
        expect(resultado.anos).toBeGreaterThanOrEqual(0);
        expect(resultado.salario35).toBe(4050);
      });
    });
  });

  describe('Métodos de instância', () => {
    describe('criarRegistro', () => {
      it('deve criar um registro com sucesso', async () => {
        const createDto: CreateRegistroDto = {
          dataAdmissao: new Date('2022-01-15'),
          salarioBruto: 5000,
        };

        const resultado = await service.criarRegistro(createDto);

        expect(resultado).toBeDefined();
        expect(resultado.dataAdmissao).toEqual(createDto.dataAdmissao);
        expect(resultado.salarioBruto).toBe(createDto.salarioBruto);
        expect(resultado.anos).toBeGreaterThanOrEqual(0);
        expect(resultado.meses).toBeGreaterThanOrEqual(0);
        expect(resultado.dias).toBeGreaterThanOrEqual(0);
        expect(resultado.salario35).toBe(6750);
      });

      it('deve salvar o registro no banco de dados', async () => {
        const createDto: CreateRegistroDto = {
          dataAdmissao: new Date('2023-06-01'),
          salarioBruto: 3000,
        };

        await service.criarRegistro(createDto);
        const count = await model.countDocuments();

        expect(count).toBe(1);
      });

      it('deve lançar BadRequestException para dados inválidos', async () => {
        const createDto: CreateRegistroDto = {
          dataAdmissao: new Date('2023-01-01'),
          salarioBruto: -1000, // Salário inválido
        };

        await expect(service.criarRegistro(createDto)).rejects.toThrow(BadRequestException);
      });
    });

    describe('listarRegistros', () => {
      beforeEach(async () => {
        // Criar alguns registros de teste
        const registros = [
          {
            dataAdmissao: new Date('2022-01-01'),
            salarioBruto: 3000,
            anos: 2,
            meses: 11,
            dias: 24,
            salario35: 4050,
          },
          {
            dataAdmissao: new Date('2023-06-15'),
            salarioBruto: 5000,
            anos: 1,
            meses: 6,
            dias: 10,
            salario35: 6750,
          },
          {
            dataAdmissao: new Date('2024-01-01'),
            salarioBruto: 4000,
            anos: 0,
            meses: 11,
            dias: 24,
            salario35: 5400,
          },
        ];

        await model.insertMany(registros);
      });

      it('deve listar todos os registros com paginação padrão', async () => {
        const queryDto: QueryEmployeesDto = {};
        const resultado = await service.listarRegistros(queryDto);

        expect(resultado.registros).toHaveLength(3);
        expect(resultado.total).toBe(3);
        expect(resultado.pagina).toBe(1);
        expect(resultado.totalPaginas).toBe(1);
      });

      it('deve aplicar paginação corretamente', async () => {
        const queryDto: QueryEmployeesDto = {
          page: 1,
          limit: 2,
        };
        const resultado = await service.listarRegistros(queryDto);

        expect(resultado.registros).toHaveLength(2);
        expect(resultado.total).toBe(3);
        expect(resultado.pagina).toBe(1);
        expect(resultado.totalPaginas).toBe(2);
      });

      it('deve filtrar por faixa de salário', async () => {
        const queryDto: QueryEmployeesDto = {
          salarioMin: 4000,
          salarioMax: 5000,
        };
        const resultado = await service.listarRegistros(queryDto);

        expect(resultado.registros).toHaveLength(2);
        expect(resultado.registros.every(r => r.salarioBruto >= 4000 && r.salarioBruto <= 5000)).toBe(true);
      });

      it('deve filtrar por data de admissão', async () => {
        const queryDto: QueryEmployeesDto = {
          dataAdmissaoInicio: new Date('2023-01-01'),
          dataAdmissaoFim: new Date('2023-12-31'),
        };
        const resultado = await service.listarRegistros(queryDto);

        expect(resultado.registros).toHaveLength(1);
        expect(resultado.registros[0].dataAdmissao.getFullYear()).toBe(2023);
      });

      it('deve ordenar por campo específico', async () => {
        const queryDto: QueryEmployeesDto = {
          sortBy: 'salarioBruto',
          sortOrder: 'asc',
        };
        const resultado = await service.listarRegistros(queryDto);

        expect(resultado.registros[0].salarioBruto).toBe(3000);
        expect(resultado.registros[2].salarioBruto).toBe(5000);
      });

      it('deve retornar lista vazia quando não há registros', async () => {
        await model.deleteMany({});
        
        const queryDto: QueryEmployeesDto = {};
        const resultado = await service.listarRegistros(queryDto);

        expect(resultado.registros).toHaveLength(0);
        expect(resultado.total).toBe(0);
      });
    });

    describe('buscarRegistroPorId', () => {
      let registroId: string;

      beforeEach(async () => {
        const registro = await model.create({
          dataAdmissao: new Date('2023-01-01'),
          salarioBruto: 4000,
          anos: 1,
          meses: 11,
          dias: 24,
          salario35: 5400,
        });
        registroId = registro._id.toString();
      });

      it('deve lançar BadRequestException para ID inválido', async () => {
        const idInvalido = 'id-invalido';

        await expect(service.buscarRegistroPorId(idInvalido)).rejects.toThrow(BadRequestException);
        await expect(service.buscarRegistroPorId(idInvalido)).rejects.toThrow('ID inválido');
      });

      it('deve lançar NotFoundException para ID não encontrado', async () => {
        const idNaoExistente = '507f1f77bcf86cd799439011'; // ID válido mas não existe

        await expect(service.buscarRegistroPorId(idNaoExistente)).rejects.toThrow(NotFoundException);
        await expect(service.buscarRegistroPorId(idNaoExistente)).rejects.toThrow(`Registro com ID ${idNaoExistente} não encontrado`);
      });
    });
  });
});