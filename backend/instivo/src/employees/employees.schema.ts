import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmployeeDocument = Employee & Document;

@Schema({ timestamps: true })
export class Employee {
  @Prop({ required: true, type: Date })
  dataAdmissao: Date;

  @Prop({ required: true, type: Number, min: 0 })
  salarioBruto: number;

  @Prop({ required: true, type: Number, min: 0 })
  anos: number;

  @Prop({ required: true, type: Number, min: 0, max: 11 })
  meses: number;

  @Prop({ required: true, type: Number, min: 0, max: 30 })
  dias: number;

  @Prop({ required: true, type: Number, min: 0 })
  salario35: number;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
