import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { employeeSchema, type EmployeeFormData } from "@/schemas/employee";
import { cn } from "@/lib/utils";

export const EmployeeRegistrationForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      dataAdmissao: "",
      salarioBruto: undefined,
    },
  });

  const onSubmit = async (data: EmployeeFormData) => {
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      await axios.post("http://localhost:3000/registros", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      form.reset();
      setSubmitMessage({
        type: "success",
        text: "Funcionário cadastrado com sucesso!",
      });

      setTimeout(() => setSubmitMessage(null), 5000);
    } catch (error) {
      let errorMessage = "Erro ao cadastrar funcionário. Tente novamente.";
      
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          errorMessage = Array.isArray(error.response.data.message)
            ? error.response.data.message.join(", ")
            : error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
      }

      setSubmitMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Cadastro de Funcionário
      </h2>

      {submitMessage && (
        <div
          className={cn(
            "mb-4 p-3 rounded-md text-sm font-medium",
            submitMessage.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          )}
        >
          {submitMessage.text}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="dataAdmissao"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-sm font-medium text-gray-700">
                  Data de Admissão
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "dd/MM/yyyy", {
                            locale: ptBR,
                          })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          field.onChange(format(date, "yyyy-MM-dd"));
                        }
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="salarioBruto"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Salário Bruto (R$)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="1320"
                    max="50000"
                    placeholder="Ex: 2500.00"
                    className="w-full"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? undefined : parseFloat(value));
                    }}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <p className="text-xs text-gray-500 mt-1">
                  Valor entre R$ 1.320,00 e R$ 50.000,00
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cadastrando...
              </>
            ) : (
              "Cadastrar Funcionário"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};