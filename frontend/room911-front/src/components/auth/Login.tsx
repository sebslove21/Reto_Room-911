import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, User, Shield, Eye, EyeOff, AlertCircle, Scan } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '../../context/AuthContext'
import { authApi } from '../../api/auth.api'

export function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [email,    setEmail]   = useState('')
  const [password, setPassword]= useState('')
  const [showPwd,  setShowPwd] = useState(false)
  const [loading,  setLoading] = useState(false)
  const [error,    setError]   = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    setError('')
    setLoading(true)
    try {
      const { data } = await authApi.login({ email, password })
      login(data)
      toast.success(`Bienvenido, ${data.firstName}`)
      navigate('/dashboard')
    } catch (err: any) {
      setError(
        err.response?.status === 401
          ? 'Credenciales inválidas'
          : err.response?.data?.message
            ?? 'Error al conectar con el servidor'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0d47a1 0%, #1976d2 100%)',
      padding: 16,
      position: 'relative',
    }}>
      {/* Patrón de fondo */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.05,
        backgroundImage:
          'radial-gradient(circle at 25% 25%, #fff 1px, transparent 1px),' +
          'radial-gradient(circle at 75% 75%, #fff 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Botón Scanner — esquina superior derecha */}
      <button
        onClick={() => navigate('/scanner')}
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 18px',
          backgroundColor: '#2e7d32',
          color: 'white',
          border: 'none',
          borderRadius: 10,
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(46,125,50,0.4)',
          zIndex: 100,
          transition: 'transform 0.15s, box-shadow 0.15s',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
          ;(e.currentTarget as HTMLElement).style.boxShadow =
            '0 6px 20px rgba(46,125,50,0.5)'
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
          ;(e.currentTarget as HTMLElement).style.boxShadow =
            '0 4px 16px rgba(46,125,50,0.4)'
        }}
      >
        <Scan size={16} />
        Acceso ROOM_911
      </button>

      {/* Card login */}
      <div style={{
        width: '100%',
        maxWidth: 420,
        backgroundColor: 'white',
        borderRadius: 20,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        padding: 40,
        position: 'relative',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 72, height: 72,
            backgroundColor: '#0d47a1',
            borderRadius: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(13,71,161,0.4)',
          }}>
            <Shield size={40} color="white" />
          </div>
          <h1 style={{
            fontSize: 24, fontWeight: 700,
            color: '#1a1d29', margin: '0 0 4px',
          }}>
            ROOM_911
          </h1>
          <p style={{ fontSize: 13, color: '#546e7a', margin: 0 }}>
            Sistema de Control de Acceso<br />Laboratorios XYZ
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 14px', marginBottom: 16,
            backgroundColor: '#ffebee',
            border: '1px solid #ffcdd2',
            borderRadius: 8,
          }}>
            <AlertCircle size={16} color="#d32f2f" />
            <span style={{ fontSize: 13, color: '#d32f2f' }}>
              {error}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block', fontSize: 13,
              fontWeight: 500, color: '#1a1d29', marginBottom: 6,
            }}>
              Correo electrónico
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="#546e7a" style={{
                position: 'absolute', left: 12,
                top: '50%', transform: 'translateY(-50%)',
              }} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@laboratoriosxyz.com"
                required
                autoComplete="email"
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  border: '1px solid #e0e0e0',
                  borderRadius: 8, fontSize: 13,
                  outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={e =>
                  (e.target as HTMLElement).style.borderColor = '#1976d2'}
                onBlur={e =>
                  (e.target as HTMLElement).style.borderColor = '#e0e0e0'}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: 'block', fontSize: 13,
              fontWeight: 500, color: '#1a1d29', marginBottom: 6,
            }}>
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#546e7a" style={{
                position: 'absolute', left: 12,
                top: '50%', transform: 'translateY(-50%)',
              }} />
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                style={{
                  width: '100%',
                  padding: '10px 38px 10px 38px',
                  border: '1px solid #e0e0e0',
                  borderRadius: 8, fontSize: 13,
                  outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={e =>
                  (e.target as HTMLElement).style.borderColor = '#1976d2'}
                onBlur={e =>
                  (e.target as HTMLElement).style.borderColor = '#e0e0e0'}
              />
              <button
                type="button"
                onClick={() => setShowPwd(v => !v)}
                style={{
                  position: 'absolute', right: 12,
                  top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none',
                  cursor: 'pointer', color: '#546e7a', padding: 0,
                }}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Botón login */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '11px',
              backgroundColor: loading ? '#90caf9' : '#0d47a1',
              color: 'white', border: 'none', borderRadius: 8,
              fontSize: 14, fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 8,
              transition: 'background-color 0.15s',
              marginBottom: 12,
            }}>
            {loading && (
              <div style={{
                width: 16, height: 16,
                border: '2px solid white',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
            )}
            {loading ? 'Verificando...' : 'Iniciar Sesión'}
          </button>

          {/* Olvidé contraseña */}
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <button
              type="button"
              onClick={() => navigate('/recovery')}
              style={{
                background: 'none', border: 'none',
                color: '#1976d2', fontSize: 13,
                cursor: 'pointer', textDecoration: 'underline',
              }}>
              ¿Olvidó su contraseña?
            </button>
          </div>

          {/* Separador */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            marginBottom: 16,
          }}>
            <div style={{
              flex: 1, height: 1, backgroundColor: '#e0e0e0',
            }} />
            <span style={{ fontSize: 11, color: '#546e7a' }}>
              o
            </span>
            <div style={{
              flex: 1, height: 1, backgroundColor: '#e0e0e0',
            }} />
          </div>

          {/* Botón Scanner secundario dentro del card */}
          <button
            type="button"
            onClick={() => navigate('/scanner')}
            style={{
              width: '100%', padding: '10px',
              backgroundColor: 'transparent',
              color: '#2e7d32',
              border: '2px solid #2e7d32',
              borderRadius: 8, fontSize: 13,
              fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 8,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement)
                .style.backgroundColor = '#2e7d32'
              ;(e.currentTarget as HTMLElement)
                .style.color = 'white'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement)
                .style.backgroundColor = 'transparent'
              ;(e.currentTarget as HTMLElement)
                .style.color = '#2e7d32'
            }}>
            <Scan size={15} />
            Abrir Scanner ROOM_911
          </button>
        </form>

        {/* Footer */}
        <div style={{
          marginTop: 24, paddingTop: 20,
          borderTop: '1px solid #e0e0e0',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: 11, color: '#546e7a', margin: 0 }}>
            Sistema de Control de Acceso v1.0<br />
            Medicamentos de Alto Costo · Área de Producción
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}