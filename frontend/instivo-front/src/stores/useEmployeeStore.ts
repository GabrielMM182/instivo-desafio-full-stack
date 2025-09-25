import { create } from "zustand";
import axios from "axios";

interface Employee {
  _id: string;
  dataAdmissao: string;
  salarioBruto: number;
  anos: number;
  meses: number;
  dias: number;
  salario35: number;
}

interface FilterState {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
  salarioMin?: number;
  salarioMax?: number;
  dataAdmissaoInicio?: string;
  dataAdmissaoFim?: string;
}

interface Store {
  filters: FilterState;
  records: Employee[];
  total: number;
  loading: boolean;
  error: string | null;
  fetchRecords: () => Promise<void>;
  fetchById: (id: string) => Promise<Employee | null>;
  setFilters: (partial: Partial<FilterState>) => void;
  setPage: (page: number) => void;
  setSort: (sortBy: string, sortOrder?: "asc" | "desc") => void;
  clearFilters: () => void;
  clearError: () => void;
}

export const useEmployeeStore = create<Store>((set, get) => ({
  filters: {
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc"
  },
  records: [],
  total: 0,
  loading: false,
  error: null,

  setFilters: (partial) => {
    set((state) => ({
      filters: { ...state.filters, ...partial, page: 1 },
      error: null
    }));
  },

  setPage: (page) => {
    set((state) => ({
      filters: { ...state.filters, page },
      error: null
    }));
  },

  setSort: (sortBy, sortOrder) => {
    set((state) => {
      const currentSortOrder = sortOrder ||
        (state.filters.sortBy === sortBy && state.filters.sortOrder === "asc" ? "desc" : "asc");

      return {
        filters: {
          ...state.filters,
          sortBy,
          sortOrder: currentSortOrder,
          page: 1
        },
        error: null
      };
    });
  },

  clearFilters: () => {
    set({
      filters: {
        page: 1,
        limit: 10,
        sortBy: "createdAt",
        sortOrder: "desc"
      },
      error: null
    });
  },

  clearError: () => set({ error: null }),

  fetchRecords: async () => {
    const { filters } = get();
    set({ loading: true, error: null });

    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined && value !== "")
      );

      const { data } = await axios.get("http://localhost:3000/registros", {
        params,
      });

      set({
        records: data.registros || [],
        total: data.total || 0,
        loading: false
      });
    } catch (error) {
      console.error("Erro ao buscar registros:", error);
      set({
        loading: false,
        error: "Erro ao carregar registros. Tente novamente.",
        records: [],
        total: 0
      });
    }
  },

  fetchById: async (id) => {
    try {
      const { data } = await axios.get(`http://localhost:3000/registros/${id}`);
      return data;
    } catch (error) {
      console.error("Erro ao buscar registro por ID:", error);
      return null;
    }
  },
}));