import { createContext, useContext, useReducer, useCallback } from "react";
import type { ReactNode } from "react";
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

interface EmployeeState {
  filters: FilterState;
  records: Employee[];
  total: number;
  loading: boolean;
  error: string | null;
}

type EmployeeAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_RECORDS"; payload: { records: Employee[]; total: number } }
  | { type: "SET_FILTERS"; payload: Partial<FilterState> }
  | { type: "SET_PAGE"; payload: number }
  | { type: "SET_SORT"; payload: { sortBy: string; sortOrder?: "asc" | "desc" } }
  | { type: "CLEAR_FILTERS" };

const initialState: EmployeeState = {
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
};

function employeeReducer(state: EmployeeState, action: EmployeeAction): EmployeeState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    
    case "SET_ERROR":
      return { ...state, error: action.payload };
    
    case "SET_RECORDS":
      return {
        ...state,
        records: action.payload.records,
        total: action.payload.total,
        loading: false
      };
    
    case "SET_FILTERS":
      return {
        ...state,
        filters: { ...state.filters, ...action.payload, page: 1 },
        error: null
      };
    
    case "SET_PAGE":
      return {
        ...state,
        filters: { ...state.filters, page: action.payload },
        error: null
      };
    
    case "SET_SORT":
      const currentSortOrder = action.payload.sortOrder ||
        (state.filters.sortBy === action.payload.sortBy && state.filters.sortOrder === "asc" ? "desc" : "asc");
      
      return {
        ...state,
        filters: {
          ...state.filters,
          sortBy: action.payload.sortBy,
          sortOrder: currentSortOrder,
          page: 1
        },
        error: null
      };
    
    case "CLEAR_FILTERS":
      return {
        ...state,
        filters: {
          page: 1,
          limit: 10,
          sortBy: "createdAt",
          sortOrder: "desc"
        },
        error: null
      };
    
    default:
      return state;
  }
}

interface EmployeeContextType extends EmployeeState {
  fetchRecords: () => Promise<void>;
  fetchById: (id: string) => Promise<Employee | null>;
  setFilters: (partial: Partial<FilterState>) => void;
  setPage: (page: number) => void;
  setSort: (sortBy: string, sortOrder?: "asc" | "desc") => void;
  clearFilters: () => void;
  clearError: () => void;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

interface EmployeeProviderProps {
  children: ReactNode;
}

export function EmployeeProvider({ children }: EmployeeProviderProps) {
  const [state, dispatch] = useReducer(employeeReducer, initialState);

  const fetchRecords = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const params = Object.fromEntries(
        Object.entries(state.filters).filter(([_, value]) => value !== undefined && value !== "")
      );

      const { data } = await axios.get("http://localhost:3000/registros", {
        params,
      });

      dispatch({
        type: "SET_RECORDS",
        payload: {
          records: data.registros || [],
          total: data.total || 0
        }
      });
    } catch (error) {
      console.error("Erro ao buscar registros:", error);
      dispatch({
        type: "SET_ERROR",
        payload: "Erro ao carregar registros. Tente novamente."
      });
      dispatch({
        type: "SET_RECORDS",
        payload: { records: [], total: 0 }
      });
    }
  }, [state.filters]);

  const fetchById = useCallback(async (id: string): Promise<Employee | null> => {
    try {
      const { data } = await axios.get(`http://localhost:3000/registros/${id}`);
      return data;
    } catch (error) {
      console.error("Erro ao buscar registro por ID:", error);
      return null;
    }
  }, []);

  const setFilters = useCallback((partial: Partial<FilterState>) => {
    dispatch({ type: "SET_FILTERS", payload: partial });
  }, []);

  const setPage = useCallback((page: number) => {
    dispatch({ type: "SET_PAGE", payload: page });
  }, []);

  const setSort = useCallback((sortBy: string, sortOrder?: "asc" | "desc") => {
    dispatch({ type: "SET_SORT", payload: { sortBy, sortOrder } });
  }, []);

  const clearFilters = useCallback(() => {
    dispatch({ type: "CLEAR_FILTERS" });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "SET_ERROR", payload: null });
  }, []);

  const value: EmployeeContextType = {
    ...state,
    fetchRecords,
    fetchById,
    setFilters,
    setPage,
    setSort,
    clearFilters,
    clearError,
  };

  return (
    <EmployeeContext.Provider value={value}>
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployeeContext(): EmployeeContextType {
  const context = useContext(EmployeeContext);
  if (context === undefined) {
    throw new Error("useEmployeeContext must be used within an EmployeeProvider");
  }
  return context;
}