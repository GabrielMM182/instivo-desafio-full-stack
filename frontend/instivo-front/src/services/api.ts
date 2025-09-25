import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tipos para as interfaces
export interface Employee {
  _id: string;
  dataAdmissao: string;
  salarioBruto: number;
  anos: number;
  meses: number;
  dias: number;
  salario35: number;
}

export interface EmployeeFormData {
  dataAdmissao: string;
  salarioBruto: number;
}

export interface FilterParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  salarioMin?: number;
  salarioMax?: number;
  dataAdmissaoInicio?: string;
  dataAdmissaoFim?: string;
}

export interface EmployeeListResponse {
  registros: Employee[];
  total: number;
}

export const employeeService = {
  async getAll(params?: FilterParams): Promise<EmployeeListResponse> {
    const filteredParams = Object.fromEntries(
      Object.entries(params || {}).filter(([_, value]) => value !== undefined && value !== "")
    );
    
    const { data } = await api.get<EmployeeListResponse>('/registros', {
      params: filteredParams,
    });
    
    return data;
  },

  async getById(id: string): Promise<Employee> {
    const { data } = await api.get<Employee>(`/registros/${id}`);
    return data;
  },

  async create(employeeData: EmployeeFormData): Promise<Employee> {
    const { data } = await api.post<Employee>('/registros', employeeData);
    return data;
  },
};

export default api;