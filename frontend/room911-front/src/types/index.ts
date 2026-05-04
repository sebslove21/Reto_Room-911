export type AdminRole = 'ROLE_ADMIN' | 'ROLE_SUPER_ADMIN'

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  type: string
  id: string
  email: string
  firstName: string
  lastName: string
  role: AdminRole
  departmentId: number | null
  departmentName: string | null
  avatarUrl: string | null
}

export interface CurrentUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: AdminRole
  departmentId: number | null
  departmentName: string | null
  avatarUrl: string | null
}

export interface Department {
  id: number
  name: string
  description: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Employee {
  id: number
  internalId: string
  firstName: string
  lastName: string
  email: string
  departmentId: number
  departmentName: string
  hasAccess: boolean
  isActive: boolean
  isInside: boolean
  enteredAt: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateEmployeeRequest {
  internalId: string
  firstName: string
  lastName: string
  email: string
  departmentId: number
}

export type EmployeeCreateRequest = CreateEmployeeRequest
export type EmployeeUpdateRequest = Partial<CreateEmployeeRequest>

export type AccessResult =
  | 'GRANTED'
  | 'DENIED_NO_PERMISSION'
  | 'DENIED_NOT_FOUND'
  | 'DENIED_MAX_CAPACITY'

export interface AccessValidateResponse {
  result: AccessResult
  message: string
  currentCapacity: number
  maxCapacity: number
  employee?: {
    firstName: string
    lastName: string
    departmentName: string | null
  }
}

export interface DashboardStats {
  totalEmployees: number
  todayAccesses: number
  todayGranted: number
  todayDenied: number
  uniqueEmployeesToday: number
  totalAdmins: number
}

export interface AccessLog {
  id: number
  employeeId: number | null
  internalIdRaw: string
  employeeName: string | null
  departmentName: string | null
  result: AccessResult
  accessedAt: string
  notes: string | null
}

export interface EmployeePresence {
  id: number
  internalId: string
  firstName: string
  lastName: string
  departmentName: string
  enteredAt: string
  minutesInside: number
  status: 'normal' | 'warning' | 'critical'
}

export interface RoomStatus {
  currentCapacity: number
  maxCapacity: number
  maxStayMinutes: number
  alertThresholdPct: number
  occupancyPercentage: number
  employeesInside: EmployeePresence[]
}

export interface RoomSettings {
  id: number
  maxCapacity: number
  maxStayMinutes: number
  alertThresholdPct: number
}

export interface Admin {
  id: string
  firstName: string
  lastName: string
  email: string
  role: AdminRole
  departmentId: number | null
  departmentName: string | null
  isActive: boolean
  lastLoginAt: string | null
  avatarUrl: string | null
  createdAt: string
}

export interface AuditLog {
  id: number
  adminId: string
  adminName: string
  actionType: string
  entity: string
  entityId: string | null
  description: string
  createdAt: string
}

export interface DepartmentStats {
  departmentId: number
  departmentName: string
  totalAccesses: number
  grantedAccesses: number
  deniedAccesses: number
  percentage: number
}

export interface DashboardSummary {
  totalEmployees: number
  accessesToday: number
  currentOccupancy: number
  maxCapacity: number
  deniedToday: number
  activeAdmins: number
}

export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
}

export interface WsCapacityEvent {
  currentOccupancy: number
  maxCapacity: number
  employeeId: number
  action: 'ENTER' | 'EXIT'
}

export interface WsAccessEvent {
  type: string
  result: AccessResult
  employeeId: number | null
  employeeName: string | null
  internalId: string
  timestamp: string
}

export type EmployeeInside = EmployeePresence

export interface WsAlertEvent {
  type: 'TIME_WARNING' | 'TIME_CRITICAL' | 'CAPACITY_WARNING'
  employeeId: number
  employeeName: string
  message: string
  timestamp: string
}