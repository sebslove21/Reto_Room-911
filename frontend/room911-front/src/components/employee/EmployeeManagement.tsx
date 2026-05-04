import { useState, useEffect, useRef } from 'react'
import {
  Plus, Search, Upload, Edit,
  ToggleLeft, ToggleRight, Filter,
  Download, X, FileText, AlertCircle,
  CheckCircle
} from 'lucide-react'
import { toast } from 'sonner'
import { employeesApi } from '../../api/employees.api'
import { departmentsApi } from '../../api'
import { useDebounce } from '../../hooks'
import { formatDate, downloadBlob } from '../../utils/formatters'
import { useAuth } from '../../context/AuthContext'
import type { Employee, Department } from '../../types'

// ─── Modal de Importación CSV ─────────────────────────────────
function ImportCsvModal({
  departments,
  fixedDepartmentId,
  onClose,
  onImported,
}: {
  departments: Department[]
  fixedDepartmentId: number | null
  onClose: () => void
  onImported: () => void
}) {
  const [file,         setFile]         = useState<File | null>(null)
  const [departmentId, setDepartmentId] = useState<number>(
    fixedDepartmentId ?? departments[0]?.id ?? 0
  )
  const [loading,  setLoading]  = useState(false)
  const [result,   setResult]   = useState<{
    imported: number; skipped: number; errors: string[]
  } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (!f.name.endsWith('.csv')) {
      toast.error('Solo se permiten archivos .csv')
      return
    }
    setFile(f)
    setResult(null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (!f) return
    if (!f.name.endsWith('.csv')) {
      toast.error('Solo se permiten archivos .csv')
      return
    }
    setFile(f)
    setResult(null)
  }

  const handleImport = async () => {
    if (!file) { toast.error('Selecciona un archivo CSV'); return }
    if (!departmentId) { toast.error('Selecciona un departamento'); return }
    setLoading(true)
    try {
      const { data } = await employeesApi.importCsv(file, departmentId)
      setResult(data as any)
      toast.success(
        `${data.imported} empleados cargados, ${data.skipped} omitidos`
      )
      onImported()
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ?? 'Error al importar el archivo'
      )
    } finally {
      setLoading(false)
    }
  }

  const dept = departments.find(d => d.id === departmentId)

  return (
    <div style={{
      position: 'fixed', inset: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 1000, padding: 16,
    }}
    onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        backgroundColor: 'white', borderRadius: 16,
        width: '100%', maxWidth: 520,
        boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, backgroundColor: '#e3f2fd',
              borderRadius: 10, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Upload size={18} color="#1976d2" />
            </div>
            <div>
              <div style={{
                fontSize: 15, fontWeight: 600, color: '#1a1d29',
              }}>
                Importar Empleados CSV
              </div>
              <div style={{ fontSize: 12, color: '#546e7a' }}>
                Carga masiva de empleados
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none',
            cursor: 'pointer', color: '#546e7a',
            padding: 4,
          }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: 24 }}>
          {/* Departamento */}
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block', fontSize: 13,
              fontWeight: 500, color: '#1a1d29', marginBottom: 6,
            }}>
              Departamento destino
            </label>
            {fixedDepartmentId ? (
              <div style={{
                padding: '10px 14px',
                backgroundColor: '#f8f9fa',
                border: '1px solid #e0e0e0',
                borderRadius: 8, fontSize: 13,
                color: '#1a1d29', fontWeight: 500,
              }}>
                📁 {dept?.name ?? 'Tu departamento'}
                <span style={{
                  fontSize: 11, color: '#546e7a',
                  marginLeft: 8,
                }}>
                  (asignado a tu cuenta)
                </span>
              </div>
            ) : (
              <select
                value={departmentId}
                onChange={e => setDepartmentId(Number(e.target.value))}
                style={{
                  width: '100%', padding: '10px 12px',
                  border: '1px solid #e0e0e0', borderRadius: 8,
                  fontSize: 13, outline: 'none',
                  backgroundColor: 'white',
                  boxSizing: 'border-box' as const,
                }}>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            )}
          </div>

          {/* Zona drag & drop */}
          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => inputRef.current?.click()}
            style={{
              border: `2px dashed ${file ? '#2e7d32' : '#e0e0e0'}`,
              borderRadius: 12, padding: '32px 24px',
              textAlign: 'center', cursor: 'pointer',
              backgroundColor: file ? '#f1f8e9' : '#f8f9fa',
              transition: 'all 0.2s', marginBottom: 16,
            }}
            onMouseEnter={e => {
              if (!file)
                (e.currentTarget as HTMLElement)
                  .style.borderColor = '#1976d2'
            }}
            onMouseLeave={e => {
              if (!file)
                (e.currentTarget as HTMLElement)
                  .style.borderColor = '#e0e0e0'
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".csv"
              onChange={handleFile}
              style={{ display: 'none' }}
            />
            {file ? (
              <>
                <FileText size={36} color="#2e7d32"
                  style={{ margin: '0 auto 10px', display: 'block' }} />
                <div style={{
                  fontSize: 14, fontWeight: 600,
                  color: '#2e7d32', marginBottom: 4,
                }}>
                  {file.name}
                </div>
                <div style={{ fontSize: 12, color: '#546e7a' }}>
                  {(file.size / 1024).toFixed(1)} KB · Listo para importar
                </div>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation()
                    setFile(null)
                    setResult(null)
                    if (inputRef.current) inputRef.current.value = ''
                  }}
                  style={{
                    marginTop: 10, padding: '4px 12px',
                    backgroundColor: 'transparent',
                    border: '1px solid #d32f2f',
                    borderRadius: 6, fontSize: 11,
                    color: '#d32f2f', cursor: 'pointer',
                  }}>
                  Quitar archivo
                </button>
              </>
            ) : (
              <>
                <Upload size={36} color="#546e7a"
                  style={{
                    margin: '0 auto 12px', display: 'block',
                    opacity: 0.5,
                  }} />
                <div style={{
                  fontSize: 14, fontWeight: 500,
                  color: '#1a1d29', marginBottom: 6,
                }}>
                  Arrastra el CSV aquí o haz clic para seleccionar
                </div>
                <div style={{ fontSize: 12, color: '#546e7a' }}>
                  Solo archivos .csv · Máx 5MB
                </div>
              </>
            )}
          </div>

          {/* Formato esperado */}
          <div style={{
            backgroundColor: '#fff3e0',
            border: '1px solid #ffe0b2',
            borderRadius: 8, padding: '10px 14px',
            marginBottom: 16,
          }}>
            <div style={{
              fontSize: 11, fontWeight: 600,
              color: '#f57c00', marginBottom: 4,
            }}>
              Formato requerido del CSV:
            </div>
            <code style={{
              fontSize: 11, color: '#1a1d29',
              fontFamily: 'monospace',
            }}>
              internal_id, first_name, last_name, email
            </code>
            <div style={{
              fontSize: 11, color: '#546e7a', marginTop: 4,
            }}>
              La primera fila debe ser el encabezado.
              El campo email es opcional.
            </div>
          </div>

          {/* Resultado */}
          {result && (
            <div style={{
              backgroundColor: '#f1f8e9',
              border: '1px solid #c8e6c9',
              borderRadius: 8, padding: 14, marginBottom: 16,
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                marginBottom: 8,
              }}>
                <CheckCircle size={16} color="#2e7d32" />
                <span style={{
                  fontSize: 13, fontWeight: 600, color: '#2e7d32',
                }}>
                  Importación completada
                </span>
              </div>
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: 8,
              }}>
                <div style={{
                  backgroundColor: 'white', borderRadius: 6,
                  padding: '8px 12px', textAlign: 'center',
                }}>
                  <div style={{
                    fontSize: 20, fontWeight: 800, color: '#2e7d32',
                  }}>
                    {result.imported}
                  </div>
                  <div style={{ fontSize: 11, color: '#546e7a' }}>
                    Importados
                  </div>
                </div>
                <div style={{
                  backgroundColor: 'white', borderRadius: 6,
                  padding: '8px 12px', textAlign: 'center',
                }}>
                  <div style={{
                    fontSize: 20, fontWeight: 800, color: '#f57c00',
                  }}>
                    {result.skipped}
                  </div>
                  <div style={{ fontSize: 11, color: '#546e7a' }}>
                    Omitidos (duplicados)
                  </div>
                </div>
              </div>
              {result.errors.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div style={{
                    fontSize: 11, fontWeight: 600,
                    color: '#d32f2f', marginBottom: 4,
                  }}>
                    Errores:
                  </div>
                  {result.errors.map((err, i) => (
                    <div key={i} style={{
                      fontSize: 11, color: '#d32f2f',
                    }}>
                      • {err}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Acciones */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onClose} style={{
              flex: 1, padding: '10px',
              border: '1px solid #e0e0e0', borderRadius: 8,
              fontSize: 13, color: '#546e7a',
              cursor: 'pointer', backgroundColor: 'white',
            }}>
              {result ? 'Cerrar' : 'Cancelar'}
            </button>
            {!result && (
              <button
                onClick={handleImport}
                disabled={loading || !file}
                style={{
                  flex: 2, padding: '10px',
                  backgroundColor: !file ? '#e0e0e0' : '#0d47a1',
                  color: !file ? '#546e7a' : 'white',
                  border: 'none', borderRadius: 8,
                  fontSize: 13, fontWeight: 600,
                  cursor: loading || !file
                    ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: 8,
                }}>
                {loading ? (
                  <>
                    <div style={{
                      width: 14, height: 14,
                      border: '2px solid white',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }} />
                    Importando...
                  </>
                ) : (
                  <>
                    <Upload size={14} />
                    Importar {file ? `"${file.name}"` : 'archivo'}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────
export function EmployeeManagement() {
  const { user } = useAuth()
  const isSuperAdmin = user?.role === 'ROLE_SUPER_ADMIN'

  // Admin normal solo ve su departamento
  const fixedDeptId = isSuperAdmin ? null : (user?.departmentId ?? null)

  const [employees,     setEmployees]     = useState<Employee[]>([])
  const [departments,   setDepartments]   = useState<Department[]>([])
  const [search,        setSearch]        = useState('')
  const [deptFilter,    setDeptFilter]    = useState<number | ''>(
    fixedDeptId ?? ''
  )
  const [page,          setPage]          = useState(0)
  const [totalPages,    setTotalPages]    = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [loading,       setLoading]       = useState(true)
  const [showForm,      setShowForm]      = useState(false)
  const [showImport,    setShowImport]    = useState(false)
  const [editing,       setEditing]       = useState<Employee | null>(null)

  const debouncedSearch = useDebounce(search, 400)

  useEffect(() => {
    departmentsApi.getAll()
      .then(r => {
        // Admin normal solo ve su departamento en el selector
        if (fixedDeptId) {
          setDepartments(r.data.filter(d => d.id === fixedDeptId))
        } else {
          setDepartments(r.data)
        }
      })
      .catch(console.error)
  }, [fixedDeptId])

  useEffect(() => {
    loadEmployees()
  }, [debouncedSearch, deptFilter, page])

  // Forzar filtro por departamento si es admin normal
  useEffect(() => {
    if (fixedDeptId && deptFilter !== fixedDeptId) {
      setDeptFilter(fixedDeptId)
    }
  }, [fixedDeptId])

  const loadEmployees = async () => {
    setLoading(true)
    try {
      const { data } = await employeesApi.getAll({
        search:       debouncedSearch || undefined,
        // Admin normal siempre filtra por su departamento
        departmentId: fixedDeptId ?? (deptFilter || undefined),
        page,
        size: 10,
      })
      setEmployees(data.content)
      setTotalPages(data.totalPages)
      setTotalElements(data.totalElements)
    } catch {
      toast.error('Error al cargar empleados')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleAccess = async (emp: Employee) => {
    try {
      await employeesApi.toggleAccess(emp.id, !emp.hasAccess)
      toast.success(
        `Acceso ${!emp.hasAccess
          ? 'habilitado' : 'deshabilitado'} — ${emp.firstName} ${emp.lastName}`
      )
      loadEmployees()
    } catch {
      toast.error('Error al cambiar estado de acceso')
    }
  }

  const handleDownloadTemplate = async () => {
    try {
      const { data } = await employeesApi.downloadTemplate()
      downloadBlob(data, 'plantilla_empleados.csv')
    } catch {
      toast.error('Error al descargar plantilla')
    }
  }

  const th: React.CSSProperties = {
    padding: '10px 14px', textAlign: 'left',
    fontSize: 11, fontWeight: 600, color: '#546e7a',
    textTransform: 'uppercase', letterSpacing: '0.05em',
  }
  const td: React.CSSProperties = {
    padding: '11px 14px', fontSize: 13, color: '#546e7a',
  }

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 24,
      }}>
        <div>
          <h1 style={{
            fontSize: 22, fontWeight: 700,
            color: '#1a1d29', margin: '0 0 4px',
          }}>
            Gestión de Empleados
          </h1>
          <p style={{ fontSize: 13, color: '#546e7a', margin: 0 }}>
            {totalElements} empleados
            {fixedDeptId && user?.departmentName
              ? ` · ${user.departmentName}`
              : ''}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleDownloadTemplate} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', backgroundColor: 'white',
            border: '1px solid #e0e0e0', borderRadius: 8,
            fontSize: 13, color: '#546e7a', cursor: 'pointer',
          }}>
            <Download size={14} /> Plantilla CSV
          </button>

          {/* Botón Importar — abre modal */}
          <button
            onClick={() => setShowImport(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', backgroundColor: '#1976d2',
              border: 'none', borderRadius: 8,
              fontSize: 13, color: 'white', cursor: 'pointer',
            }}>
            <Upload size={14} /> Importar CSV
          </button>

          <button
            onClick={() => { setEditing(null); setShowForm(true) }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', backgroundColor: '#0d47a1',
              border: 'none', borderRadius: 8,
              fontSize: 13, color: 'white', cursor: 'pointer',
            }}>
            <Plus size={14} /> Nuevo Empleado
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div style={{
        display: 'flex', gap: 12, marginBottom: 16,
        alignItems: 'center',
      }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <Search size={15} color="#546e7a" style={{
            position: 'absolute', left: 10,
            top: '50%', transform: 'translateY(-50%)',
          }} />
          <input
            type="text" value={search}
            onChange={e => { setSearch(e.target.value); setPage(0) }}
            placeholder="Buscar por ID, nombre o apellido..."
            style={{
              width: '100%', padding: '9px 12px 9px 32px',
              border: '1px solid #e0e0e0', borderRadius: 8,
              fontSize: 13, outline: 'none', boxSizing: 'border-box',
            }} />
        </div>

        {/* Filtro depto solo si es super admin */}
        {isSuperAdmin && (
          <div style={{ position: 'relative' }}>
            <Filter size={14} color="#546e7a" style={{
              position: 'absolute', left: 10,
              top: '50%', transform: 'translateY(-50%)',
            }} />
            <select
              value={deptFilter}
              onChange={e => {
                setDeptFilter(
                  e.target.value ? Number(e.target.value) : '')
                setPage(0)
              }}
              style={{
                padding: '9px 12px 9px 30px',
                border: '1px solid #e0e0e0', borderRadius: 8,
                fontSize: 13, outline: 'none',
                backgroundColor: 'white', minWidth: 200,
              }}>
              <option value="">Todos los departamentos</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Admin normal — badge de su departamento */}
        {!isSuperAdmin && user?.departmentName && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 14px', backgroundColor: '#e3f2fd',
            borderRadius: 20, fontSize: 12,
            color: '#1976d2', fontWeight: 500,
          }}>
            <Filter size={12} />
            {user.departmentName}
          </div>
        )}

        {isSuperAdmin && (search || deptFilter) && (
          <button
            onClick={() => { setSearch(''); setDeptFilter(''); setPage(0) }}
            style={{
              background: 'none', border: 'none',
              color: '#1976d2', fontSize: 13, cursor: 'pointer',
            }}>
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Tabla */}
      <div style={{
        backgroundColor: 'white', borderRadius: 12,
        border: '1px solid #e0e0e0', overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                {['ID Interno', 'Nombre', 'Departamento',
                  'Email', 'Acceso', 'Estado',
                  'Registro', 'Acciones'].map(h => (
                  <th key={h} style={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}
                    style={{ borderTop: '1px solid #f0f0f0' }}>
                    {[...Array(8)].map((_, j) => (
                      <td key={j} style={{ padding: '11px 14px' }}>
                        <div style={{
                          height: 13, backgroundColor: '#f0f0f0',
                          borderRadius: 4,
                          animation: 'shimmer 1.5s infinite',
                        }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{
                    padding: 48, textAlign: 'center',
                    fontSize: 13, color: '#546e7a',
                  }}>
                    No se encontraron empleados con los criterios indicados
                  </td>
                </tr>
              ) : employees.map(emp => (
                <tr key={emp.id}
                  style={{ borderTop: '1px solid #f0f0f0' }}
                  onMouseEnter={e =>
                    (e.currentTarget as HTMLElement)
                      .style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={e =>
                    (e.currentTarget as HTMLElement)
                      .style.backgroundColor = 'transparent'}
                >
                  <td style={{
                    ...td,
                    fontFamily: 'monospace', color: '#1a1d29',
                    fontWeight: 500,
                  }}>
                    {emp.internalId}
                  </td>
                  <td style={{
                    ...td, fontWeight: 500, color: '#1a1d29',
                  }}>
                    {emp.firstName} {emp.lastName}
                  </td>
                  <td style={td}>{emp.departmentName}</td>
                  <td style={td}>{emp.email ?? '—'}</td>
                  <td style={{ padding: '11px 14px' }}>
                    <button
                      onClick={() => handleToggleAccess(emp)}
                      style={{
                        display: 'flex', alignItems: 'center',
                        gap: 5, background: 'none',
                        border: 'none', cursor: 'pointer', padding: 0,
                      }}>
                      {emp.hasAccess ? (
                        <>
                          <ToggleRight size={20} color="#2e7d32" />
                          <span style={{
                            fontSize: 11, color: '#2e7d32',
                          }}>
                            Habilitado
                          </span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft size={20} color="#546e7a" />
                          <span style={{
                            fontSize: 11, color: '#546e7a',
                          }}>
                            Denegado
                          </span>
                        </>
                      )}
                    </button>
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center',
                      gap: 4, padding: '2px 8px', borderRadius: 20,
                      fontSize: 11, fontWeight: 600,
                      backgroundColor: emp.isInside
                        ? '#e8f5e9' : '#f5f5f5',
                      color: emp.isInside ? '#2e7d32' : '#546e7a',
                    }}>
                      <span style={{
                        width: 5, height: 5, borderRadius: '50%',
                        backgroundColor: emp.isInside
                          ? '#2e7d32' : '#546e7a',
                        animation: emp.isInside
                          ? 'pulse 2s infinite' : 'none',
                      }} />
                      {emp.isInside ? 'En sala' : 'Fuera'}
                    </span>
                  </td>
                  <td style={{ ...td, fontSize: 11 }}>
                    {formatDate(emp.createdAt)}
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    <button
                      onClick={() => {
                        setEditing(emp); setShowForm(true)
                      }}
                      style={{
                        padding: 6, background: 'none',
                        border: 'none', cursor: 'pointer',
                        color: '#546e7a', borderRadius: 6,
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement)
                          .style.backgroundColor = '#e3f2fd'
                        ;(e.currentTarget as HTMLElement)
                          .style.color = '#1976d2'
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement)
                          .style.backgroundColor = 'transparent'
                        ;(e.currentTarget as HTMLElement)
                          .style.color = '#546e7a'
                      }}>
                      <Edit size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div style={{
            padding: '12px 16px',
            borderTop: '1px solid #e0e0e0',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: 12, color: '#546e7a' }}>
              Página {page + 1} de {totalPages}
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                style={{
                  padding: '6px 12px', fontSize: 12,
                  border: '1px solid #e0e0e0', borderRadius: 6,
                  cursor: page === 0 ? 'not-allowed' : 'pointer',
                  opacity: page === 0 ? 0.4 : 1,
                  backgroundColor: 'white',
                }}>
                Anterior
              </button>
              <button
                onClick={() =>
                  setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                style={{
                  padding: '6px 12px', fontSize: 12,
                  border: '1px solid #e0e0e0', borderRadius: 6,
                  cursor: page >= totalPages - 1
                    ? 'not-allowed' : 'pointer',
                  opacity: page >= totalPages - 1 ? 0.4 : 1,
                  backgroundColor: 'white',
                }}>
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal formulario empleado */}
      {showForm && (
        <EmployeeFormModal
          employee={editing}
          departments={departments}
          fixedDepartmentId={fixedDeptId}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); loadEmployees() }}
        />
      )}

      {/* Modal importar CSV */}
      {showImport && (
        <ImportCsvModal
          departments={departments}
          fixedDepartmentId={fixedDeptId}
          onClose={() => setShowImport(false)}
          onImported={() => {
            loadEmployees()
          }}
        />
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg) }
        }
        @keyframes pulse {
          0%,100% { opacity:1 } 50% { opacity:0.4 }
        }
        @keyframes shimmer {
          0%,100% { opacity:1 } 50% { opacity:0.4 }
        }
      `}</style>
    </div>
  )
}

// ─── Modal formulario empleado ────────────────────────────────
function EmployeeFormModal({
  employee,
  departments,
  fixedDepartmentId,
  onClose,
  onSaved,
}: {
  employee: Employee | null
  departments: Department[]
  fixedDepartmentId: number | null
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState({
    internalId:   employee?.internalId   ?? '',
    firstName:    employee?.firstName    ?? '',
    lastName:     employee?.lastName     ?? '',
    email:        employee?.email        ?? '',
    departmentId: employee?.departmentId
      ?? fixedDepartmentId
      ?? (departments[0]?.id ?? 0),
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (employee) {
        await employeesApi.update(employee.id, form)
        toast.success('Empleado actualizado')
      } else {
        await employeesApi.create(form)
        toast.success('Empleado registrado')
      }
      onSaved()
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ?? 'Error al guardar empleado'
      )
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px',
    border: '1px solid #e0e0e0', borderRadius: 8,
    fontSize: 13, outline: 'none', boxSizing: 'border-box',
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 1000, padding: 16,
    }}
    onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        backgroundColor: 'white', borderRadius: 16,
        width: '100%', maxWidth: 440,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{
            fontSize: 15, fontWeight: 600, color: '#1a1d29',
          }}>
            {employee ? 'Editar Empleado' : 'Registrar Nuevo Empleado'}
          </span>
          <button onClick={onClose} style={{
            background: 'none', border: 'none',
            cursor: 'pointer', color: '#546e7a',
          }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 20 }}>
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 14,
          }}>
            <div>
              <label style={{
                display: 'block', fontSize: 13,
                fontWeight: 500, color: '#1a1d29', marginBottom: 5,
              }}>
                ID Interno
              </label>
              <input
                type="text" value={form.internalId}
                onChange={e => setForm(f => ({
                  ...f, internalId: e.target.value }))}
                placeholder="EMP-XXXX" required style={inputStyle} />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr', gap: 12,
            }}>
              <div>
                <label style={{
                  display: 'block', fontSize: 13,
                  fontWeight: 500, color: '#1a1d29', marginBottom: 5,
                }}>
                  Nombre
                </label>
                <input
                  type="text" value={form.firstName}
                  onChange={e => setForm(f => ({
                    ...f, firstName: e.target.value }))}
                  required style={inputStyle} />
              </div>
              <div>
                <label style={{
                  display: 'block', fontSize: 13,
                  fontWeight: 500, color: '#1a1d29', marginBottom: 5,
                }}>
                  Apellido
                </label>
                <input
                  type="text" value={form.lastName}
                  onChange={e => setForm(f => ({
                    ...f, lastName: e.target.value }))}
                  required style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={{
                display: 'block', fontSize: 13,
                fontWeight: 500, color: '#1a1d29', marginBottom: 5,
              }}>
                Email
              </label>
              <input
                type="email" value={form.email}
                onChange={e => setForm(f => ({
                  ...f, email: e.target.value }))}
                placeholder="correo@laboratorio.com"
                style={inputStyle} />
            </div>

            <div>
              <label style={{
                display: 'block', fontSize: 13,
                fontWeight: 500, color: '#1a1d29', marginBottom: 5,
              }}>
                Departamento
              </label>
              {fixedDepartmentId ? (
                <div style={{
                  ...inputStyle,
                  backgroundColor: '#f8f9fa',
                  color: '#546e7a',
                }}>
                  {departments.find(
                    d => d.id === fixedDepartmentId)?.name
                    ?? 'Tu departamento'}
                </div>
              ) : (
                <select
                  value={form.departmentId}
                  onChange={e => setForm(f => ({
                    ...f, departmentId: Number(e.target.value) }))}
                  required style={inputStyle}>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button type="button" onClick={onClose} style={{
              flex: 1, padding: '9px',
              border: '1px solid #e0e0e0', borderRadius: 8,
              fontSize: 13, color: '#546e7a',
              cursor: 'pointer', backgroundColor: 'white',
            }}>
              Cancelar
            </button>
            <button type="submit" disabled={loading} style={{
              flex: 1, padding: '9px',
              backgroundColor: '#0d47a1', border: 'none',
              borderRadius: 8, fontSize: 13,
              color: 'white', cursor: 'pointer',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 6,
            }}>
              {loading && (
                <div style={{
                  width: 14, height: 14,
                  border: '2px solid white',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }} />
              )}
              {employee ? 'Guardar cambios' : 'Registrar empleado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}