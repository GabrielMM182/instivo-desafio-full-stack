import { IsDate, IsNotEmpty, IsNumber, IsPositive, Max, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { DateTime } from 'luxon';

export class CreateRegistroDto {
  @ApiProperty({
    description: 'Data de admissão do funcionário no formato YYYY-MM-DD',
    example: '2024-11-01',
    type: String,
    format: 'date',
  })
  @IsNotEmpty({ message: 'Data de admissão é obrigatória' })
  @Type(() => Date)
  @IsDate({ message: 'Data de admissão deve ser uma data válida' })
  @Transform(({ value }) => {
    if (value instanceof Date) {
      const dateTime = DateTime.fromJSDate(value);
      const today = DateTime.now().endOf('day');

      if (dateTime > today) {
        throw new Error('Data de admissão não pode ser futura');
      }

      return value;
    }

    if (typeof value === 'string') {
      const dateTime = DateTime.fromISO(value);

      if (!dateTime.isValid) {
        throw new Error('Data de admissão inválida. Use o formato YYYY-MM-DD');
      }

      const today = DateTime.now().endOf('day');
      if (dateTime > today) {
        throw new Error('Data de admissão não pode ser futura');
      }

      return dateTime.toJSDate();
    }

    throw new Error('Data de admissão deve ser uma string no formato YYYY-MM-DD');
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
}