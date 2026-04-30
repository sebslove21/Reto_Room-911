// ─── Roles ────────────────────────────────────────────────────────────────────
export type AdminRole = 'ROLE_ADMIN' | 'ROLE_SUPER_ADMIN';

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: AdminRole;
  departmentId: number | null;
  departmentName: string | null;
  avatarUrl: string | null;
}

export interface CurrentUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: AdminRole;
  departmentId: number | null;
  departmentName: string | null;
  avatarUrl: string | null;
}

// ─── Department ───────────────────────────────────────────────────────────────
export interface Department {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  employeeCount?: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Employee ─────────────────────────────────────────────────────────────────
export interface Employee {
  id: number;
  internalId: string;
  firstName: string;
  lastName: string;
  email: string;
  departmentId: number;
  departmentName: string;
  hasAccess: boolean;
  isActive: boolean;
  isInside: boolean;
  enteredAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeRequest {
  internalId: string;
  firstName: string;
  lastName: string;
  email: string;
  departmentId: number;
}

// ─── Access ───────────────────────────────────────────────────────────────────
export type AccessResult = 'GRANTED' | 'DENIED_NO_PERMISSION' | 'DENIED_NOT_FOUND' | 'DENIED_MAX_CAPACITY' | 'DENIED_INVALID_QR';

export interface AccessValidateRequest {
  internalId: string;
}

export interface AccessLog {
  id: number;
  employeeId: number | null;
  internalIdRaw: string;
  employeeName: string | null;
  departmentName: string | null;
  result: AccessResult;
  accessedAt: string;
  notes: string | null;
}

// ─── Room ─────────────────────────────────────────────────────────────────────
export interface RoomStatus {
  currentOccupancy: number;
  maxCapacity: number;
  maxStayMinutes: number;
  alertThresholdPct: number;
  occupancyPercentage: number;
  employeesInside: EmployeePresence[];
}

export interface EmployeePresence {
  id: number;
  internalId: string;
  firstName: string;
  lastName: string;
  departmentName: string;
  enteredAt: string;
  minutesInside: number;
  status: 'normal' | 'warning' | 'critical';
}

// ─── Room Settings ────────────────────────────────────────────────────────────
export interface RoomSettings {
  id: number;
  maxCapacity: number;
  maxStayMinutes: number;
  alertThresholdPct: number;
}

// ─── Admin ────────────────────────────────────────────────────────────────────
export interface Admin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: AdminRole;
  departmentId: number | null;
  departmentName: string | null;
  isActive: boolean;
  lastLoginAt: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

// ─── Audit Log ────────────────────────────────────────────────────────────────
export interface AuditLog {
  id: number;
  adminId: string;
  adminName: string;
  actionType: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'EXPORT';
  entity: string;
  entityId: string | null;
  description: string;
  createdAt: string;
}

// ─── Statistics ───────────────────────────────────────────────────────────────
export interface DepartmentStats {
  departmentId: number;
  departmentName: string;
  totalAccesses: number;
  grantedAccesses: number;
  deniedAccesses: number;
  percentage: number;
}

export interface DashboardSummary {
  totalEmployees: number;
  accessesToday: number;
  currentOccupancy: number;
  maxCapacity: number;
  deniedToday: number;
  activeAdmins: number;
}

// ─── QR Token (Funcionalidad innovadora #2) ───────────────────────────────────
export interface QrToken {
  token: string;
  employeeId: number;
  employeeName: string;
  expiresAt: string;
  used: boolean;
}

// ─── Risk Score (Funcionalidad innovadora #1) ─────────────────────────────────
export interface RiskScore {
  employeeId: number;
  employeeName: string;
  score: number;
  level: 'low' | 'medium' | 'high';
  alerts: string[];
  analyzedAt: string;
}

// ─── Pagination ───────────────────────────────────────────────────────────────
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

// ─── WebSocket Events ─────────────────────────────────────────────────────────
export interface WsCapacityEvent {
  currentOccupancy: number;
  maxCapacity: number;
  employeeId: number;
  action: 'ENTER' | 'EXIT';
  employeeName: string;
}

export interface WsAccessEvent {
  result: AccessResult;
  employeeId: number | null;
  employeeName: string | null;
  internalId: string;
  timestamp: string;
}

export interface WsAlertEvent {
  type: 'TIME_WARNING' | 'TIME_CRITICAL' | 'CAPACITY_WARNING' | 'ANOMALY';
  employeeId: number;
  employeeName: string;
  message: string;
  timestamp: string;
}
