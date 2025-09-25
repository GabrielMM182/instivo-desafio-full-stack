import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee, EmployeeDocument } from '.././employees.schema';
import { CreateRegistroDto } from '.././dto/create-employees.dto';
import { QueryEmployeesDto } from '.././dto/query-employees.dto';
import { DateCalculatorUtil, TempoTrabalho } from '.././utils/date-calculator.util';

export interface CalculoResultado {
  anos: number;
  meses: number;
  dias: number;
  salario35: number;
}

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
  ) {}
  static calcularTempoTrabalho(dataAdmissao: Date, dataReferencia?: Date): TempoTrabalho {
    return DateCalculatorUtil.calcularTempoTrabalho(dataAdmissao, dataReferencia);
  }

  static calcularSalario35(salarioBruto: number): number {
    if (salarioBruto <= 0) {
      throw new Error('Salário bruto deve ser maior que zero');
    }
    return Number((salarioBruto * 1.35).toFixed(2));
  }

  static calcularResultadoCompleto(dataAdmissao: Date, salarioBruto: number, dataReferencia?: Date): CalculoResultado {
    const tempoTrabalho = this.calcularTempoTrabalho(dataAdmissao, dataReferencia);
    const salario35 = this.calcularSalario35(salarioBruto);

    return {
      ...tempoTrabalho,
      salario35,
    };
  }

  async criarRegistro(createRegistroDto: CreateRegistroDto): Promise<Employee> {
    try {
      const resultado = EmployeesService.calcularResultadoCompleto(
        createRegistroDto.dataAdmissao,
        createRegistroDto.salarioBruto
      );

      const novoRegistro = new this.employeeModel({
        dataAdmissao: createRegistroDto.dataAdmissao,
        salarioBruto: createRegistroDto.salarioBruto,
        anos: resultado.anos,
        meses: resultado.meses,
        dias: resultado.dias,
        salario35: resultado.salario35,
      });

      return await novoRegistro.save();
    } catch (error) {
      throw new BadRequestException(`Erro ao criar registro: ${error.message}`);
    }
  }

  async listarRegistros(queryDto: QueryEmployeesDto): Promise<{
    registros: Employee[];
    total: number;
    pagina: number;
    totalPaginas: number;
  }> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = queryDto;
    
    const filtros: any = {};
    
    if (queryDto.dataAdmissaoInicio && queryDto.dataAdmissaoFim) {
      filtros.dataAdmissao = {
        $gte: queryDto.dataAdmissaoInicio,
        $lte: queryDto.dataAdmissaoFim,
      };
    } else if (queryDto.dataAdmissaoInicio) {
      filtros.dataAdmissao = { $gte: queryDto.dataAdmissaoInicio };
    } else if (queryDto.dataAdmissaoFim) {
      filtros.dataAdmissao = { $lte: queryDto.dataAdmissaoFim };
    }

    if (queryDto.salarioMin && queryDto.salarioMax) {
      filtros.salarioBruto = {
        $gte: queryDto.salarioMin,
        $lte: queryDto.salarioMax,
      };
    } else if (queryDto.salarioMin) {
      filtros.salarioBruto = { $gte: queryDto.salarioMin };
    } else if (queryDto.salarioMax) {
      filtros.salarioBruto = { $lte: queryDto.salarioMax };
    }

    const skip = (page - 1) * limit;
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [registros, total] = await Promise.all([
      this.employeeModel
        .find(filtros)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.employeeModel.countDocuments(filtros).exec(),
    ]);

    return {
      registros,
      total,
      pagina: page,
      totalPaginas: Math.ceil(total / limit),
    };
  }

  async buscarRegistroPorId(id: string): Promise<Employee> {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException('ID inválido');
    }

    const registro = await this.employeeModel.findById(id).exec();
    
    if (!registro) {
      throw new NotFoundException(`Registro com ID ${id} não encontrado`);
    }

    return registro;
  }
}