import { useState, useEffect } from 'react'
import {
  Settings, Save, Plus, Edit, Trash2, AlertTriangle
} from 'lucide-react'
import { toast } from 'sonner'
import { settingsApi, departmentsApi } from '../../api'
import type { RoomSettings, Department } from '../../types'

export function SystemConfig() {
  const [settings,      setSettings]      = useState<RoomSettings | null>(null)
  const [departments,   setDepartments]   = useState<Department[]>([])
  const [form,          setForm]          = useState({
    maxCapacity: 10, maxStayMinutes: 60, alertThresholdPct: 80,
  })
  const [saving,        setSaving]        = useState(false)
  const [loading,       setLoading]       = useState(true)
  const [showDeptForm,  setShowDeptForm]  = useState(false)
  const [editingDept,   setEditingDept]   = useState<Department | null>(null)

  useEffect(() => {
    Promise.all([settingsApi.get(), departmentsApi.getAll()])
      .then(([sRes, dRes]) => {
        setSettings(sRes.data)
        setForm({
          maxCapacity:      sRes.data.maxCapacity,
          maxStayMinutes:   sRes.data.maxStayMinutes,
          alertThresholdPct:sRes.data.alertThresholdPct,
        })
        setDepartments(dRes.data)
      }).catch(console.error)
        .finally(() => setLoading(false))
  }, [])

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.maxCapacity < 1 || form.maxStayMinutes < 1) {
      toast.error('Los valores deben ser mayores a cero'); return
    }
    setSaving(true)
    try {
      await settingsApi.update(form)
      toast.success('Configuración actualizada. Cambios aplicados inmediatamente.')
    } catch {
      toast.error('Error al guardar configuración')
    } finally {
      setSaving(false)
    }
  }

  const reloadDepts = async () => {
    const { data } = await departmentsApi.getAll()
    setDepartments(data)
  }

  const handleDeleteDept = async (dept: Department) => {
    if (!confirm(
      `¿Desactivar el departamento "${dept.name}"?`)) return
    try {
      await departmentsApi.delete(dept.id)
      toast.success('Departamento desactivado')
      reloadDepts()
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ?? 'Error al desactivar')
    }
  }

  const numberInput: React.CSSProperties = {
    width: '100%', padding: '10px 12px',
    border: '1px solid #e0e0e0', borderRadius: 8,
    fontSize: 18, fontWeight: 700, textAlign: 'center',
    outline: 'none', boxSizing: 'border-box',
    fontFamily: 'monospace',
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: 10, marginBottom: 4,
        }}>
          <h1 style={{
            fontSize: 22, fontWeight: 700,
            color: '#1a1d29', margin: 0,
          }}>
            Configuración del Sistema
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
          Parámetros del ROOM_911 y gestión de departamentos
        </p>
      </div>

      {/* Room Settings */}
      <div style={{
        backgroundColor: 'white', borderRadius: 14,
        border: '1px solid #e0e0e0', marginBottom: 24,
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 36, height: 36,
            backgroundColor: '#e3f2fd', borderRadius: 10,
            display: 'flex', alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Settings size={18} color="#0d47a1" />
          </div>
          <div>
            <div style={{
              fontSize: 14, fontWeight: 600, color: '#1a1d29',
            }}>
              Parámetros del ROOM_911
            </div>
            <div style={{ fontSize: 12, color: '#546e7a' }}>
              Los cambios aplican de forma inmediata
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveSettings} style={{ padding: 20 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16, marginBottom: 20,
          }}>
            {[
              {
                label: 'Aforo Máximo',
                key:   'maxCapacity',
                unit:  'personas',
                help:  'Máximo simultáneo en sala',
              },
              {
                label: 'Tiempo Máximo',
                key:   'maxStayMinutes',
                unit:  'minutos',
                help:  'Tiempo antes de alertar',
              },
              {
                label: 'Umbral de Alerta',
                key:   'alertThresholdPct',
                unit:  '%',
                help:  'Ocupación para advertencia',
              },
            ].map(({ label, key, unit, help }) => (
              <div key={key} style={{
                backgroundColor: '#f8f9fa',
                borderRadius: 10, padding: 16,
              }}>
                <div style={{
                  fontSize: 13, fontWeight: 600,
                  color: '#1a1d29', marginBottom: 2,
                }}>
                  {label}
                </div>
                <div style={{
                  fontSize: 11, color: '#546e7a', marginBottom: 10,
                }}>
                  {help}
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <input type="number"
                    value={(form as any)[key]}
                    onChange={e => setForm(f => ({
                      ...f, [key]: Number(e.target.value) }))}
                    min={1} max={key === 'alertThresholdPct' ? 99 : undefined}
                    required style={numberInput} />
                  <span style={{
                    fontSize: 12, color: '#546e7a', whiteSpace: 'nowrap',
                  }}>
                    {unit}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            display: 'flex', alignItems: 'flex-start',
            gap: 10, padding: 14,
            backgroundColor: '#fff3e0',
            border: '1px solid #ffe0b2', borderRadius: 10,
            marginBottom: 16,
          }}>
            <AlertTriangle size={15} color="#f57c00"
              style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 12, color: '#1a1d29', margin: 0 }}>
              Todos los cambios quedan registrados en el log de
              auditoría con usuario, fecha y valores anteriores.
            </p>
          </div>

          <button type="submit" disabled={saving || loading}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 20px', backgroundColor: '#0d47a1',
              border: 'none', borderRadius: 8, fontSize: 13,
              color: 'white', cursor: saving ? 'not-allowed' : 'pointer',
            }}>
            {saving ? (
              <div style={{
                width: 14, height: 14,
                border: '2px solid white',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
            ) : <Save size={14} />}
            Guardar Configuración
          </button>
        </form>
      </div>

      {/* Departments */}
      <div style={{
        backgroundColor: 'white', borderRadius: 14,
        border: '1px solid #e0e0e0', overflow: 'hidden',
      }}>
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid #e0e0e0',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{
              fontSize: 14, fontWeight: 600, color: '#1a1d29',
            }}>
              Departamentos
            </div>
            <div style={{ fontSize: 12, color: '#546e7a' }}>
              {departments.length} departamentos configurados
            </div>
          </div>
          <button onClick={() => {
            setEditingDept(null); setShowDeptForm(true)
          }} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 12px', backgroundColor: '#0d47a1',
            border: 'none', borderRadius: 8,
            fontSize: 12, color: 'white', cursor: 'pointer',
          }}>
            <Plus size={13} /> Nuevo
          </button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              {['Nombre','Descripción','Estado','Acciones'].map(h => (
                <th key={h} style={{
                  padding: '10px 14px', textAlign: 'left',
                  fontSize: 11, fontWeight: 600,
                  color: '#546e7a', textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i} style={{ borderTop: '1px solid #f0f0f0' }}>
                  {[...Array(4)].map((_, j) => (
                    <td key={j} style={{ padding: '11px 14px' }}>
                      <div style={{
                        height: 13, backgroundColor: '#f0f0f0',
                        borderRadius: 4,
                      }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : departments.map(dept => (
              <tr key={dept.id}
                style={{ borderTop: '1px solid #f0f0f0' }}>
                <td style={{
                  padding: '11px 14px', fontSize: 13,
                  fontWeight: 500, color: '#1a1d29',
                }}>
                  {dept.name}
                </td>
                <td style={{
                  padding: '11px 14px',
                  fontSize: 13, color: '#546e7a',
                }}>
                  {dept.description || '—'}
                </td>
                <td style={{ padding: '11px 14px' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center',
                    gap: 4, padding: '2px 8px', borderRadius: 20,
                    fontSize: 11, fontWeight: 600,
                    backgroundColor: dept.isActive
                      ? '#e8f5e9' : '#f5f5f5',
                    color: dept.isActive ? '#2e7d32' : '#546e7a',
                  }}>
                    <span style={{
                      width: 5, height: 5, borderRadius: '50%',
                      backgroundColor: dept.isActive
                        ? '#2e7d32' : '#546e7a',
                    }} />
                    {dept.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={{ padding: '11px 14px' }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={() => {
                      setEditingDept(dept); setShowDeptForm(true)
                    }} style={{
                      padding: 6, background: 'none',
                      border: 'none', cursor: 'pointer',
                      color: '#546e7a', borderRadius: 6,
                    }}>
                      <Edit size={13} />
                    </button>
                    <button onClick={() => handleDeleteDept(dept)}
                      style={{
                        padding: 6, background: 'none',
                        border: 'none', cursor: 'pointer',
                        color: '#546e7a', borderRadius: 6,
                      }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDeptForm && (
        <DepartmentModal
          department={editingDept}
          onClose={() => setShowDeptForm(false)}
          onSaved={() => { setShowDeptForm(false); reloadDepts() }}
        />
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

function DepartmentModal({
  department, onClose, onSaved,
}: {
  department: Department | null
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState({
    name:        department?.name        ?? '',
    description: department?.description ?? '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (department) {
        await departmentsApi.update(department.id, form)
        toast.success('Departamento actualizado')
      } else {
        await departmentsApi.create(form)
        toast.success('Departamento creado')
      }
      onSaved()
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ?? 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px',
    border: '1px solid #e0e0e0', borderRadius: 8,
    fontSize: 13, outline: 'none', boxSizing: 'border-box',
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
        width: '100%', maxWidth: 400,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #e0e0e0',
          fontSize: 15, fontWeight: 600, color: '#1a1d29',
        }}>
          {department ? 'Editar Departamento' : 'Nuevo Departamento'}
        </div>
        <form onSubmit={handleSubmit} style={{ padding: 20 }}>
          <div style={{ marginBottom: 14 }}>
            <label style={{
              display: 'block', fontSize: 13,
              fontWeight: 500, color: '#1a1d29', marginBottom: 5,
            }}>
              Nombre
            </label>
            <input type="text" value={form.name}
              onChange={e => setForm(f => ({
                ...f, name: e.target.value }))}
              required style={inputStyle}
              placeholder="Ej: Síntesis Química" />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block', fontSize: 13,
              fontWeight: 500, color: '#1a1d29', marginBottom: 5,
            }}>
              Descripción
            </label>
            <textarea value={form.description}
              onChange={e => setForm(f => ({
                ...f, description: e.target.value }))}
              rows={3} style={{
                ...inputStyle, resize: 'none',
              }}
              placeholder="Descripción del departamento..." />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
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
              borderRadius: 8, fontSize: 13, color: 'white',
              cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', gap: 6,
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
              {department ? 'Guardar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}