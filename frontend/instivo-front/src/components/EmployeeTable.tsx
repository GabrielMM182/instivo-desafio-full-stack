import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { DateTime } from "luxon";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useEmployeeContext } from "@/contexts/EmployeeContext";

export function EmployeeTable() {
  const { records, loading, filters, setSort, fetchRecords } = useEmployeeContext();

  const handleSort = (column: string) => {
    setSort(column);
    fetchRecords();
  };

  const getSortIcon = (column: string) => {
    if (filters.sortBy !== column) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return filters.sortOrder === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    try {
      return DateTime.fromISO(dateString).toFormat("dd/MM/yyyy");
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Carregando registros...</p>
        </div>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-8 text-center">
          <p className="text-gray-600">Nenhum registro encontrado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("dataAdmissao")}
                className="h-auto p-0 font-medium hover:bg-transparent"
              >
                Data de Admissão
                {getSortIcon("dataAdmissao")}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("salarioBruto")}
                className="h-auto p-0 font-medium hover:bg-transparent"
              >
                Salário Bruto
                {getSortIcon("salarioBruto")}
              </Button>
            </TableHead>
            <TableHead>Anos</TableHead>
            <TableHead>Meses</TableHead>
            <TableHead>Dias</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("salario35")}
                className="h-auto p-0 font-medium hover:bg-transparent"
              >
                Salário + 35%
                {getSortIcon("salario35")}
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record._id}>
              <TableCell className="font-mono text-xs">{record._id}</TableCell>
              <TableCell>{formatDate(record.dataAdmissao)}</TableCell>
              <TableCell>{formatCurrency(record.salarioBruto)}</TableCell>
              <TableCell>{record.anos}</TableCell>
              <TableCell>{record.meses}</TableCell>
              <TableCell>{record.dias}</TableCell>
              <TableCell className="font-medium">
                {formatCurrency(record.salario35)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}