import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmployeesService } from './employees.service';
import { Employee } from '../employees.schema';

describe('EmployeesService', () => {
  let service: EmployeesService;
  let model: Model<Employee>;

  const mockEmployeeModel = {
    new: jest.fn(),
    constructor: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    countDocuments: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesService,
        {
          provide: getModelToken(Employee.name),
          useValue: mockEmployeeModel,
        },
      ],
    }).compile();

    service = module.get<EmployeesService>(EmployeesService);
    model = module.get<Model<Employee>>(getModelToken(Employee.name));
  });

  describe('Funções puras', () => {
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
    });
  });
});