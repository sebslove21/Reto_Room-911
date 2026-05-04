import { useState, useEffect } from 'react'
import {
  Users, UserCheck, UserX, Activity,
  TrendingUp, AlertCircle, Building2,
  Crown, RefreshCw
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { statisticsApi } from '../../api'
import { logsApi } from '../../api'
import { formatTime, getAccessResultLabel } from '../../utils/formatters'
import type { DashboardSummary, AccessLog } from '../../types'

export function Dashboard() {
  const { user } = useAuth()
  const [summary,    setSummary]    = useState<DashboardSummary | null>(null)
  const [recentLogs, setRecentLogs] = useState<AccessLog[]>([])
  const [loading,    setLoading]    = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const [sRes, lRes] = await Promise.all([
        statisticsApi.getSummary(),
        logsApi.getAll({ page: 0, size: 8 }),
      ])
      setSummary(sRes.data)
      setRecentLogs(lRes.data.content)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const occupancyPct = summary
    ? Math.round((summary.currentOccupancy / summary.maxCapacity) * 100)
    : 0

  const stats = [
    {
      label: 'Empleados Totales',
      value: summary?.totalEmployees ?? '—',
      icon: Users,
      color: '#1976d2',
      bg: '#e3f2fd',
      sub: 'Total registrados',
    },
    {
      label: 'Accesos Hoy',
      value: summary?.accessesToday ?? '—',
      icon: UserCheck,
      color: '#2e7d32',
      bg: '#e8f5e9',
      sub: 'Entradas exitosas',
    },
    {
      label: 'En Sala Ahora',
      value: summary?.currentOccupancy ?? '—',
      icon: Activity,
      color: '#f57c00',
      bg: '#fff3e0',
      sub: `Máx: ${summary?.maxCapacity ?? '—'} (${occupancyPct}%)`,
    },
    {
      label: 'Denegados Hoy',
      value: summary?.deniedToday ?? '—',
      icon: UserX,
      color: '#d32f2f',
      bg: '#ffebee',
      sub: 'Últimas 24h',
    },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between', marginBottom: 24,
      }}>
        <div>
          <h1 style={{
            fontSize: 22, fontWeight: 700,
            color: '#1a1d29', margin: '0 0 4px',
          }}>Dashboard</h1>
          <p style={{ fontSize: 13, color: '#546e7a', margin: 0 }}>
            Resumen general del sistema ROOM_911
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {user?.role === 'ROLE_SUPER_ADMIN' && (
            <div style={{
              backgroundColor: '#fff3e0',
              border: '1px solid #ffe0b2',
              borderRadius: 10, padding: '8px 14px',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center',
                gap: 6, fontSize: 11, color: '#f57c00', marginBottom: 2,
              }}>
                <Crown size={12} />
                <span>Control Total</span>
              </div>
              <div style={{
                fontSize: 13, fontWeight: 600, color: '#1a1d29',
              }}>
                Super Administrador
              </div>
            </div>
          )}
          {user?.role === 'ROLE_ADMIN' && user.departmentName && (
            <div style={{
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: 10, padding: '8px 14px',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center',
                gap: 6, fontSize: 11, color: '#546e7a', marginBottom: 2,
              }}>
                <Building2 size={12} />
                <span>Departamento</span>
              </div>
              <div style={{
                fontSize: 13, fontWeight: 600, color: '#1a1d29',
              }}>
                {user.departmentName}
              </div>
            </div>
          )}
          <button onClick={load} disabled={loading} style={{
            padding: 10, backgroundColor: 'white',
            border: '1px solid #e0e0e0', borderRadius: 8,
            cursor: 'pointer', color: '#546e7a',
          }}>
            <RefreshCw size={16}
              style={{ animation: loading
                ? 'spin 0.8s linear infinite' : 'none' }} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 20, marginBottom: 24,
      }}>
        {stats.map(s => {
          const Icon = s.icon
          return (
            <div key={s.label} style={{
              backgroundColor: 'white', borderRadius: 14,
              border: '1px solid #e0e0e0', padding: 20,
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            }}>
              <div style={{ marginBottom: 14 }}>
                <div style={{
                  width: 44, height: 44, backgroundColor: s.bg,
                  borderRadius: 12, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={22} color={s.color} />
                </div>
              </div>
              <div style={{
                fontSize: 28, fontWeight: 800,
                color: '#1a1d29', marginBottom: 2,
              }}>
                {loading ? '—' : s.value}
              </div>
              <div style={{
                fontSize: 13, color: '#546e7a', marginBottom: 6,
              }}>
                {s.label}
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 4,
                fontSize: 11, color: '#546e7a',
              }}>
                <TrendingUp size={11} />
                {s.sub}
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent logs */}
      <div style={{
        backgroundColor: 'white', borderRadius: 14,
        border: '1px solid #e0e0e0',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        marginBottom: 24, overflow: 'hidden',
      }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #f0f0f0',
        }}>
          <div style={{
            fontSize: 15, fontWeight: 600, color: '#1a1d29',
          }}>
            Accesos Recientes
          </div>
          <div style={{ fontSize: 12, color: '#546e7a' }}>
            Últimos intentos de acceso al ROOM_911
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                {['ID', 'Empleado', 'Departamento', 'Hora', 'Estado'].map(h => (
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
                <tr>
                  <td colSpan={5} style={{
                    padding: 32, textAlign: 'center',
                    fontSize: 13, color: '#546e7a',
                  }}>
                    Cargando...
                  </td>
                </tr>
              ) : recentLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{
                    padding: 32, textAlign: 'center',
                    fontSize: 13, color: '#546e7a',
                  }}>
                    Sin registros de acceso
                  </td>
                </tr>
              ) : recentLogs.map(log => {
                const { label, color } = getAccessResultLabel(log.result)
                return (
                  <tr key={log.id} style={{
                    borderTop: '1px solid #f0f0f0',
                  }}
                  onMouseEnter={e =>
                    (e.currentTarget as HTMLElement)
                      .style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={e =>
                    (e.currentTarget as HTMLElement)
                      .style.backgroundColor = 'transparent'}
                  >
                    <td style={{
                      padding: '12px 16px', fontSize: 12,
                      fontFamily: 'monospace', color: '#1a1d29',
                    }}>
                      {log.internalIdRaw}
                    </td>
                    <td style={{
                      padding: '12px 16px', fontSize: 13,
                      fontWeight: 500, color: '#1a1d29',
                    }}>
                      {log.employeeName ?? (
                        <span style={{
                          color: '#546e7a', fontStyle: 'italic',
                        }}>
                          No registrado
                        </span>
                      )}
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      fontSize: 13, color: '#546e7a',
                    }}>
                      {log.departmentName ?? '—'}
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      fontSize: 12, color: '#546e7a',
                    }}>
                      {formatTime(log.accessedAt)}
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
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Capacity alert */}
      {occupancyPct >= 60 && summary && (
        <div style={{
          padding: 16, borderRadius: 12,
          backgroundColor: occupancyPct >= 80
            ? '#ffebee' : '#fff3e0',
          border: `1px solid ${occupancyPct >= 80
            ? '#ffcdd2' : '#ffe0b2'}`,
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }}
            color={occupancyPct >= 80 ? '#d32f2f' : '#f57c00'} />
          <div>
            <div style={{
              fontSize: 13, fontWeight: 600, marginBottom: 2,
              color: occupancyPct >= 80 ? '#d32f2f' : '#f57c00',
            }}>
              {occupancyPct >= 80
                ? 'Alerta Crítica de Capacidad'
                : 'Alerta de Capacidad'}
            </div>
            <div style={{ fontSize: 13, color: '#1a1d29' }}>
              ROOM_911 al {occupancyPct}% de capacidad (
              {summary.currentOccupancy}/{summary.maxCapacity} personas).
              {occupancyPct >= 80
                ? ' Limitar nuevos ingresos inmediatamente.'
                : ' Monitorear aforo.'}
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}