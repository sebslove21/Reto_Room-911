import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle, Shield } from 'lucide-react'
import { authApi } from '../../api/auth.api'

export function PasswordRecovery() {
  const navigate  = useNavigate()
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authApi.forgotPassword(email)
    } finally {
      setSent(true)
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0d47a1 0%, #1976d2 100%)',
      padding: 16,
    }}>
      <div style={{
        width: '100%', maxWidth: 420, backgroundColor: 'white',
        borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        padding: 40,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 60, height: 60, backgroundColor: '#0d47a1',
            borderRadius: 16, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px',
          }}>
            <Shield size={32} color="white" />
          </div>
          <h1 style={{
            fontSize: 20, fontWeight: 700, color: '#1a1d29', margin: '0 0 4px',
          }}>
            Recuperar Contraseña
          </h1>
          <p style={{ fontSize: 12, color: '#546e7a', margin: 0 }}>
            ROOM_911 · Laboratorios XYZ
          </p>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <CheckCircle size={60} color="#2e7d32"
              style={{ margin: '0 auto 16px', display: 'block' }} />
            <h2 style={{
              fontSize: 16, fontWeight: 600, color: '#1a1d29', marginBottom: 8,
            }}>
              Correo enviado
            </h2>
            <p style={{ fontSize: 13, color: '#546e7a', marginBottom: 8 }}>
              Si el correo está registrado, recibirás las instrucciones
              para restablecer tu contraseña.
            </p>
            <p style={{ fontSize: 11, color: '#546e7a', marginBottom: 24 }}>
              El enlace expira en 30 minutos.
            </p>
            <button onClick={() => navigate('/login')}
              style={{
                width: '100%', padding: '10px',
                backgroundColor: '#0d47a1', color: 'white',
                border: 'none', borderRadius: 8,
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}>
              Volver al inicio de sesión
            </button>
          </div>
        ) : (
          <>
            <p style={{
              fontSize: 13, color: '#546e7a',
              textAlign: 'center', marginBottom: 24,
            }}>
              Ingresa tu correo electrónico y te enviaremos un enlace
              para restablecer tu contraseña.
            </p>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 20 }}>
                <label style={{
                  display: 'block', fontSize: 13,
                  fontWeight: 500, color: '#1a1d29', marginBottom: 6,
                }}>
                  Correo electrónico
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#546e7a" style={{
                    position: 'absolute', left: 12,
                    top: '50%', transform: 'translateY(-50%)',
                  }} />
                  <input type="email" value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@laboratoriosxyz.com"
                    required
                    style={{
                      width: '100%', padding: '10px 12px 10px 38px',
                      border: '1px solid #e0e0e0', borderRadius: 8,
                      fontSize: 13, outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
              <button type="submit" disabled={loading}
                style={{
                  width: '100%', padding: '10px',
                  backgroundColor: '#0d47a1', color: 'white',
                  border: 'none', borderRadius: 8,
                  fontSize: 13, fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginBottom: 12,
                }}>
                {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
              </button>
              <button type="button" onClick={() => navigate('/login')}
                style={{
                  width: '100%', padding: '10px',
                  backgroundColor: 'transparent', color: '#546e7a',
                  border: 'none', fontSize: 13, cursor: 'pointer',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: 6,
                }}>
                <ArrowLeft size={14} />
                Volver al inicio de sesión
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}