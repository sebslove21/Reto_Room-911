import { useState, useEffect } from 'react'
import {
  Users, Clock, AlertTriangle,
  Wifi, WifiOff, RefreshCw
} from 'lucide-react'
import { accessApi } from '../../api'
import { useWebSocket } from '../../hooks/useWebSocket'
import { useTimer } from '../../hooks'
import { formatTime } from '../../utils/formatters'
import type { EmployeePresence, RoomStatus } from '../../types'

function PresenceCard({
  emp, maxMinutes,
}: { emp: EmployeePresence; maxMinutes: number }) {
  const elapsed = useTimer(emp.enteredAt)
  const pct = Math.min((emp.minutesInside / maxMinutes) * 100, 100)
  const colors = {
    normal:   { bg: '#2e7d32', border: '#2e7d32', text: '#2e7d32' },
    warning:  { bg: '#f57c00', border: '#f57c00', text: '#f57c00' },
    critical: { bg: '#d32f2f', border: '#d32f2f', text: '#d32f2f' },
  }[emp.status]

  return (
    <div style={{
      backgroundColor: 'white',
      border: `2px solid ${colors.border}`,
      borderRadius: 14, padding: 16,
      animation: emp.status === 'critical'
        ? 'cardPulse 1.5s ease-in-out infinite' : 'none',
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: '50%',
        backgroundColor: colors.bg, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        color: 'white', fontWeight: 700, fontSize: 16,
        margin: '0 auto 10px',
      }}>
        {emp.firstName[0]}{emp.lastName[0]}
      </div>

      <div style={{ textAlign: 'center', marginBottom: 10 }}>
        <div style={{
          fontSize: 13, fontWeight: 600, color: '#1a1d29',
        }}>
          {emp.firstName} {emp.lastName}
        </div>
        <div style={{ fontSize: 11, color: '#546e7a' }}>
          {emp.internalId}
        </div>
        <div style={{ fontSize: 11, color: '#546e7a' }}>
          {emp.departmentName}
        </div>
      </div>

      <div style={{
        fontSize: 22, fontWeight: 800, fontFamily: 'monospace',
        textAlign: 'center', color: colors.text, marginBottom: 8,
      }}>
        {elapsed}
      </div>

      <div style={{
        height: 4, backgroundColor: '#f0f0f0',
        borderRadius: 2, overflow: 'hidden', marginBottom: 4,
      }}>
        <div style={{
          height: '100%', borderRadius: 2,
          backgroundColor: colors.bg,
          width: `${pct}%`,
          transition: 'width 1s linear',
        }} />
      </div>

      {emp.status !== 'normal' && (
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 4,
          fontSize: 11, fontWeight: 600, color: colors.text,
          marginTop: 6,
        }}>
          <AlertTriangle size={12} />
          {emp.status === 'warning'
            ? 'Tiempo prolongado' : 'ALERTA CRÍTICA'}
        </div>
      )}

      <div style={{
        fontSize: 10, color: '#546e7a',
        textAlign: 'center', marginTop: 4,
      }}>
        Entró: {formatTime(emp.enteredAt)}
      </div>
    </div>
  )
}

export function AccessMonitor() {
  const [status,    setStatus]    = useState<RoomStatus | null>(null)
  const [connected, setConnected] = useState(false)
  const [loading,   setLoading]   = useState(true)

  const loadStatus = async () => {
    try {
      const { data } = await accessApi.getRoomStatus()
      setStatus(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadStatus() }, [])
  useEffect(() => {
    const id = setInterval(loadStatus, 30000)
    return () => clearInterval(id)
  }, [])

  useWebSocket({
    onCapacityUpdate: () => {
      setConnected(true)
      loadStatus()
    },
    onAlert: (event) => {
      console.warn('[Alert]', event)
    },
  })

  const currentOccupancy = status
    ? status.currentOccupancy ?? status.employeesInside.length
    : 0

  const occupancyPct = status && status.maxCapacity > 0
    ? Math.round((currentOccupancy / status.maxCapacity) * 100)
    : 0
  const barColor = occupancyPct >= 80 ? '#d32f2f'
    : occupancyPct >= 60 ? '#f57c00' : '#2e7d32'

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
            Monitor en Tiempo Real
          </h1>
          <p style={{ fontSize: 13, color: '#546e7a', margin: 0 }}>
            Personal dentro del ROOM_911
          </p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          {connected
            ? <>
                <div style={{
                  width: 8, height: 8, backgroundColor: '#2e7d32',
                  borderRadius: '50%',
                  animation: 'pulse 2s ease-in-out infinite',
                }} />
                <Wifi size={16} color="#2e7d32" />
                <span style={{ fontSize: 12, color: '#2e7d32' }}>
                  En vivo
                </span>
              </>
            : <>
                <WifiOff size={16} color="#546e7a" />
                <span style={{ fontSize: 12, color: '#546e7a' }}>
                  Actualizando...
                </span>
              </>
          }
          <button onClick={loadStatus} style={{
            marginLeft: 8, padding: 8,
            backgroundColor: 'white',
            border: '1px solid #e0e0e0', borderRadius: 8,
            cursor: 'pointer', color: '#546e7a',
          }}>
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Capacity bar */}
      {status && (
        <div style={{
          backgroundColor: 'white', borderRadius: 14,
          border: '1px solid #e0e0e0', padding: 20,
          marginBottom: 24,
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: 16,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 44, height: 44,
                backgroundColor: '#fff3e0', borderRadius: 12,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Users size={22} color="#f57c00" />
              </div>
              <div>
                <div style={{
                  fontSize: 12, color: '#546e7a', marginBottom: 2,
                }}>
                  Aforo Actual
                </div>
                <div style={{
                  fontSize: 24, fontWeight: 800, color: '#1a1d29',
                }}>
                  {currentOccupancy}
                  <span style={{
                    fontSize: 14, color: '#546e7a', fontWeight: 400,
                  }}>
                    /{status.maxCapacity}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontSize: 30, fontWeight: 800, color: barColor,
              }}>
                {occupancyPct}%
              </div>
              <div style={{ fontSize: 11, color: '#546e7a' }}>
                capacidad
              </div>
            </div>
          </div>

          <div style={{
            height: 10, backgroundColor: '#f0f0f0',
            borderRadius: 5, overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', borderRadius: 5,
              backgroundColor: barColor,
              width: `${occupancyPct}%`,
              transition: 'width 0.5s ease',
            }} />
          </div>

          <div style={{
            display: 'flex', justifyContent: 'space-between',
            marginTop: 8, fontSize: 11, color: '#546e7a',
          }}>
            <span>0 personas</span>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <Clock size={11} />
              Tiempo máx: {status.maxStayMinutes} min
            </div>
            <span>{status.maxCapacity} personas</span>
          </div>
        </div>
      )}

      {/* Presence grid */}
      {loading ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 16,
        }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{
              height: 200, backgroundColor: '#f8f9fa',
              borderRadius: 14, border: '1px solid #e0e0e0',
              animation: 'shimmer 1.5s ease-in-out infinite',
            }} />
          ))}
        </div>
      ) : !status || status.employeesInside.length === 0 ? (
        <div style={{
          backgroundColor: 'white', borderRadius: 14,
          border: '1px solid #e0e0e0', padding: 64,
          textAlign: 'center',
        }}>
          <div style={{
            width: 64, height: 64, backgroundColor: '#f8f9fa',
            borderRadius: '50%', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Users size={32} color="#546e7a" />
          </div>
          <div style={{
            fontSize: 16, fontWeight: 600,
            color: '#1a1d29', marginBottom: 6,
          }}>
            ROOM_911 Vacío
          </div>
          <div style={{ fontSize: 13, color: '#546e7a' }}>
            No hay personal dentro del área en este momento
          </div>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 16,
        }}>
          {status.employeesInside.map(emp => (
            <PresenceCard
              key={emp.id}
              emp={emp}
              maxMinutes={status.maxStayMinutes}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin    { to { transform: rotate(360deg) } }
        @keyframes pulse   {
          0%,100% { opacity:1 } 50% { opacity:0.4 }
        }
        @keyframes shimmer {
          0%,100% { opacity:1 } 50% { opacity:0.5 }
        }
        @keyframes cardPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(211,47,47,0.4) }
          50%      { box-shadow: 0 0 0 8px rgba(211,47,47,0) }
        }
      `}</style>
    </div>
  )
}