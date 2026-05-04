import { useState, useRef } from 'react'
import {
  Scan, CheckCircle, XCircle,
  AlertCircle, User, Clock
} from 'lucide-react'
import { toast } from 'sonner'
import { accessApi } from '../../api'
import { formatDateTime, getAccessResultLabel } from '../../utils/formatters'
import type { AccessLog } from '../../types'

interface Props {
  standalone?: boolean
}

export function AccessScanner({ standalone }: Props) {
  const [internalId, setInternalId] = useState('')
  const [loading,    setLoading]    = useState(false)
  const [lastLog,    setLastLog]    = useState<AccessLog | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!internalId.trim()) return

    // Validar formato EMP-XXX
    const empRegex = /^EMP-\d{3}$/
    if (!empRegex.test(internalId.trim())) {
      toast.error('Formato inválido. Use EMP-XXX (ej: EMP-001)')
      return
    }

    setLoading(true)
    setLastLog(null)
    try {
      const { data } = await accessApi.validate(
        internalId.trim().toUpperCase())
      setLastLog(data)
      setInternalId('')
      inputRef.current?.focus()
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ?? 'Error al procesar acceso')
    } finally {
      setLoading(false)
    }
  }

  const isGranted    = lastLog?.result === 'GRANTED'
  const resultInfo   = lastLog
    ? getAccessResultLabel(lastLog.result) : null

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#0d1117',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: 16,
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 80, height: 80, borderRadius: 20,
            background: 'linear-gradient(135deg, #0d47a1, #1976d2)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 16px',
            boxShadow: '0 8px 32px rgba(13,71,161,0.4)',
          }}>
            <Scan size={44} color="white" />
          </div>
          <h1 style={{
            fontSize: 26, fontWeight: 800, color: 'white',
            margin: '0 0 4px',
          }}>
            ROOM_911
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
            Control de Acceso — Laboratorios XYZ
          </p>
        </div>

        {/* Scanner Card */}
        <div style={{
          backgroundColor: '#161b22',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16, padding: 24,
          marginBottom: 20,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            gap: 8, marginBottom: 16,
          }}>
            <div style={{
              width: 8, height: 8, backgroundColor: '#2e7d32',
              borderRadius: '50%',
              animation: 'pulse 2s ease-in-out infinite',
            }} />
            <span style={{
              fontSize: 11, color: 'rgba(255,255,255,0.5)',
              textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>
              Sistema Activo
            </span>
          </div>

          <form onSubmit={handleScan}>
            <label style={{
              display: 'block', fontSize: 13,
              color: 'rgba(255,255,255,0.7)',
              fontWeight: 500, marginBottom: 8,
            }}>
              ID Interno / Código de Carnet
            </label>
            <div style={{ position: 'relative', marginBottom: 16 }}>
              <User size={18} color="rgba(255,255,255,0.3)" style={{
                position: 'absolute', left: 12,
                top: '50%', transform: 'translateY(-50%)',
              }} />
              <input ref={inputRef}
                type="text" value={internalId}
                onChange={e =>
                  setInternalId(e.target.value.toUpperCase())}
                placeholder="EMP-XXXX"
                autoFocus autoComplete="off"
                disabled={loading}
                style={{
                  width: '100%', padding: '12px 12px 12px 42px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 10, color: 'white',
                  fontSize: 16, fontFamily: 'monospace',
                  letterSpacing: '0.1em', outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e =>
                  (e.target as HTMLElement).style.borderColor = '#1976d2'}
                onBlur={e =>
                  (e.target as HTMLElement)
                    .style.borderColor = 'rgba(255,255,255,0.15)'}
              />
            </div>

            <button type="submit"
              disabled={loading || !internalId.trim()}
              style={{
                width: '100%', padding: 12,
                backgroundColor: loading || !internalId.trim()
                  ? '#1565c0' : '#1976d2',
                color: 'white', border: 'none', borderRadius: 10,
                fontSize: 14, fontWeight: 600,
                cursor: loading || !internalId.trim()
                  ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 8,
                transition: 'background-color 0.15s',
                opacity: !internalId.trim() ? 0.6 : 1,
              }}>
              {loading ? (
                <>
                  <div style={{
                    width: 16, height: 16,
                    border: '2px solid white',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                  Procesando...
                </>
              ) : (
                <>
                  <Scan size={16} />
                  Validar Acceso
                </>
              )}
            </button>
          </form>
        </div>

        {/* Result */}
        {lastLog && resultInfo && (
          <div style={{
            borderRadius: 16, padding: 20,
            backgroundColor: `${resultInfo.color}15`,
            border: `1px solid ${resultInfo.color}40`,
            transition: 'all 0.3s',
          }}>
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 16,
            }}>
              <div style={{ flexShrink: 0 }}>
                {isGranted
                  ? <CheckCircle size={44} color="#2e7d32" />
                  : <XCircle    size={44} color="#d32f2f" />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 18, fontWeight: 800, marginBottom: 2,
                  color: resultInfo.color,
                }}>
                  {isGranted ? 'ACCESO CONCEDIDO' : 'ACCESO DENEGADO'}
                </div>
                <div style={{
                  fontSize: 12, color: 'rgba(255,255,255,0.5)',
                  marginBottom: 12,
                }}>
                  {resultInfo.label}
                </div>

                {lastLog.employeeName ? (
                  <div style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    borderRadius: 8, padding: 12,
                  }}>
                    <div style={{
                      display: 'flex', alignItems: 'center',
                      gap: 8, marginBottom: 4,
                    }}>
                      <User size={14} color="rgba(255,255,255,0.4)" />
                      <span style={{
                        fontSize: 14, fontWeight: 600, color: 'white',
                      }}>
                        {lastLog.employeeName}
                      </span>
                    </div>
                    {lastLog.departmentName && (
                      <div style={{
                        fontSize: 11, color: 'rgba(255,255,255,0.4)',
                        paddingLeft: 22, marginBottom: 4,
                      }}>
                        {lastLog.departmentName}
                      </div>
                    )}
                    <div style={{
                      display: 'flex', alignItems: 'center',
                      gap: 6, fontSize: 11,
                      color: 'rgba(255,255,255,0.4)',
                    }}>
                      <Clock size={11} />
                      {formatDateTime(lastLog.accessedAt)}
                    </div>
                  </div>
                ) : (
                  <div style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    borderRadius: 8, padding: 12,
                  }}>
                    <div style={{
                      display: 'flex', alignItems: 'center',
                      gap: 8, fontSize: 13,
                      color: 'rgba(255,255,255,0.5)',
                    }}>
                      <AlertCircle size={14} color="#f57c00" />
                      ID: {lastLog.internalIdRaw} — No registrado
                    </div>
                    <div style={{
                      display: 'flex', alignItems: 'center',
                      gap: 6, fontSize: 11,
                      color: 'rgba(255,255,255,0.3)',
                      marginTop: 4,
                    }}>
                      <Clock size={11} />
                      {formatDateTime(lastLog.accessedAt)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin  { to { transform: rotate(360deg) } }
        @keyframes pulse {
          0%,100% { opacity: 1 }
          50%      { opacity: 0.4 }
        }
      `}</style>
    </div>
  )
}