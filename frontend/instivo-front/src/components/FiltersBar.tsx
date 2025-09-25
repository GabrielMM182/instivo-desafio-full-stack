import { useState } from "react";
import { CalendarDays, Filter } from "lucide-react";
import { DateTime } from "luxon";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEmployeeStore } from "@/stores/useEmployeeStore";
import { cn } from "@/lib/utils";

export function FiltersBar() {
  const { filters, setFilters, clearFilters, fetchRecords } = useEmployeeStore();
  const [localFilters, setLocalFilters] = useState({
    salarioMin: filters.salarioMin?.toString() || "",
    salarioMax: filters.salarioMax?.toString() || "",
    dataAdmissaoInicio: filters.dataAdmissaoInicio || "",
    dataAdmissaoFim: filters.dataAdmissaoFim || "",
    limit: filters.limit.toString(),
  });

  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: filters.dataAdmissaoInicio ? DateTime.fromISO(filters.dataAdmissaoInicio).toJSDate() : undefined,
    to: filters.dataAdmissaoFim ? DateTime.fromISO(filters.dataAdmissaoFim).toJSDate() : undefined,
  });

  const handleApplyFilters = () => {
    const newFilters: any = {
      limit: parseInt(localFilters.limit) || 10,
    };

    if (localFilters.salarioMin) {
      newFilters.salarioMin = parseFloat(localFilters.salarioMin);
    }
    if (localFilters.salarioMax) {
      newFilters.salarioMax = parseFloat(localFilters.salarioMax);
    }
    if (dateRange.from) {
      newFilters.dataAdmissaoInicio = DateTime.fromJSDate(dateRange.from).toISODate();
    }
    if (dateRange.to) {
      newFilters.dataAdmissaoFim = DateTime.fromJSDate(dateRange.to).toISODate();
    }

    setFilters(newFilters);
    fetchRecords();
  };

  const handleClearFilters = () => {
    // Reset local state
    setLocalFilters({
      salarioMin: "",
      salarioMax: "",
      dataAdmissaoInicio: "",
      dataAdmissaoFim: "",
      limit: "10",
    });
    setDateRange({ from: undefined, to: undefined });
    
    // Clear filters in store and fetch records
    clearFilters();
    fetchRecords();
  };

  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-4 w-4" />
        <h3 className="font-medium">Filtros</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Faixa de Salário */}
        <div className="space-y-2">
          <Label>Salário Mínimo</Label>
          <Input
            type="number"
            placeholder="Ex: 1320"
            value={localFilters.salarioMin}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, salarioMin: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Salário Máximo</Label>
          <Input
            type="number"
            placeholder="Ex: 50000"
            value={localFilters.salarioMax}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, salarioMax: e.target.value })
            }
          />
        </div>

        {/* Período de Admissão */}
        <div className="space-y-2">
          <Label>Período de Admissão</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateRange.from && "text-muted-foreground"
                )}
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {DateTime.fromJSDate(dateRange.from).toFormat("dd/MM/yyyy")} -{" "}
                      {DateTime.fromJSDate(dateRange.to).toFormat("dd/MM/yyyy")}
                    </>
                  ) : (
                    DateTime.fromJSDate(dateRange.from).toFormat("dd/MM/yyyy")
                  )
                ) : (
                  "Selecionar período"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                numberOfMonths={2}

              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Registros por página */}
        <div className="space-y-2">
          <Label>Registros por página</Label>
          <Select
            value={localFilters.limit}
            onValueChange={(value) =>
              setLocalFilters({ ...localFilters, limit: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button onClick={handleApplyFilters} className="flex-1 md:flex-none">
          Aplicar Filtros
        </Button>
        <Button variant="outline" onClick={handleClearFilters}>
          Limpar
        </Button>
      </div>
    </div>
  );
}