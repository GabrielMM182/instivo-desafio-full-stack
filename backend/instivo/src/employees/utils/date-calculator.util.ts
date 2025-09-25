import { DateTime } from 'luxon';

export interface TempoTrabalho {
  anos: number;
  meses: number;
  dias: number;
}

export class DateCalculatorUtil {
  static calcularTempoTrabalho(dataAdmissao: Date, dataFinal?: Date): TempoTrabalho {
    const inicio = DateTime.fromJSDate(dataAdmissao);
    const fim = dataFinal ? DateTime.fromJSDate(dataFinal) : DateTime.now();

    const diff = fim.diff(inicio, ['years', 'months', 'days']);

    return {
      anos: Math.floor(diff.years),
      meses: Math.floor(diff.months % 12),
      dias: Math.floor(diff.days % 30),
    };
  }

  static validarDataAdmissao(data: string | Date): boolean {
    const dateTime = typeof data === 'string'
      ? DateTime.fromISO(data)
      : DateTime.fromJSDate(data);

    return dateTime.isValid && dateTime <= DateTime.now().endOf('day');
  }

  static formatarDataBR(data: Date): string {
    return DateTime.fromJSDate(data).toFormat('dd/MM/yyyy');
  }

  static isoParaDate(isoString: string): Date {
    const dateTime = DateTime.fromISO(isoString);
    if (!dateTime.isValid) {
      throw new Error('Data inválida');
    }
    return dateTime.toJSDate();
  }
}