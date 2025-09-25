import { IsOptional, IsNumber, IsDateString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryEmployeesDto {
  @ApiPropertyOptional({
    description: 'Número da página',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Page deve ser um número' })
  @Min(1, { message: 'Page deve ser no mínimo 1' })
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Limite de registros por página',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Limit deve ser um número' })
  @Min(1, { message: 'Limit deve ser no mínimo 1' })
  @Max(100, { message: 'Limit deve ser no máximo 100' })
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Salário mínimo para filtro',
    example: 1000,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'salarioMin deve ser um número' })
  @Min(0, { message: 'salarioMin deve ser no mínimo 0' })
  salarioMin?: number;

  @ApiPropertyOptional({
    description: 'Salário máximo para filtro',
    example: 10000,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'salarioMax deve ser um número' })
  @Min(0, { message: 'salarioMax deve ser no mínimo 0' })
  salarioMax?: number;

  @ApiPropertyOptional({
    description: 'Data de admissão inicial para filtro (formato: YYYY-MM-DD)',
    example: '2022-01-01',
  })
  @IsOptional()
  @Type(() => Date)
  dataAdmissaoInicio?: Date;

  @ApiPropertyOptional({
    description: 'Data de admissão final para filtro (formato: YYYY-MM-DD)',
    example: '2024-12-31',
  })
  @IsOptional()
  @Type(() => Date)
  dataAdmissaoFim?: Date;

  @ApiPropertyOptional({
    description: 'Campo para ordenação',
    example: 'dataAdmissao',
    enum: ['dataAdmissao', 'salarioBruto', 'anos', 'meses', 'dias', 'salario35', 'createdAt'],
  })
  @IsOptional()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Direção da ordenação',
    example: 'desc',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';

}