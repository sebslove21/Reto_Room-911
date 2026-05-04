import { useState } from 'react'
import { User, Lock, Eye, EyeOff, Upload, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '../../context/AuthContext'
import { profileApi, authApi } from '../../api'

export function AdminSettings() {
  const [tab, setTab] = useState<'profile' | 'password'>('profile')

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
    </div>
  )
}

function ProfileTab() {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({
    firstName: user?.firstName ?? '',
    lastName:  user?.lastName  ?? '',
    email:     user?.email     ?? '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await profileApi.update(form)
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
    } catch {
      toast.error('Error al subir imagen')
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
      <div style={{
        padding: '16px 20px', borderBottom: '1px solid #e0e0e0',
        fontSize: 14, fontWeight: 600, color: '#1a1d29',
      }}>
        Información Personal
      </div>
      <div style={{ padding: 24 }}>
        {/* Avatar */}
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: 16, marginBottom: 24,
        }}>
          <div style={{
            width: 64, height: 64, backgroundColor: '#0d47a1',
            borderRadius: '50%', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: 20, fontWeight: 700,
            flexShrink: 0,
          }}>
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar"
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover', borderRadius: '50%',
                }} />
            ) : (
              `${user?.firstName?.[0]}${user?.lastName?.[0]}`
            )}
          </div>
          <div>
            <div style={{
              fontSize: 13, fontWeight: 500,
              color: '#1a1d29', marginBottom: 6,
            }}>
              Foto de perfil
            </div>
            <label style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', backgroundColor: 'white',
              border: '1px solid #e0e0e0', borderRadius: 7,
              fontSize: 12, color: '#546e7a', cursor: 'pointer',
            }}>
              <Upload size={13} /> Cambiar foto
              <input type="file" accept="image/jpeg,image/png"
                onChange={handleAvatar}
                style={{ display: 'none' }} />
            </label>
            <div style={{
              fontSize: 11, color: '#546e7a', marginTop: 4,
            }}>
              JPG o PNG · Máx 2MB
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}
          style={{ maxWidth: 400 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 14, marginBottom: 14,
          }}>
            <div>
              <label style={{
                display: 'block', fontSize: 13,
                fontWeight: 500, color: '#1a1d29', marginBottom: 5,
              }}>
                Nombre
              </label>
              <input type="text" value={form.firstName}
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
              <input type="text" value={form.lastName}
                onChange={e => setForm(f => ({
                  ...f, lastName: e.target.value }))}
                required style={inputStyle} />
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block', fontSize: 13,
              fontWeight: 500, color: '#1a1d29', marginBottom: 5,
            }}>
              Email
            </label>
            <input type="email" value={form.email}
              onChange={e => setForm(f => ({
                ...f, email: e.target.value }))}
              required style={inputStyle} />
          </div>
          {user?.departmentName && (
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block', fontSize: 13,
                fontWeight: 500, color: '#1a1d29', marginBottom: 5,
              }}>
                Departamento
              </label>
              <input type="text" value={user.departmentName}
                disabled style={{
                  ...inputStyle,
                  backgroundColor: '#f8f9fa', color: '#546e7a',
                }} />
            </div>
          )}
          <button type="submit" disabled={loading} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '9px 20px', backgroundColor: '#0d47a1',
            border: 'none', borderRadius: 8, fontSize: 13,
            color: 'white',
            cursor: loading ? 'not-allowed' : 'pointer',
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
            Guardar cambios
          </button>
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

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 38px 9px 12px',
    border: '1px solid #e0e0e0', borderRadius: 8,
    fontSize: 13, outline: 'none', boxSizing: 'border-box',
  }

  return (
    <div style={{
      backgroundColor: 'white', borderRadius: 14,
      border: '1px solid #e0e0e0',
    }}>
      <div style={{
        padding: '16px 20px', borderBottom: '1px solid #e0e0e0',
      }}>
        <div style={{
          fontSize: 14, fontWeight: 600, color: '#1a1d29',
        }}>
          Cambiar Contraseña
        </div>
        <div style={{ fontSize: 12, color: '#546e7a' }}>
          Mínimo 8 caracteres, mayúscula, número y carácter especial
        </div>
      </div>

      <form onSubmit={handleSubmit}
        style={{ padding: 24, maxWidth: 400 }}>
        {/* Current password */}
        <div style={{ marginBottom: 16 }}>
          <label style={{
            display: 'block', fontSize: 13,
            fontWeight: 500, color: '#1a1d29', marginBottom: 5,
          }}>
            Contraseña actual
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={show.current ? 'text' : 'password'}
              value={form.current}
              onChange={e => setForm(f => ({
                ...f, current: e.target.value }))}
              required style={inputStyle} />
            <button type="button"
              onClick={() => setShow(s => ({
                ...s, current: !s.current }))}
              style={{
                position: 'absolute', right: 10,
                top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none',
                cursor: 'pointer', color: '#546e7a',
              }}>
              {show.current
                ? <EyeOff size={15} />
                : <Eye    size={15} />}
            </button>
          </div>
        </div>

        {/* New password */}
        <div style={{ marginBottom: 6 }}>
          <label style={{
            display: 'block', fontSize: 13,
            fontWeight: 500, color: '#1a1d29', marginBottom: 5,
          }}>
            Nueva contraseña
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={show.next ? 'text' : 'password'}
              value={form.next}
              onChange={e => setForm(f => ({
                ...f, next: e.target.value }))}
              required minLength={8} style={inputStyle} />
            <button type="button"
              onClick={() => setShow(s => ({
                ...s, next: !s.next }))}
              style={{
                position: 'absolute', right: 10,
                top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none',
                cursor: 'pointer', color: '#546e7a',
              }}>
              {show.next
                ? <EyeOff size={15} />
                : <Eye    size={15} />}
            </button>
          </div>
        </div>

        {form.next && (
          <div style={{ marginBottom: 16 }}>
            <div style={{
              display: 'flex', gap: 4, marginBottom: 4,
            }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{
                  flex: 1, height: 3, borderRadius: 2,
                  backgroundColor: i <= s
                    ? strengthColor : '#f0f0f0',
                  transition: 'background-color 0.2s',
                }} />
              ))}
            </div>
            <div style={{
              fontSize: 11, color: strengthColor,
            }}>
              {strengthLabel}
            </div>
          </div>
        )}

        {/* Confirm */}
        <div style={{ marginBottom: 24 }}>
          <label style={{
            display: 'block', fontSize: 13,
            fontWeight: 500, color: '#1a1d29', marginBottom: 5,
          }}>
            Confirmar contraseña
          </label>
          <input type="password" value={form.confirm}
            onChange={e => setForm(f => ({
              ...f, confirm: e.target.value }))}
            required style={{
              ...inputStyle,
              borderColor: form.confirm && form.confirm !== form.next
                ? '#d32f2f' : '#e0e0e0',
            }} />
          {form.confirm && form.confirm !== form.next && (
            <div style={{
              fontSize: 11, color: '#d32f2f', marginTop: 4,
            }}>
              Las contraseñas no coinciden
            </div>
          )}
        </div>

        <button type="submit" disabled={loading} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '9px 20px', backgroundColor: '#0d47a1',
          border: 'none', borderRadius: 8, fontSize: 13,
          color: 'white',
          cursor: loading ? 'not-allowed' : 'pointer',
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
          Cambiar contraseña
        </button>
      </form>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}