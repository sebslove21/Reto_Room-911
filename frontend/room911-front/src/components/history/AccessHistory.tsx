import { useState, useEffect } from 'react'
import {
  Search, Download, Calendar, ChevronDown
} from 'lucide-react'
import { toast } from 'sonner'
import { logsApi } from '../../api'
import { employeesApi } from '../../api/employees.api'
import {
  formatDateTime, getAccessResultLabel, downloadBlob
} from '../../utils/formatters'
import type { AccessLog, Employee } from '../../types'

export function AccessHistory() {
  const [logs,             setLogs]            = useState<AccessLog[]>([])
  const [employees,        setEmployees]        = useState<Employee[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<number | ''>('')
  const [startDate,        setStartDate]        = useState('')
  const [endDate,          setEndDate]          = useState('')
  const [page,             setPage]             = useState(0)
  const [totalPages,       setTotalPages]       = useState(0)
  const [totalElements,    setTotalElements]    = useState(0)
  const [loading,          setLoading]          = useState(true)
  const [exporting,        setExporting]        = useState(false)

  useEffect(() => {
    employeesApi.getAll({ size: 200 })
      .then(r => setEmployees(r.data.content))
      .catch(console.error)
  }, [])

  useEffect(() => { loadLogs() }, [selectedEmployee, startDate, endDate, page])

  const loadLogs = async () => {
    setLoading(true)
    try {
      const params = {
        startDate: startDate || undefined,
        endDate:   endDate   || undefined,
        page,
        size: 20,
      }
      const { data } = selectedEmployee
        ? await logsApi.getByEmployee(Number(selectedEmployee), params)
        : await logsApi.getAll(params)
      setLogs(data.content)
      setTotalPages(data.totalPages)
      setTotalElements(data.totalElements)
    } catch {
      toast.error('Error al cargar historial')
    } finally {
      setLoading(false)
    }
  }

  const handleExportPdf = async () => {
    if (!selectedEmployee) {
      toast.error('Selecciona un empleado para exportar')
      return
    }
    setExporting(true)
    try {
      const { data } = await logsApi.exportPdf(
        Number(selectedEmployee),
        startDate || undefined,
        endDate   || undefined,
      )
      const emp  = employees.find(e => e.id === Number(selectedEmployee))
      const name = emp
        ? `${emp.lastName}_${emp.firstName}` : `emp_${selectedEmployee}`
      const date = new Date().toISOString().slice(0, 10)
      downloadBlob(data, `historial_${name}_${date}.pdf`)
      toast.success('PDF exportado correctamente')
    } catch {
      toast.error('Error al generar el PDF')
    } finally {
      setExporting(false)
    }
  }

  const clearFilters = () => {
    setSelectedEmployee('')
    setStartDate('')
    setEndDate('')
    setPage(0)
  }

  const hasFilters = selectedEmployee || startDate || endDate

  const cell: React.CSSProperties = {
    padding: '12px 16px', fontSize: 13, color: '#546e7a',
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
            Historial de Accesos
          </h1>
          <p style={{ fontSize: 13, color: '#546e7a', margin: 0 }}>
            {totalElements} registros encontrados
          </p>
        </div>
        <button onClick={handleExportPdf}
          disabled={exporting || !selectedEmployee || logs.length === 0}
          title={!selectedEmployee
            ? 'Selecciona un empleado para exportar' : ''}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '9px 16px', backgroundColor: '#d32f2f',
            color: 'white', border: 'none', borderRadius: 8,
            fontSize: 13, fontWeight: 600,
            cursor: exporting || !selectedEmployee || logs.length === 0
              ? 'not-allowed' : 'pointer',
            opacity: !selectedEmployee || logs.length === 0 ? 0.5 : 1,
          }}>
          {exporting
            ? <div style={{
                width: 14, height: 14,
                border: '2px solid white',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
            : <Download size={14} />}
          Exportar PDF
        </button>
      </div>

      {/* Filters */}
      <div style={{
        backgroundColor: 'white', borderRadius: 12,
        border: '1px solid #e0e0e0', padding: 16,
        marginBottom: 20, display: 'flex',
        flexWrap: 'wrap', gap: 12, alignItems: 'center',
      }}>
        {/* Employee selector */}
        <div style={{ position: 'relative', flex: '1', minWidth: 220 }}>
          <Search size={15} color="#546e7a" style={{
            position: 'absolute', left: 10,
            top: '50%', transform: 'translateY(-50%)',
          }} />
          <ChevronDown size={14} color="#546e7a" style={{
            position: 'absolute', right: 10,
            top: '50%', transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }} />
          <select value={selectedEmployee}
            onChange={e => {
              setSelectedEmployee(
                e.target.value ? Number(e.target.value) : '')
              setPage(0)
            }}
            style={{
              width: '100%', padding: '9px 32px 9px 32px',
              border: '1px solid #e0e0e0', borderRadius: 8,
              fontSize: 13, outline: 'none',
              backgroundColor: 'white', appearance: 'none',
            }}>
            <option value="">Todos los empleados</option>
            {employees.map(e => (
              <option key={e.id} value={e.id}>
                {e.firstName} {e.lastName} · {e.internalId}
              </option>
            ))}
          </select>
        </div>

        {/* Date range */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Calendar size={15} color="#546e7a" />
          <input type="date" value={startDate}
            onChange={e => { setStartDate(e.target.value); setPage(0) }}
            style={{
              padding: '9px 10px', border: '1px solid #e0e0e0',
              borderRadius: 8, fontSize: 13, outline: 'none',
            }} />
          <span style={{ fontSize: 12, color: '#546e7a' }}>hasta</span>
          <input type="date" value={endDate} min={startDate}
            onChange={e => { setEndDate(e.target.value); setPage(0) }}
            style={{
              padding: '9px 10px', border: '1px solid #e0e0e0',
              borderRadius: 8, fontSize: 13, outline: 'none',
            }} />
        </div>

        {hasFilters && (
          <button onClick={clearFilters} style={{
            background: 'none', border: 'none',
            color: '#1976d2', fontSize: 13,
            cursor: 'pointer', whiteSpace: 'nowrap',
          }}>
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{
        backgroundColor: 'white', borderRadius: 12,
        border: '1px solid #e0e0e0', overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                {['ID Empleado','Nombre','Departamento',
                  'Fecha y Hora','Resultado','Notas'].map(h => (
                  <th key={h} style={{
                    padding: '10px 16px', textAlign: 'left',
                    fontSize: 11, fontWeight: 600,
                    color: '#546e7a', textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #f0f0f0' }}>
                    {[...Array(6)].map((_, j) => (
                      <td key={j} style={{ padding: '12px 16px' }}>
                        <div style={{
                          height: 14, backgroundColor: '#f0f0f0',
                          borderRadius: 4,
                          animation: 'shimmer 1.5s infinite',
                        }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{
                    padding: 48, textAlign: 'center',
                    fontSize: 13, color: '#546e7a',
                  }}>
                    {hasFilters
                      ? 'Sin registros en el período seleccionado'
                      : 'No se encontraron registros de acceso'}
                  </td>
                </tr>
              ) : logs.map(log => {
                const { label, color } = getAccessResultLabel(log.result)
                return (
                  <tr key={log.id} style={{ borderTop: '1px solid #f0f0f0' }}
                    onMouseEnter={e =>
                      (e.currentTarget as HTMLElement)
                        .style.backgroundColor = '#f8f9fa'}
                    onMouseLeave={e =>
                      (e.currentTarget as HTMLElement)
                        .style.backgroundColor = 'transparent'}
                  >
                    <td style={{
                      ...cell, fontFamily: 'monospace', color: '#1a1d29',
                    }}>
                      {log.internalIdRaw}
                    </td>
                    <td style={{
                      ...cell, fontWeight: 500, color: '#1a1d29',
                    }}>
                      {log.employeeName ?? (
                        <span style={{
                          color: '#546e7a', fontStyle: 'italic',
                        }}>
                          No registrado
                        </span>
                      )}
                    </td>
                    <td style={cell}>{log.departmentName ?? '—'}</td>
                    <td style={{ ...cell, whiteSpace: 'nowrap' }}>
                      {formatDateTime(log.accessedAt)}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center',
                        gap: 5, padding: '3px 10px',
                        backgroundColor: `${color}18`,
                        color, borderRadius: 20,
                        fontSize: 11, fontWeight: 600,
                      }}>
                        <span style={{
                          width: 6, height: 6,
                          backgroundColor: color, borderRadius: '50%',
                        }} />
                        {label}
                      </span>
                    </td>
                    <td style={cell}>{log.notes ?? '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            padding: '12px 16px',
            borderTop: '1px solid #e0e0e0',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: 12, color: '#546e7a' }}>
              Página {page + 1} de {totalPages} ·{' '}
              {totalElements} registros
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setPage(p => Math.max(0, p - 1))}
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
      <style>{`
        @keyframes spin    { to { transform: rotate(360deg) } }
        @keyframes shimmer {
          0%,100% { opacity:1 } 50% { opacity:0.4 }
        }
      `}</style>
    </div>
  )
}