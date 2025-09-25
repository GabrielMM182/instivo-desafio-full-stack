import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Employee } from '../employees.schema';
import { DateTime } from 'luxon';

async function populateEmployeeSchema() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const employeeModel = app.get<Model<Employee>>(getModelToken(Employee.name));

    await employeeModel.deleteMany({});

    const registerExemple = [
        {
            dataAdmissao: DateTime.now().minus({ years: 2, months: 6 }).toJSDate(),
            salarioBruto: 3500,
            anos: 2,
            meses: 6,
            dias: 15,
            salario35: 4725,
        },
        {
            dataAdmissao: DateTime.now().minus({ years: 1, months: 3 }).toJSDate(),
            salarioBruto: 4200,
            anos: 1,
            meses: 3,
            dias: 8,
            salario35: 5670,
        },
        {
            dataAdmissao: DateTime.now().minus({ years: 3, months: 0 }).toJSDate(),
            salarioBruto: 5800,
            anos: 3,
            meses: 0,
            dias: 22,
            salario35: 7830,
        },
        {
            dataAdmissao: DateTime.now().minus({ months: 8 }).toJSDate(),
            salarioBruto: 2800,
            anos: 0,
            meses: 8,
            dias: 12,
            salario35: 3780,
        },
        {
            dataAdmissao: DateTime.now().minus({ years: 5, months: 2 }).toJSDate(),
            salarioBruto: 7500,
            anos: 5,
            meses: 2,
            dias: 5,
            salario35: 10125,
        },
        {
            dataAdmissao: DateTime.now().minus({ years: 1, months: 9 }).toJSDate(),
            salarioBruto: 3200,
            anos: 1,
            meses: 9,
            dias: 18,
            salario35: 4320,
        },
        {
            dataAdmissao: DateTime.now().minus({ months: 4 }).toJSDate(),
            salarioBruto: 4800,
            anos: 0,
            meses: 4,
            dias: 25,
            salario35: 6480,
        },
        {
            dataAdmissao: DateTime.now().minus({ years: 2, months: 11 }).toJSDate(),
            salarioBruto: 6200,
            anos: 2,
            meses: 11,
            dias: 3,
            salario35: 8370,
        },
    ];

    const employeesCreated = await employeeModel.insertMany(registerExemple);

    console.log(`✅ ${employeesCreated.length} employees created successfully!`);
    console.log('📊 Inserted data:');

    employeesCreated.forEach((employee, index) => {
        console.log(`${index + 1}. Date: ${DateTime.fromJSDate(employee.dataAdmissao).toFormat('dd/MM/yyyy')} | Salary: R$ ${employee.salarioBruto} | Time: ${employee.anos}y ${employee.meses}m ${employee.dias}d`);
    });

    await app.close();
}

populateEmployeeSchema()
    .then(() => {
        console.log('🎉 Database population completed!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Error populating database:', error);
        process.exit(1);
    });