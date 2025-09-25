import { useEffect } from "react";
import { Users, AlertCircle } from "lucide-react";

import { FiltersBar } from "@/components/FiltersBar";
import { EmployeeTable } from "@/components/EmployeeTable";
import { EmployeePagination } from "@/components/EmployeePagination";
import { SearchByIdModal } from "@/components/SearchByIdModal";
import { Button } from "@/components/ui/button";
import { useEmployeeStore } from "@/stores/useEmployeeStore";

export function EmployeeListPage() {
  const { fetchRecords, error, clearError, total } = useEmployeeStore();

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Registros de Funcionários
                </h1>
                <p className="text-gray-600">
                  Gerencie e visualize os registros de funcionários
                </p>
              </div>
            </div>
            <SearchByIdModal />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
            <Button variant="outline" size="sm" onClick={clearError}>
              Fechar
            </Button>
          </div>
        )}

        {/* Filters */}
        <FiltersBar />

        {/* Results Summary */}
        {total > 0 && (
          <div className="bg-white rounded-lg border shadow-sm p-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium">{total}</span> registro{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Table */}
        <EmployeeTable />

        {/* Pagination */}
        {total > 0 && (
          <div className="bg-white rounded-lg border shadow-sm p-4">
            <EmployeePagination />
          </div>
        )}
      </div>
    </div>
  );
}