import api from './axios';
import type {
  AccessValidateRequest, AccessLog, RoomStatus,
  RoomSettings, Department, DepartmentStats,
  DashboardSummary, QrToken, Page, AuditLog,
  Admin, RiskScore
} from '../components/types';

// ─── Access ───────────────────────────────────────────────────────────────────
export const accessApi = {
  validate: (data: AccessValidateRequest) =>
    api.post<AccessLog>('/access/validate', data),

  validateQr: (token: string) =>
    api.post<AccessLog>('/access/validate-qr', { token }),

  generateQr: (employeeId: number) =>
    api.post<QrToken>(`/access/qr/${employeeId}`),

  sendQrByEmail: (employeeId: number) =>
    api.post(`/access/qr/${employeeId}/send-email`),

  getRoomStatus: () =>
    api.get<RoomStatus>('/room/status'),
};

// ─── Room Settings ────────────────────────────────────────────────────────────
export const settingsApi = {
  get: () => api.get<RoomSettings>('/room/settings'),
  update: (data: Partial<RoomSettings>) =>
    api.put<RoomSettings>('/room/settings', data),
};

// ─── Departments ──────────────────────────────────────────────────────────────
export const departmentsApi = {
  getAll: () => api.get<Department[]>('/departments'),
  getById: (id: number) => api.get<Department>(`/departments/${id}`),
  create: (data: { name: string; description: string }) =>
    api.post<Department>('/departments', data),
  update: (id: number, data: { name?: string; description?: string; isActive?: boolean }) =>
    api.put<Department>(`/departments/${id}`, data),
  delete: (id: number) => api.delete(`/departments/${id}`),
};

// ─── Logs ─────────────────────────────────────────────────────────────────────
export const logsApi = {
  getByEmployee: (id: number, params: {
    startDate?: string;
    endDate?: string;
    page?: number;
    size?: number;
  }) => api.get<Page<AccessLog>>(`/logs/employee/${id}`, { params }),

  getAll: (params: {
    startDate?: string;
    endDate?: string;
    page?: number;
    size?: number;
  }) => api.get<Page<AccessLog>>('/logs/all', { params }),

  exportPdf: (employeeId: number, startDate?: string, endDate?: string) =>
    api.get(`/logs/employee/${employeeId}/export-pdf`, {
      params: { startDate, endDate },
      responseType: 'blob',
    }),
};

// ─── Statistics ───────────────────────────────────────────────────────────────
export const statisticsApi = {
  getByDepartment: (params: {
    period?: 'today' | 'week' | 'month' | 'custom';
    startDate?: string;
    endDate?: string;
  }) => api.get<DepartmentStats[]>('/statistics/access-by-department', { params }),

  getSummary: () => api.get<DashboardSummary>('/statistics/summary'),
};

// ─── Super Admin ──────────────────────────────────────────────────────────────
export const superAdminApi = {
  getDashboard: () => api.get('/superadmin/dashboard'),

  getAdmins: () => api.get<Admin[]>('/superadmin/admins'),
  createAdmin: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    departmentId: number;
  }) => api.post<Admin>('/superadmin/admins', data),
  updateAdmin: (id: string, data: Partial<Admin>) =>
    api.put<Admin>(`/superadmin/admins/${id}`, data),
  toggleAdmin: (id: string, isActive: boolean) =>
    api.patch(`/superadmin/admins/${id}/status`, { isActive }),

  getAuditLog: (params: {
    adminId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    size?: number;
  }) => api.get<Page<AuditLog>>('/superadmin/audit-log', { params }),
};

// ─── Profile ──────────────────────────────────────────────────────────────────
export const profileApi = {
  update: (data: { firstName?: string; lastName?: string; email?: string }) =>
    api.put('/users/me', data),
  uploadAvatar: (file: File) => {
    const form = new FormData();
    form.append('avatar', file);
    return api.patch('/users/me/avatar', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// ─── AI Risk Analysis (Funcionalidad innovadora #1) ───────────────────────────
export const analyticsApi = {
  getRiskScore: (employeeId: number) =>
    api.get<RiskScore>(`/analytics/risk-score/${employeeId}`),
  getAllRiskScores: () =>
    api.get<RiskScore[]>('/analytics/risk-scores'),
};
