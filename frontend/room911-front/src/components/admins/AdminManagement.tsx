import { useState, useEffect } from 'react'
import {
  Plus, UserCog, ToggleLeft,
  ToggleRight, Search, Crown, Edit
} from 'lucide-react'
import { toast } from 'sonner'
import { superAdminApi, departmentsApi } from '../../api'
import { formatDateTime } from '../../utils/formatters'
import type { Admin, Department } from '../../types'

export function AdminManagement() {
  const [admins,      setAdmins]      = useState<Admin[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [search,      setSearch]      = useState('')
  const [loading,     setLoading]     = useState(true)
  const [showForm,    setShowForm]    = useState(false)
  const [editing,     setEditing]     = useState<Admin | null>(null)

  useEffect(() => {
    Promise.all([
      superAdminApi.getAdmins(),
      departmentsApi.getAll(),
    ]).then(([aRes, dRes]) => {
      setAdmins(aRes.data)
      setDepartments(dRes.data)
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const reload = async () => {
    const { data } = await superAdminApi.getAdmins()
    setAdmins(data)
  }

  const handleToggle = async (admin: Admin) => {
    try {
      await superAdminApi.toggleAdmin(admin.id, !admin.isActive)
      toast.success(`Cuenta ${!admin.isActive
        ? 'activada' : 'desactivada'}`)
      reload()
    } catch {
      toast.error('Error al cambiar estado de la cuenta')
    }
  }

  const filtered = admins.filter(a =>
    `${a.firstName} ${a.lastName} ${a.email}`
      .toLowerCase().includes(search.toLowerCase())
  )

  const th: React.CSSProperties = {
    padding: '10px 14px', textAlign: 'left',
    fontSize: 11, fontWeight: 600,
    color: '#546e7a', textTransform: 'uppercase',
    letterSpacing: '0.05em',
  }

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between', marginBottom: 24,
      }}>
        <div>
          <div style={{
            display: 'flex', alignItems: 'center',
            gap: 10, marginBottom: 4,
          }}>
            <h1 style={{
              fontSize: 22, fontWeight: 700,
              color: '#1a1d29', margin: 0,
            }}>
              Gestión de Administradores
            </h1>
            <span style={{
              fontSize: 10, padding: '3px 8px',
              backgroundColor: '#fff3e0', color: '#f57c00',
              borderRadius: 20, fontWeight: 600,
            }}>
              Solo Super Admin
            </span>
          </div>
          <p style={{ fontSize: 13, color: '#546e7a', margin: 0 }}>
            {admins.length} administradores registrados
          </p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true) }}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', backgroundColor: '#0d47a1',
            border: 'none', borderRadius: 8,
            fontSize: 13, color: 'white', cursor: 'pointer',
          }}>
          <Plus size={14} /> Nuevo Administrador
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: 320, marginBottom: 16 }}>
        <Search size={15} color="#546e7a" style={{
          position: 'absolute', left: 10,
          top: '50%', transform: 'translateY(-50%)',
        }} />
        <input type="text" value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nombre o email..."
          style={{
            width: '100%', padding: '9px 12px 9px 32px',
            border: '1px solid #e0e0e0', borderRadius: 8,
            fontSize: 13, outline: 'none', boxSizing: 'border-box',
          }} />
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
                {['Administrador','Email','Rol',
                  'Departamento','Estado','Último Acceso','Acciones']
                  .map(h => <th key={h} style={th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #f0f0f0' }}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j} style={{ padding: '11px 14px' }}>
                        <div style={{
                          height: 13, backgroundColor: '#f0f0f0',
                          borderRadius: 4,
                        }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{
                    padding: 48, textAlign: 'center',
                    fontSize: 13, color: '#546e7a',
                  }}>
                    No se encontraron administradores
                  </td>
                </tr>
              ) : filtered.map(admin => (
                <tr key={admin.id}
                  style={{ borderTop: '1px solid #f0f0f0' }}
                  onMouseEnter={e =>
                    (e.currentTarget as HTMLElement)
                      .style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={e =>
                    (e.currentTarget as HTMLElement)
                      .style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '11px 14px' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                    }}>
                      <div style={{
                        width: 34, height: 34,
                        backgroundColor: '#0d47a1',
                        borderRadius: '50%', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: 12, fontWeight: 700,
                        flexShrink: 0,
                      }}>
                        {admin.firstName[0]}{admin.lastName[0]}
                      </div>
                      <span style={{
                        fontSize: 13, fontWeight: 500, color: '#1a1d29',
                      }}>
                        {admin.firstName} {admin.lastName}
                      </span>
                    </div>
                  </td>
                  <td style={{
                    padding: '11px 14px',
                    fontSize: 13, color: '#546e7a',
                  }}>
                    {admin.email}
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    {admin.role === 'ROLE_SUPER_ADMIN' ? (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center',
                        gap: 4, padding: '2px 8px', borderRadius: 20,
                        fontSize: 11, fontWeight: 600,
                        backgroundColor: '#fff3e0', color: '#f57c00',
                      }}>
                        <Crown size={10} /> Super Admin
                      </span>
                    ) : (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center',
                        gap: 4, padding: '2px 8px', borderRadius: 20,
                        fontSize: 11, fontWeight: 600,
                        backgroundColor: '#e3f2fd', color: '#1976d2',
                      }}>
                        <UserCog size={10} /> Admin
                      </span>
                    )}
                  </td>
                  <td style={{
                    padding: '11px 14px',
                    fontSize: 13, color: '#546e7a',
                  }}>
                    {admin.departmentName ?? '—'}
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    <button onClick={() => handleToggle(admin)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        background: 'none', border: 'none',
                        cursor: 'pointer', padding: 0,
                      }}>
                      {admin.isActive ? (
                        <>
                          <ToggleRight size={20} color="#2e7d32" />
                          <span style={{
                            fontSize: 11, color: '#2e7d32',
                          }}>
                            Activo
                          </span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft size={20} color="#546e7a" />
                          <span style={{
                            fontSize: 11, color: '#546e7a',
                          }}>
                            Inactivo
                          </span>
                        </>
                      )}
                    </button>
                  </td>
                  <td style={{
                    padding: '11px 14px',
                    fontSize: 11, color: '#546e7a',
                  }}>
                    {admin.lastLoginAt
                      ? formatDateTime(admin.lastLoginAt)
                      : 'Nunca'}
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    <button onClick={() => {
                      setEditing(admin); setShowForm(true)
                    }} style={{
                      padding: 6, background: 'none',
                      border: 'none', cursor: 'pointer',
                      color: '#546e7a', borderRadius: 6,
                    }}>
                      <Edit size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <AdminFormModal
          admin={editing}
          departments={departments}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); reload() }}
        />
      )}
    </div>
  )
}

function AdminFormModal({
  admin, departments, onClose, onSaved,
}: {
  admin: Admin | null
  departments: Department[]
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState({
    firstName:    admin?.firstName    ?? '',
    lastName:     admin?.lastName     ?? '',
    email:        admin?.email        ?? '',
    password:     '',
    confirmPwd:   '',
    departmentId: admin?.departmentId ?? (departments[0]?.id ?? 0),
  })
  const [loading,  setLoading]  = useState(false)
  const [pwdError, setPwdError] = useState('')

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px',
    border: '1px solid #e0e0e0', borderRadius: 8,
    fontSize: 13, outline: 'none', boxSizing: 'border-box',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 13,
    fontWeight: 500, color: '#1a1d29', marginBottom: 5,
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email.trim())) {
      toast.error('Email inválido')
      return
    }

    if (!admin && form.password !== form.confirmPwd) {
      setPwdError('Las contraseñas no coinciden'); return
    }
    setPwdError('')
    setLoading(true)
    try {
      if (admin) {
        await superAdminApi.updateAdmin(admin.id, {
          firstName:    form.firstName,
          lastName:     form.lastName,
          departmentId: form.departmentId,
        } as any)
        toast.success('Administrador actualizado')
      } else {
        await superAdminApi.createAdmin({
          firstName:    form.firstName,
          lastName:     form.lastName,
          email:        form.email,
          password:     form.password,
          departmentId: form.departmentId,
        })
        toast.success('Administrador creado correctamente')
      }
      onSaved()
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ?? 'Error al guardar administrador')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 1000, padding: 16,
    }}>
      <div style={{
        backgroundColor: 'white', borderRadius: 16,
        width: '100%', maxWidth: 440,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #e0e0e0',
          fontSize: 15, fontWeight: 600, color: '#1a1d29',
        }}>
          {admin ? 'Editar Administrador' : 'Crear Nuevo Administrador'}
        </div>
        <form onSubmit={handleSubmit} style={{ padding: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr', gap: 12,
            }}>
              <div>
                <label style={labelStyle}>Nombre</label>
                <input type="text" value={form.firstName}
                  onChange={e => setForm(f => ({
                    ...f, firstName: e.target.value }))}
                  required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Apellido</label>
                <input type="text" value={form.lastName}
                  onChange={e => setForm(f => ({
                    ...f, lastName: e.target.value }))}
                  required style={inputStyle} />
              </div>
            </div>

            {!admin && (
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" value={form.email}
                  onChange={e => setForm(f => ({
                    ...f, email: e.target.value }))}
                  required style={inputStyle} />
              </div>
            )}

            <div>
              <label style={labelStyle}>Departamento</label>
              <select value={form.departmentId}
                onChange={e => setForm(f => ({
                  ...f, departmentId: Number(e.target.value) }))}
                style={inputStyle}>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            {!admin && (
              <>
                <div>
                  <label style={labelStyle}>Contraseña</label>
                  <input type="password" value={form.password}
                    onChange={e => {
                      setForm(f => ({
                        ...f, password: e.target.value }))
                      setPwdError('')
                    }}
                    required minLength={8} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Confirmar contraseña</label>
                  <input type="password" value={form.confirmPwd}
                    onChange={e => {
                      setForm(f => ({
                        ...f, confirmPwd: e.target.value }))
                      setPwdError('')
                    }}
                    required style={{
                      ...inputStyle,
                      borderColor: pwdError ? '#d32f2f' : '#e0e0e0',
                    }} />
                  {pwdError && (
                    <div style={{
                      fontSize: 11, color: '#d32f2f', marginTop: 4,
                    }}>
                      {pwdError}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div style={{
            display: 'flex', gap: 10, marginTop: 20,
          }}>
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
              {admin ? 'Guardar cambios' : 'Crear administrador'}
            </button>
          </div>
        </form>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}