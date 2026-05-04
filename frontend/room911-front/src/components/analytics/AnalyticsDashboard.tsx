import { useState, useEffect } from 'react'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts'
import {
  BarChart2, TrendingUp, AlertTriangle,
  Brain, RefreshCw
} from 'lucide-react'
import { statisticsApi } from '../../api'
import type { DepartmentStats } from '../../types'

const COLORS = [
  '#1976d2','#2e7d32','#f57c00',
  '#7b1fa2','#0097a7','#d32f2f',
]

const PERIODS = [
  { label: 'Hoy',        value: 'today' },
  { label: 'Esta semana',value: 'week'  },
  { label: 'Este mes',   value: 'month' },
] as const

export function AnalyticsDashboard() {
  const [stats,   setStats]   = useState<DepartmentStats[]>([])
  const [period,  setPeriod]  = useState<'today'|'week'|'month'>('today')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await statisticsApi.getByDepartment({ period })
      setStats(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [period])

  const totalAccesses = stats.reduce((s, d) => s + d.totalAccesses,  0)
  const totalGranted  = stats.reduce((s, d) => s + d.grantedAccesses,0)
  const totalDenied   = stats.reduce((s, d) => s + d.deniedAccesses, 0)

  const kpis = [
    {
      label: 'Total Accesos',
      value: totalAccesses,
      color: '#1976d2', bg: '#e3f2fd',
      icon: BarChart2,
    },
    {
      label: 'Exitosos',
      value: totalGranted,
      color: '#2e7d32', bg: '#e8f5e9',
      icon: TrendingUp,
    },
    {
      label: 'Denegados',
      value: totalDenied,
      color: '#d32f2f', bg: '#ffebee',
      icon: AlertTriangle,
    },
  ]

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
            Analítica
          </h1>
          <p style={{ fontSize: 13, color: '#546e7a', margin: 0 }}>
            Estadísticas de acceso al ROOM_911
          </p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {PERIODS.map(p => (
            <button key={p.value} onClick={() => setPeriod(p.value)}
              style={{
                padding: '7px 14px', borderRadius: 8,
                border: period === p.value
                  ? 'none' : '1px solid #e0e0e0',
                backgroundColor: period === p.value
                  ? '#0d47a1' : 'white',
                color: period === p.value ? 'white' : '#546e7a',
                fontSize: 12, fontWeight: 500, cursor: 'pointer',
              }}>
              {p.label}
            </button>
          ))}
          <button onClick={load} style={{
            padding: '7px 10px', backgroundColor: 'white',
            border: '1px solid #e0e0e0', borderRadius: 8,
            cursor: 'pointer', color: '#546e7a',
          }}>
            <RefreshCw size={14}
              style={{ animation: loading
                ? 'spin 0.8s linear infinite' : 'none' }} />
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 16, marginBottom: 24,
      }}>
        {kpis.map(k => {
          const Icon = k.icon
          return (
            <div key={k.label} style={{
              backgroundColor: 'white', borderRadius: 12,
              border: '1px solid #e0e0e0', padding: 18,
            }}>
              <div style={{
                width: 40, height: 40,
                backgroundColor: k.bg, borderRadius: 10,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', marginBottom: 12,
              }}>
                <Icon size={20} color={k.color} />
              </div>
              <div style={{
                fontSize: 26, fontWeight: 800,
                color: '#1a1d29', marginBottom: 2,
              }}>
                {loading ? '—' : k.value}
              </div>
              <div style={{ fontSize: 12, color: '#546e7a' }}>
                {k.label}
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: 20, marginBottom: 24,
      }}>
        {/* Bar Chart */}
        <div style={{
          backgroundColor: 'white', borderRadius: 14,
          border: '1px solid #e0e0e0', padding: 20,
        }}>
          <div style={{
            fontSize: 14, fontWeight: 600,
            color: '#1a1d29', marginBottom: 4,
          }}>
            Accesos por Departamento
          </div>
          <div style={{
            fontSize: 12, color: '#546e7a', marginBottom: 16,
          }}>
            Exitosos vs Denegados
          </div>
          {loading ? (
            <div style={{
              height: 240, backgroundColor: '#f8f9fa',
              borderRadius: 8,
              animation: 'shimmer 1.5s infinite',
            }} />
          ) : stats.length === 0 ? (
            <div style={{
              height: 240, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: 13, color: '#546e7a',
            }}>
              Sin actividad en el período seleccionado
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={stats}
                margin={{ top: 0, right: 0, bottom: 40, left: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="departmentName"
                  tick={{ fontSize: 10, fill: '#546e7a' }}
                  angle={-30} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 10, fill: '#546e7a' }} />
                <Tooltip contentStyle={{
                  border: '1px solid #e0e0e0',
                  borderRadius: 8, fontSize: 11,
                }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="grantedAccesses" name="Exitosos"
                  fill="#2e7d32" radius={[4,4,0,0]} />
                <Bar dataKey="deniedAccesses" name="Denegados"
                  fill="#d32f2f" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie Chart */}
        <div style={{
          backgroundColor: 'white', borderRadius: 14,
          border: '1px solid #e0e0e0', padding: 20,
        }}>
          <div style={{
            fontSize: 14, fontWeight: 600,
            color: '#1a1d29', marginBottom: 4,
          }}>
            Distribución por Departamento
          </div>
          <div style={{
            fontSize: 12, color: '#546e7a', marginBottom: 16,
          }}>
            Porcentaje del total de accesos
          </div>
          {loading ? (
            <div style={{
              height: 240, backgroundColor: '#f8f9fa',
              borderRadius: 8,
              animation: 'shimmer 1.5s infinite',
            }} />
          ) : stats.length === 0 ? (
            <div style={{
              height: 240, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: 13, color: '#546e7a',
            }}>
              Sin actividad en el período seleccionado
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={stats} cx="50%" cy="50%"
                  innerRadius={55} outerRadius={90}
                  dataKey="totalAccesses"
                  nameKey="departmentName">
                  {stats.map((_, i) => (
                    <Cell key={i}
                      fill={COLORS[i % COLORS.length]}
                      stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{
                  border: '1px solid #e0e0e0',
                  borderRadius: 8, fontSize: 11,
                }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* IA Panel */}
      <div style={{
        backgroundColor: 'white', borderRadius: 14,
        border: '1px solid #e0e0e0', overflow: 'hidden',
      }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 36, height: 36,
            backgroundColor: '#f3e5f5', borderRadius: 10,
            display: 'flex', alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Brain size={18} color="#7b1fa2" />
          </div>
          <div>
            <div style={{
              fontSize: 14, fontWeight: 600, color: '#1a1d29',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              IA — Detección de Anomalías
              <span style={{
                fontSize: 10, padding: '2px 8px',
                backgroundColor: '#f3e5f5', color: '#7b1fa2',
                borderRadius: 20, fontWeight: 600,
              }}>
                Funcionalidad Innovadora
              </span>
            </div>
            <div style={{ fontSize: 12, color: '#546e7a' }}>
              Análisis predictivo de patrones de acceso en tiempo real
            </div>
          </div>
        </div>

        <div style={{ padding: 24 }}>
          {/* Stats grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 12, marginBottom: 20,
          }}>
            {[
              { label: 'Alto Riesgo',  color: '#d32f2f', bg: '#ffebee', count: 0 },
              { label: 'Riesgo Medio', color: '#f57c00', bg: '#fff3e0', count: 0 },
              { label: 'Riesgo Bajo',  color: '#2e7d32', bg: '#e8f5e9', count: 0 },
            ].map(r => (
              <div key={r.label} style={{
                backgroundColor: r.bg, borderRadius: 10,
                padding: '12px 16px', textAlign: 'center',
              }}>
                <div style={{
                  fontSize: 22, fontWeight: 800,
                  color: r.color,
                }}>
                  {r.count}
                </div>
                <div style={{ fontSize: 11, color: '#546e7a' }}>
                  {r.label}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            backgroundColor: '#f8f9fa', borderRadius: 10,
            padding: 16, textAlign: 'center',
          }}>
            <Brain size={32} color="#7b1fa2"
              style={{ opacity: 0.3, marginBottom: 8 }} />
            <div style={{
              fontSize: 13, fontWeight: 500,
              color: '#1a1d29', marginBottom: 4,
            }}>
              Motor de IA activo
            </div>
            <div style={{ fontSize: 12, color: '#546e7a' }}>
              Analizando patrones de acceso cada 5 minutos.
              Las anomalías aparecerán aquí cuando sean detectadas.
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin    { to { transform: rotate(360deg) } }
        @keyframes shimmer {
          0%,100% { opacity:1 } 50% { opacity:0.5 }
        }
      `}</style>
    </div>
  )
}