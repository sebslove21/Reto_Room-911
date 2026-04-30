import api from './axios';
import type { Employee, CreateEmployeeRequest, Page } from '../components/types';

export const employeesApi = {
  getAll: (params: {
    search?: string;
    departmentId?: number;
    page?: number;
    size?: number;
  }) => api.get<Page<Employee>>('/employees', { params }),

  getById: (id: number) =>
    api.get<Employee>(`/employees/${id}`),

  create: (data: CreateEmployeeRequest) =>
    api.post<Employee>('/employees', data),

  update: (id: number, data: Partial<CreateEmployeeRequest> & { hasAccess?: boolean }) =>
    api.put<Employee>(`/employees/${id}`, data),

  toggleAccess: (id: number, hasAccess: boolean) =>
    api.patch<Employee>(`/employees/${id}/access`, { hasAccess }),

  importCsv: (file: File, departmentId: number) => {
    const form = new FormData();
    form.append('file', file);
    form.append('departmentId', String(departmentId));
    return api.post('/employees/import', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  downloadTemplate: () =>
    api.get('/employees/template', { responseType: 'blob' }),
};
