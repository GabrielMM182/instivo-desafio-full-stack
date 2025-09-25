import { IsDate, IsNotEmpty, IsNumber, IsPositive, Max, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { DateTime } from 'luxon';

export class CreateRegistroDto {
  @ApiProperty({
    description: 'Data de admissão do funcionário',
    example: '2023-01-15',
    type: Date,
  })
  @IsNotEmpty({ message: 'Data de admissão é obrigatória' })
  @Type(() => Date)
  @IsDate({ message: 'Data de admissão deve ser uma data válida' })
  @Transform(({ value }) => {
    const date = DateTime.fromISO(value);
    const today = DateTime.now().endOf('day');
    
    if (!date.isValid) {
      throw new Error('Data de admissão inválida');
    }
    
    if (date > today) {
      throw new Error('Data de admissão não pode ser futura');
    }
    
    return date.toJSDate();
  })
  dataAdmissao: Date;

  @ApiProperty({
    description: 'Salário bruto do funcionário',
    example: 5000.00,
    minimum: 1320,
    maximum: 50000,
  })
  @IsNotEmpty({ message: 'Salário bruto é obrigatório' })
  @IsNumber({}, { message: 'Salário bruto deve ser um número' })
  @IsPositive({ message: 'Salário bruto deve ser positivo' })
  @Min(1320, { message: 'Salário bruto deve ser no mínimo R$ 1.320,00' })
  @Max(50000, { message: 'Salário bruto deve ser no máximo R$ 50.000,00' })
  salarioBruto: number;

  @ApiProperty({
    description: 'Anos de trabalho',
    example: 2,
    minimum: 0,
  })
  @IsNotEmpty({ message: 'Anos é obrigatório' })
  @IsNumber({}, { message: 'Anos deve ser um número' })
  @Min(0, { message: 'Anos deve ser no mínimo 0' })
  anos: number;

  @ApiProperty({
    description: 'Meses de trabalho',
    example: 6,
    minimum: 0,
    maximum: 11,
  })
  @IsNotEmpty({ message: 'Meses é obrigatório' })
  @IsNumber({}, { message: 'Meses deve ser um número' })
  @Min(0, { message: 'Meses deve ser no mínimo 0' })
  @Max(11, { message: 'Meses deve ser no máximo 11' })
  meses: number;

  @ApiProperty({
    description: 'Dias de trabalho',
    example: 15,
    minimum: 0,
    maximum: 30,
  })
  @IsNotEmpty({ message: 'Dias é obrigatório' })
  @IsNumber({}, { message: 'Dias deve ser um número' })
  @Min(0, { message: 'Dias deve ser no mínimo 0' })
  @Max(30, { message: 'Dias deve ser no máximo 30' })
  dias: number;

  @ApiProperty({
    description: 'Salário com adicional de 35%',
    example: 6750.00,
    minimum: 0,
  })
  @IsNotEmpty({ message: 'Salário 35% é obrigatório' })
  @IsNumber({}, { message: 'Salário 35% deve ser um número' })
  @IsPositive({ message: 'Salário 35% deve ser positivo' })
  salario35: number;
}