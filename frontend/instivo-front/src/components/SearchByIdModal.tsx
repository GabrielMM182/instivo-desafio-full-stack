import { useState } from "react";
import { Search, User } from "lucide-react";
import { DateTime } from "luxon";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEmployeeStore } from "@/stores/useEmployeeStore";

interface Employee {
  _id: string;
  dataAdmissao: string;
  salarioBruto: number;
  anos: number;
  meses: number;
  dias: number;
  salario35: number;
}

export function SearchByIdModal() {
  const [open, setOpen] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [notFound, setNotFound] = useState(false);
  
  const { fetchById } = useEmployeeStore();

  const handleSearch = async () => {
    if (!searchId.trim()) return;

    setLoading(true);
    setNotFound(false);
    setEmployee(null);

    try {
      const result = await fetchById(searchId.trim());
      if (result) {
        setEmployee(result);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSearchId("");
    setEmployee(null);
    setNotFound(false);
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Search className="h-4 w-4" />
          Buscar por ID
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Buscar Funcionário por ID
          </DialogTitle>
          <DialogDescription>
            Digite o ID do funcionário para visualizar seus detalhes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employee-id">ID do Funcionário</Label>
            <div className="flex gap-2">
              <Input
                id="employee-id"
                placeholder="Ex: 507f1f77bcf86cd799439011"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={loading || !searchId.trim()}>
                {loading ? "Buscando..." : "Buscar"}
              </Button>
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
              <span className="ml-2 text-sm text-gray-600">Buscando...</span>
            </div>
          )}

          {notFound && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-800">
                Funcionário não encontrado. Verifique se o ID está correto.
              </p>
            </div>
          )}

          {employee && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 space-y-3">
              <h4 className="font-medium text-green-800 mb-3">
                Detalhes do Funcionário
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium text-gray-600">ID:</span>
                  <p className="text-gray-900 break-all">{employee._id}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Data de Admissão:</span>
                  <p className="text-gray-900">{formatDate(employee.dataAdmissao)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Salário Bruto:</span>
                  <p className="text-gray-900">{formatCurrency(employee.salarioBruto)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Salário + 35%:</span>
                  <p className="text-gray-900 font-medium">{formatCurrency(employee.salario35)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Tempo de Serviço:</span>
                  <p className="text-gray-900">
                    {employee.anos} anos, {employee.meses} meses, {employee.dias} dias
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={handleClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}