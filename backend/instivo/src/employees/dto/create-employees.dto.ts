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
}