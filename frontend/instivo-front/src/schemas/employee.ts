import { z } from "zod";

export const employeeSchema = z.object({
  dataAdmissao: z
    .string()
    .min(1, "Data de admissão é obrigatória")
    .refine((date) => {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) return false;

      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    }, "Data deve estar no formato válido")
    .refine((date) => {
      const today = new Date();
      const inputDate = new Date(date);
      today.setHours(0, 0, 0, 0);
      inputDate.setHours(0, 0, 0, 0);

      return inputDate <= today;
    }, "Data de admissão não pode ser futura"),

  salarioBruto: z
    .number({
      message: "Salário deve ser um número válido",
    })
    .positive("Salário deve ser positivo")
    .min(1320, "Salário mínimo é R$ 1.320,00")
    .max(50000, "Salário máximo é R$ 50.000,00"),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;