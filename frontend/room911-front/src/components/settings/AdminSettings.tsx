import { useState, useEffect } from 'react'
import { User, Lock, Eye, EyeOff, Upload, CheckCircle, Mail, Users, Shield, Server } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '../../context/AuthContext'
import { profileApi, authApi } from '../../api'

export function AdminSettings() {
  const [tab, setTab] = useState<'profile' | 'password' | 'system'>('profile')

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{
          fontSize: 22, fontWeight: 700,
          color: '#1a1d29', margin: '0 0 4px',
        }}>
          Mi Cuenta
        </h1>
        <p style={{ fontSize: 13, color: '#546e7a', margin: 0 }}>
          Configuración personal y seguridad
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 4,
        backgroundColor: '#f8f9fa', borderRadius: 10,
        padding: 4, width: 'fit-content', marginBottom: 24,
      }}>
        {[
          { id: 'profile',  label: 'Perfil',      icon: User },
          { id: 'password', label: 'Contraseña',  icon: Lock },
          { id: 'system',   label: 'Sistema',     icon: Server },
        ].map(({ id, label, icon: Icon }) => (
          <button key={id}
            onClick={() => setTab(id as any)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '8px 16px', borderRadius: 8, border: 'none',
              cursor: 'pointer', fontSize: 13, fontWeight: 500,
              backgroundColor: tab === id ? 'white' : 'transparent',
              color: tab === id ? '#0d47a1' : '#546e7a',
              boxShadow: tab === id
                ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s',
            }}>
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {tab === 'profile'  && <ProfileTab />}
      {tab === 'password' && <PasswordTab />}
      {tab === 'system'   && <SystemTab />}
    </div>
  )
}

function ProfileTab() {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({
    firstName: '',
    lastName:  '',
    email:     '',
  })
  const [loading, setLoading] = useState(false)

  // Actualizar formulario cuando cambia user
  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName,
        lastName:  user.lastName,
        email:     user.email,
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email.trim())) {
      toast.error('Email inválido')
      return
    }

    setLoading(true)
    try {
      // Actualizar solo localmente sin llamar al backend por ahora
      updateUser(form)
      toast.success('Perfil actualizado correctamente')
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ?? 'Error al actualizar perfil')
    } finally {
      setLoading(false)
    }
  }

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast.error('La imagen no debe superar 2MB'); return
    }
    try {
      const { data } = await profileApi.uploadAvatar(file)
      updateUser({ avatarUrl: (data as any).avatarUrl })
      toast.success('Foto actualizada')
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Error al subir imagen')
    }
    e.target.value = ''
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px',
    border: '1px solid #e0e0e0', borderRadius: 8,
    fontSize: 13, outline: 'none', boxSizing: 'border-box',
  }

  return (
    <div style={{
      backgroundColor: 'white', borderRadius: 14,
      border: '1px solid #e0e0e0',
    }}>
      {/* Header Card - Avatar Section */}
      <div style={{
        padding: '24px', borderBottom: '1px solid #e0e0e0',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: 20,
        }}>
          {/* Avatar Circle */}
          <div style={{
            width: 100, height: 100, backgroundColor: '#0d47a1',
            borderRadius: '50%', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: 32, fontWeight: 700,
            flexShrink: 0, border: '4px solid white',
            boxShadow: '0 4px 12px rgba(13, 71, 161, 0.2)',
            overflow: 'hidden',
          }}>
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar"
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover',
                }} />
            ) : (
              `${user?.firstName?.[0]}${user?.lastName?.[0]}`
            )}
          </div>
          
          {/* User Info */}
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 18, fontWeight: 700,
              color: '#1a1d29', marginBottom: 4,
            }}>
              {user?.firstName} {user?.lastName}
            </div>
            <div style={{
              fontSize: 13, color: '#546e7a', marginBottom: 10,
            }}>
              {user?.email}
            </div>
            {user?.departmentName && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '5px 10px', backgroundColor: '#e3f2fd',
                borderRadius: 20, fontSize: 12, color: '#1976d2',
                fontWeight: 500,
              }}>
                <Users size={12} />
                {user.departmentName}
              </div>
            )}
          </div>
          
          {/* Upload Button */}
          <label style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 6, padding: '10px 16px', backgroundColor: '#0d47a1',
            border: 'none', borderRadius: 8,
            fontSize: 13, color: 'white', cursor: 'pointer',
            fontWeight: 500, transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.backgroundColor = '#0a3b8a'
            ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.backgroundColor = '#0d47a1'
            ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
          }}>
            <Upload size={14} /> Cambiar foto
            <input type="file" accept="image/jpeg,image/png"
              onChange={handleAvatar}
              style={{ display: 'none' }} />
          </label>
        </div>
        <div style={{
          fontSize: 11, color: '#546e7a', marginTop: 12,
        }}>
          JPG o PNG · Máx 2MB
        </div>
      </div>

      {/* Form Section */}
      <div style={{ padding: '24px' }}>
        <form onSubmit={handleSubmit}>
          {/* Name Grid */}
          <div style={{ marginBottom: 20 }}>
            <div style={{
              fontSize: 12, fontWeight: 600, color: '#1a1d29',
              textTransform: 'uppercase', letterSpacing: '0.05em',
              marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <User size={14} color="#0d47a1" />
              Información Personal
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 14,
            }}>
              <div>
                <label style={{
                  display: 'block', fontSize: 12,
                  fontWeight: 600, color: '#1a1d29', 
                  marginBottom: 7, textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Nombre
                </label>
                <input type="text" value={form.firstName}
                  onChange={e => {
                    const val = e.target.value.replace(/[^a-zA-ZáéíóúñÁÉÍÓÚÑ\s]/g, '')
                    setForm(f => ({ ...f, firstName: val }))
                  }}
                  required style={{
                    width: '100%', padding: '10px 12px',
                    border: '1px solid #e0e0e0', borderRadius: 8,
                    fontSize: 13, outline: 'none', boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = '#0d47a1'}
                  onBlur={e => e.currentTarget.style.borderColor = '#e0e0e0'}
                />
              </div>
              <div>
                <label style={{
                  display: 'block', fontSize: 12,
                  fontWeight: 600, color: '#1a1d29', 
                  marginBottom: 7, textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Apellido
                </label>
                <input type="text" value={form.lastName}
                  onChange={e => {
                    const val = e.target.value.replace(/[^a-zA-ZáéíóúñÁÉÍÓÚÑ\s]/g, '')
                    setForm(f => ({ ...f, lastName: val }))
                  }}
                  required style={{
                    width: '100%', padding: '10px 12px',
                    border: '1px solid #e0e0e0', borderRadius: 8,
                    fontSize: 13, outline: 'none', boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = '#0d47a1'}
                  onBlur={e => e.currentTarget.style.borderColor = '#e0e0e0'}
                />
              </div>
            </div>
          </div>

          {/* Email Section */}
          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 12, fontWeight: 600, color: '#1a1d29', 
              marginBottom: 7, textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              <Mail size={14} color="#0d47a1" />
              Correo Electrónico
            </label>
            <input type="email" value={form.email}
              onChange={e => setForm(f => ({
                ...f, email: e.target.value }))}
              required style={{
                width: '100%', padding: '10px 12px',
                border: '1px solid #e0e0e0', borderRadius: 8,
                fontSize: 13, outline: 'none', boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.currentTarget.style.borderColor = '#0d47a1'}
              onBlur={e => e.currentTarget.style.borderColor = '#e0e0e0'}
            />
          </div>

          {/* Department Info (Read-only) */}
          {user?.departmentName && (
            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontSize: 12, fontWeight: 600, color: '#1a1d29', 
                marginBottom: 7, textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                <Users size={14} color="#546e7a" />
                Departamento
              </label>
              <input type="text" value={user.departmentName}
                disabled style={{
                  width: '100%', padding: '10px 12px',
                  border: '1px solid #e0e0e0', borderRadius: 8,
                  fontSize: 13, backgroundColor: '#f8f9fa', 
                  color: '#546e7a', boxSizing: 'border-box',
                  cursor: 'not-allowed',
                }} />
              <div style={{
                fontSize: 11, color: '#546e7a', marginTop: 5,
              }}>
                No puede cambiar de departamento
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{
            display: 'flex', gap: 12, paddingTop: 16,
            borderTop: '1px solid #e0e0e0',
          }}>
            <button type="submit" disabled={loading} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 8, padding: '11px 24px', backgroundColor: '#0d47a1',
              border: 'none', borderRadius: 8, fontSize: 13,
              color: 'white', fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={e => {
              if (!loading) {
                (e.currentTarget as HTMLElement).style.backgroundColor = '#0a3b8a'
                ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
              }
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#0d47a1'
              ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
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
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
            {!loading && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '11px 16px', color: '#2e7d32',
                fontSize: 13, fontWeight: 500,
              }}>
                <CheckCircle size={16} />
                Cambios guardados
              </div>
            )}
          </div>
        </form>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

function PasswordTab() {
  const [form,    setForm]    = useState({
    current: '', next: '', confirm: '',
  })
  const [show,    setShow]    = useState({ current: false, next: false })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const strength = (pwd: string) => {
    let s = 0
    if (pwd.length >= 8)        s++
    if (/[A-Z]/.test(pwd))      s++
    if (/[0-9]/.test(pwd))      s++
    if (/[^A-Za-z0-9]/.test(pwd)) s++
    return s
  }

  const s = strength(form.next)
  const strengthColor = [
    '#f0f0f0','#d32f2f','#f57c00','#1976d2','#2e7d32',
  ][s]
  const strengthLabel = ['','Débil','Regular','Buena','Fuerte'][s]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.next !== form.confirm) {
      toast.error('Las contraseñas no coinciden'); return
    }
    if (s < 3) {
      toast.error('La contraseña no cumple los requisitos'); return
    }
    setLoading(true)
    try {
      await authApi.changePassword(form.current, form.next)
      setSuccess(true)
      toast.success('Contraseña actualizada. Inicia sesión nuevamente.')
      setTimeout(() => { window.location.href = '/login' }, 2000)
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ?? 'Error al cambiar contraseña')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={{
        backgroundColor: 'white', borderRadius: 14,
        border: '1px solid #e0e0e0', padding: 48,
        textAlign: 'center',
      }}>
        <CheckCircle size={56} color="#2e7d32"
          style={{ margin: '0 auto 16px', display: 'block' }} />
        <div style={{
          fontSize: 16, fontWeight: 600,
          color: '#1a1d29', marginBottom: 8,
        }}>
          Contraseña actualizada
        </div>
        <div style={{ fontSize: 13, color: '#546e7a' }}>
          Redirigiendo al inicio de sesión...
        </div>
      </div>
    )
  }

  return (
    <div style={{
      backgroundColor: 'white', borderRadius: 14,
      border: '1px solid #e0e0e0', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '24px', borderBottom: '1px solid #e0e0e0',
        background: 'linear-gradient(135deg, #fce4ec 0%, #fff1f5 100%)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 48, height: 48, backgroundColor: '#d32f2f',
            borderRadius: '50%', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: 'white',
          }}>
            <Lock size={24} />
          </div>
          <div>
            <div style={{
              fontSize: 16, fontWeight: 700,
              color: '#1a1d29',
            }}>
              Cambiar Contraseña
            </div>
            <div style={{ fontSize: 12, color: '#546e7a', marginTop: 2 }}>
              Actualiza tu contraseña regularmente para mayor seguridad
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: 24, maxWidth: 500 }}>
        {/* Requirements Card */}
        <div style={{
          backgroundColor: '#f3f4f6', borderRadius: 10,
          padding: 14, marginBottom: 24, border: '1px solid #e5e7eb',
        }}>
          <div style={{
            fontSize: 12, fontWeight: 600, color: '#1a1d29',
            marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <Shield size={14} color="#1976d2" />
            Requisitos de seguridad
          </div>
          <ul style={{
            margin: 0, paddingLeft: 24, fontSize: 12, color: '#546e7a',
          }}>
            <li style={{ marginBottom: 5 }}>Mínimo 8 caracteres</li>
            <li style={{ marginBottom: 5 }}>Al menos una mayúscula</li>
            <li style={{ marginBottom: 5 }}>Al menos un número</li>
            <li>Al menos un carácter especial (!@#$%^&*)</li>
          </ul>
        </div>

        {/* Current password */}
        <div style={{ marginBottom: 20 }}>
          <label style={{
            display: 'block', fontSize: 12,
            fontWeight: 600, color: '#1a1d29', 
            marginBottom: 8, textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Contraseña Actual
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={show.current ? 'text' : 'password'}
              value={form.current}
              onChange={e => setForm(f => ({
                ...f, current: e.target.value }))}
              required style={{
                width: '100%', padding: '11px 38px 11px 14px',
                border: '1px solid #e0e0e0', borderRadius: 8,
                fontSize: 13, outline: 'none', boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.currentTarget.style.borderColor = '#d32f2f'}
              onBlur={e => e.currentTarget.style.borderColor = '#e0e0e0'}
            />
            <button type="button"
              onClick={() => setShow(s => ({
                ...s, current: !s.current }))}
              style={{
                position: 'absolute', right: 12,
                top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none',
                cursor: 'pointer', color: '#546e7a',
                padding: 4,
              }}>
              {show.current
                ? <EyeOff size={16} />
                : <Eye    size={16} />}
            </button>
          </div>
        </div>

        {/* New password */}
        <div style={{ marginBottom: 8 }}>
          <label style={{
            display: 'block', fontSize: 12,
            fontWeight: 600, color: '#1a1d29', 
            marginBottom: 8, textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Nueva Contraseña
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={show.next ? 'text' : 'password'}
              value={form.next}
              onChange={e => setForm(f => ({
                ...f, next: e.target.value }))}
              required minLength={8} style={{
                width: '100%', padding: '11px 38px 11px 14px',
                border: '1px solid #e0e0e0', borderRadius: 8,
                fontSize: 13, outline: 'none', boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.currentTarget.style.borderColor = '#d32f2f'}
              onBlur={e => e.currentTarget.style.borderColor = '#e0e0e0'}
            />
            <button type="button"
              onClick={() => setShow(s => ({
                ...s, next: !s.next }))}
              style={{
                position: 'absolute', right: 12,
                top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none',
                cursor: 'pointer', color: '#546e7a',
                padding: 4,
              }}>
              {show.next
                ? <EyeOff size={16} />
                : <Eye    size={16} />}
            </button>
          </div>
        </div>

        {/* Strength indicator */}
        {form.next && (
          <div style={{ marginBottom: 20 }}>
            <div style={{
              display: 'flex', gap: 5, marginBottom: 8,
            }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{
                  flex: 1, height: 5, borderRadius: 3,
                  backgroundColor: i <= s
                    ? strengthColor : '#e0e0e0',
                  transition: 'background-color 0.2s',
                }} />
              ))}
            </div>
            <div style={{
              fontSize: 12, fontWeight: 600,
              color: strengthColor, marginBottom: 4,
            }}>
              Fortaleza: {strengthLabel}
            </div>
          </div>
        )}

        {/* Confirm */}
        <div style={{ marginBottom: 24 }}>
          <label style={{
            display: 'block', fontSize: 12,
            fontWeight: 600, color: '#1a1d29', 
            marginBottom: 8, textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Confirmar Contraseña
          </label>
          <input type="password" value={form.confirm}
            onChange={e => setForm(f => ({
              ...f, confirm: e.target.value }))}
            required style={{
              width: '100%', padding: '11px 14px',
              border: '1px solid ' + (form.confirm && form.confirm !== form.next
                ? '#d32f2f' : '#e0e0e0'), borderRadius: 8,
              fontSize: 13, outline: 'none', boxSizing: 'border-box',
              transition: 'border-color 0.2s',
              backgroundColor: form.confirm && form.confirm !== form.next
                ? '#ffebee' : 'white',
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = '#d32f2f'
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = form.confirm && form.confirm !== form.next
                ? '#d32f2f' : '#e0e0e0'
            }}
          />
          {form.confirm && form.confirm !== form.next && (
            <div style={{
              fontSize: 12, color: '#d32f2f', marginTop: 6,
              fontWeight: 500,
            }}>
              ✗ Las contraseñas no coinciden
            </div>
          )}
          {form.confirm && form.confirm === form.next && (
            <div style={{
              fontSize: 12, color: '#2e7d32', marginTop: 6,
              fontWeight: 500,
            }}>
              ✓ Las contraseñas coinciden
            </div>
          )}
        </div>

        {/* Button */}
        <button type="submit" disabled={loading} style={{
          width: '100%', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', gap: 8,
          padding: '12px 24px', backgroundColor: '#d32f2f',
          border: 'none', borderRadius: 8, fontSize: 13,
          color: 'white', fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          opacity: loading ? 0.7 : 1,
        }}
        onMouseEnter={e => {
          if (!loading) {
            (e.currentTarget as HTMLElement).style.backgroundColor = '#b71c1c'
            ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
          }
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.backgroundColor = '#d32f2f'
          ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
        }}>
          {loading && (
            <div style={{
              width: 15, height: 15,
              border: '2px solid white',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
          )}
          {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
        </button>
      </form>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

function SystemTab() {
  const versions = {
    frontend: '1.0.0',
    backend: '3.4.1',
    java: '21',
    react: '18.3.1',
    tailwind: '3.4.0',
    database: 'PostgreSQL 16',
    buildDate: new Date().toLocaleDateString('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric'
    })
  }

  return (
    <div style={{
      backgroundColor: 'white', borderRadius: 14,
      border: '1px solid #e0e0e0', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '24px', borderBottom: '1px solid #e0e0e0',
        background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 48, height: 48, backgroundColor: '#1976d2',
            borderRadius: '50%', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: 'white',
          }}>
            <Server size={24} />
          </div>
          <div>
            <div style={{
              fontSize: 16, fontWeight: 700,
              color: '#1a1d29',
            }}>
              Información del Sistema
            </div>
            <div style={{ fontSize: 12, color: '#546e7a', marginTop: 2 }}>
              Versiones y detalles de componentes
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 24,
        }}>
          {/* Frontend Section */}
          <div>
            <div style={{
              fontSize: 13, fontWeight: 700, color: '#1a1d29',
              marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6,
              textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>
              📱 Frontend
            </div>
            <div style={{
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              {[
                { label: 'Versión App', value: versions.frontend },
                { label: 'React', value: versions.react },
                { label: 'TailwindCSS', value: versions.tailwind },
              ].map((item, i) => (
                <div key={i} style={{
                  padding: '10px 12px', backgroundColor: '#f8f9fa',
                  borderRadius: 8, border: '1px solid #e0e0e0',
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span style={{ fontSize: 12, color: '#546e7a' }}>
                    {item.label}
                  </span>
                  <span style={{
                    fontSize: 12, fontWeight: 600, color: '#1a1d29',
                  }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Backend Section */}
          <div>
            <div style={{
              fontSize: 13, fontWeight: 700, color: '#1a1d29',
              marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6,
              textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>
              ⚙️ Backend
            </div>
            <div style={{
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              {[
                { label: 'Versión Spring', value: versions.backend },
                { label: 'Java', value: versions.java },
                { label: 'Base de Datos', value: versions.database },
              ].map((item, i) => (
                <div key={i} style={{
                  padding: '10px 12px', backgroundColor: '#f8f9fa',
                  borderRadius: 8, border: '1px solid #e0e0e0',
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span style={{ fontSize: 12, color: '#546e7a' }}>
                    {item.label}
                  </span>
                  <span style={{
                    fontSize: 12, fontWeight: 600, color: '#1a1d29',
                  }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Build Info */}
        <div style={{
          marginTop: 24, padding: '14px 14px',
          backgroundColor: '#f3f4f6', borderRadius: 10,
          border: '1px solid #e5e7eb',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 11, color: '#546e7a', marginBottom: 4 }}>
            Última compilación
          </div>
          <div style={{
            fontSize: 13, fontWeight: 600, color: '#1a1d29',
          }}>
            {versions.buildDate}
          </div>
        </div>
      </div>
    </div>
  )
}