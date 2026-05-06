import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Users, MonitorCheck, History,
  UserCog, Settings, Shield, BarChart2, LogOut,
  Bell, ChevronDown, Scan, AlertTriangle, Clock, X
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useState, useEffect, useRef } from 'react'
import type { ElementType } from 'react'
import { accessApi } from '../../api'
import type { RoomStatus } from '../../types'

const menuItems: Array<{
  path: string; icon: ElementType; label: string
  roles: ('ROLE_ADMIN' | 'ROLE_SUPER_ADMIN')[]
}> = [
  { path: '/dashboard',        icon: LayoutDashboard, label: 'Dashboard',       roles: ['ROLE_ADMIN','ROLE_SUPER_ADMIN'] },
  { path: '/employees',        icon: Users,           label: 'Empleados',       roles: ['ROLE_ADMIN','ROLE_SUPER_ADMIN'] },
  { path: '/monitor',          icon: MonitorCheck,    label: 'Monitor en Vivo', roles: ['ROLE_ADMIN','ROLE_SUPER_ADMIN'] },
  { path: '/history',          icon: History,         label: 'Historial',       roles: ['ROLE_ADMIN','ROLE_SUPER_ADMIN'] },
  { path: '/analytics',        icon: BarChart2,       label: 'Analítica',       roles: ['ROLE_ADMIN','ROLE_SUPER_ADMIN'] },
  { path: '/admin-management', icon: UserCog,         label: 'Administradores', roles: ['ROLE_SUPER_ADMIN'] },
  { path: '/system-config',    icon: Settings,        label: 'Config. Sistema', roles: ['ROLE_SUPER_ADMIN'] },
]

interface Notification {
  id: string
  type: 'warning' | 'critical'
  message: string
  employeeName: string
  time: string
  read: boolean
}

export default function AppLayout() {
  const { user, logout } = useAuth()
  const navigate    = useNavigate()
  const location    = useLocation()
  const [userMenuOpen,  setUserMenuOpen]  = useState(false)
  const [bellOpen,      setBellOpen]      = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const bellRef = useRef<HTMLDivElement>(null)

  // ── Revisar empleados con alerta cada 30 s ───────────────────────────────
  useEffect(() => {
    const check = async () => {
      try {
        const { data }: { data: RoomStatus } = await accessApi.getRoomStatus()
        if (!data?.employeesInside) return
        const maxMin = data.maxStayMinutes ?? 60

        data.employeesInside.forEach(emp => {
          if (!emp.enteredAt) return
          const minutesInside = (Date.now() - new Date(emp.enteredAt).getTime()) / 60000
          const pct = minutesInside / maxMin

          if (pct >= 0.5) {
            const type: 'warning' | 'critical' = pct >= 1 ? 'critical' : 'warning'
            const id = `${emp.id}-${type}`
            setNotifications(prev => {
              if (prev.find(n => n.id === id)) return prev
              return [{
                id,
                type,
                employeeName: `${emp.firstName} ${emp.lastName}`,
                message: type === 'critical'
                  ? `ALERTA CRÍTICA: lleva ${Math.floor(minutesInside)} min en ROOM_911`
                  : `Tiempo prolongado: lleva ${Math.floor(minutesInside)} min de ${maxMin} min máx.`,
                time: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
                read: false,
              }, ...prev].slice(0, 20)
            })
          }
        })
      } catch { /* silencioso */ }
    }
    check()
    const id = setInterval(check, 30000)
    return () => clearInterval(id)
  }, [])

  // Cerrar panel al hacer clic fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node))
        setBellOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const unread = notifications.filter(n => !n.read).length
  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  const removeNotif = (id: string) =>
    setNotifications(prev => prev.filter(n => n.id !== id))

  const visible = menuItems.filter(item =>
    user?.role && item.roles.includes(user.role as any)
  )
  const currentLabel = visible.find(i => i.path === location.pathname)?.label ?? 'ROOM_911'

  return (
    <div style={{ display:'flex', height:'100vh',
      backgroundColor:'#f8f9fa', overflow:'hidden' }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: 256, backgroundColor: '#0d47a1',
        color: 'white', display: 'flex',
        flexDirection: 'column', flexShrink: 0,
      }}>
        <div style={{
          padding: '24px', borderBottom: '1px solid #1565c0',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 40, height: 40, backgroundColor: '#1976d2',
            borderRadius: 10, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Shield size={22} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>ROOM_911</div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>Control de Acceso</div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          {visible.map(item => {
            const Icon   = item.icon
            const active = location.pathname === item.path
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  gap: 10, padding: '10px 14px', borderRadius: 8,
                  border: 'none', cursor: 'pointer', marginBottom: 2,
                  backgroundColor: active ? '#1565c0' : 'transparent',
                  color: active ? 'white' : 'rgba(255,255,255,0.8)',
                  fontSize: 13, textAlign: 'left',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={e => {
                  if (!active)(e.currentTarget as HTMLElement)
                    .style.backgroundColor = 'rgba(255,255,255,0.1)'
                }}
                onMouseLeave={e => {
                  if (!active)(e.currentTarget as HTMLElement)
                    .style.backgroundColor = 'transparent'
                }}
              >
                <Icon size={18} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.roles.includes('ROLE_SUPER_ADMIN') &&
                 !item.roles.includes('ROLE_ADMIN') && (
                  <span style={{
                    fontSize: 10, padding: '2px 6px',
                    backgroundColor: '#f57c00',
                    borderRadius: 20, color: 'white',
                  }}>Super</span>
                )}
              </button>
            )
          })}

          <div style={{ borderTop: '1px solid #1565c0', marginTop: 12, paddingTop: 12 }}>
            <button onClick={() => navigate('/scanner')}
              style={{
                width: '100%', display: 'flex', alignItems: 'center',
                gap: 10, padding: '10px 14px', borderRadius: 8,
                border: 'none', cursor: 'pointer',
                backgroundColor: '#2e7d32', color: 'white',
                fontSize: 13, textAlign: 'left',
              }}>
              <Scan size={18} />
              Scanner ROOM_911
            </button>
          </div>
        </nav>

        <div style={{ padding: '12px 16px', borderTop: '1px solid #1565c0' }}>
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: 8, padding: '8px 12px',
          }}>
            <div style={{ fontSize: 11, fontWeight: 600 }}>Laboratorios XYZ</div>
            <div style={{ fontSize: 10, opacity: 0.6 }}>Medicamentos de Alto Costo</div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <header style={{
          height: 64, backgroundColor: 'white',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '0 24px',
          flexShrink: 0,
        }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: '#1a1d29' }}>
              {currentLabel}
            </div>
            <div style={{ fontSize: 11, color: '#546e7a' }}>Laboratorios XYZ</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

            {/* ── Botón de Notificaciones ── */}
            <div ref={bellRef} style={{ position: 'relative' }}>
              <button onClick={() => { setBellOpen(v => !v); if (!bellOpen) markAllRead() }}
                style={{
                  position: 'relative', background: 'none',
                  border: 'none', cursor: 'pointer',
                  padding: 8, color: '#546e7a',
                  borderRadius: 8,
                  backgroundColor: bellOpen ? '#f8f9fa' : 'transparent',
                }}>
                <Bell size={20} />
                {unread > 0 && (
                  <span style={{
                    position: 'absolute', top: 4, right: 4,
                    minWidth: 16, height: 16, backgroundColor: '#d32f2f',
                    borderRadius: '50%', fontSize: 10, fontWeight: 700,
                    color: 'white', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    padding: '0 3px',
                  }}>
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </button>

              {/* Panel de notificaciones */}
              {bellOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: '100%',
                  marginTop: 4, width: 340, backgroundColor: 'white',
                  border: '1px solid #e0e0e0', borderRadius: 12,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  zIndex: 100, overflow: 'hidden',
                }}>
                  {/* Header panel */}
                  <div style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #e0e0e0',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: '#1a1d29' }}>
                      Notificaciones
                    </span>
                    {notifications.length > 0 && (
                      <button onClick={() => setNotifications([])}
                        style={{
                          background: 'none', border: 'none',
                          fontSize: 11, color: '#1976d2', cursor: 'pointer',
                        }}>
                        Limpiar todo
                      </button>
                    )}
                  </div>

                  {/* Lista */}
                  <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <div style={{
                        padding: '32px 16px', textAlign: 'center',
                        fontSize: 13, color: '#546e7a',
                      }}>
                        <Bell size={28} color="#e0e0e0" style={{ marginBottom: 8, display: 'block', margin: '0 auto 8px' }} />
                        Sin notificaciones
                      </div>
                    ) : notifications.map(n => (
                      <div key={n.id} style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid #f5f5f5',
                        display: 'flex', gap: 10, alignItems: 'flex-start',
                        backgroundColor: n.read ? 'white' : '#fafbff',
                      }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                          backgroundColor: n.type === 'critical' ? '#ffebee' : '#fff3e0',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {n.type === 'critical'
                            ? <AlertTriangle size={15} color="#d32f2f" />
                            : <Clock size={15} color="#f57c00" />}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: 12, fontWeight: 600,
                            color: n.type === 'critical' ? '#d32f2f' : '#f57c00',
                            marginBottom: 2,
                          }}>
                            {n.employeeName}
                          </div>
                          <div style={{ fontSize: 11, color: '#546e7a', lineHeight: 1.4 }}>
                            {n.message}
                          </div>
                          <div style={{ fontSize: 10, color: '#9e9e9e', marginTop: 2 }}>
                            {n.time}
                          </div>
                        </div>
                        <button onClick={() => removeNotif(n.id)}
                          style={{
                            background: 'none', border: 'none',
                            cursor: 'pointer', color: '#9e9e9e',
                            padding: 2, flexShrink: 0,
                          }}>
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Footer — ir al monitor */}
                  {notifications.length > 0 && (
                    <div style={{ padding: '10px 16px', borderTop: '1px solid #e0e0e0' }}>
                      <button onClick={() => { navigate('/monitor'); setBellOpen(false) }}
                        style={{
                          width: '100%', padding: '7px 12px',
                          backgroundColor: '#0d47a1', color: 'white',
                          border: 'none', borderRadius: 8,
                          fontSize: 12, fontWeight: 500, cursor: 'pointer',
                        }}>
                        Ver Monitor en Vivo
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Menú usuario ── */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setUserMenuOpen(v => !v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 10px', borderRadius: 8,
                  border: 'none', cursor: 'pointer',
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={e =>
                  (e.currentTarget as HTMLElement).style.backgroundColor = '#f8f9fa'}
                onMouseLeave={e =>
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
              >
                <div style={{
                  width: 32, height: 32, backgroundColor: '#0d47a1',
                  borderRadius: '50%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: 12, fontWeight: 700,
                  overflow: 'hidden', backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundImage: user?.avatarUrl ? `url(${user.avatarUrl})` : 'none',
                }}>
                  {!user?.avatarUrl && `${user?.firstName?.[0]}${user?.lastName?.[0]}`}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1d29' }}>
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div style={{ fontSize: 11, color: '#546e7a' }}>
                    {user?.role === 'ROLE_SUPER_ADMIN' ? 'Super Admin' : 'Administrador'}
                  </div>
                </div>
                <ChevronDown size={14} color="#546e7a" />
              </button>

              {userMenuOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: '100%',
                  marginTop: 4, width: 180, backgroundColor: 'white',
                  border: '1px solid #e0e0e0', borderRadius: 10,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  zIndex: 50, overflow: 'hidden',
                }}>
                  <button onClick={() => { navigate('/settings'); setUserMenuOpen(false) }}
                    style={{
                      width: '100%', padding: '10px 16px',
                      textAlign: 'left', border: 'none',
                      cursor: 'pointer', fontSize: 13,
                      backgroundColor: 'transparent', color: '#1a1d29',
                    }}
                    onMouseEnter={e =>
                      (e.currentTarget as HTMLElement).style.backgroundColor = '#f8f9fa'}
                    onMouseLeave={e =>
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
                  >
                    Mi Perfil
                  </button>
                  <div style={{ borderTop: '1px solid #e0e0e0' }} />
                  <button onClick={() => { logout(); navigate('/login') }}
                    style={{
                      width: '100%', padding: '10px 16px',
                      textAlign: 'left', border: 'none',
                      cursor: 'pointer', fontSize: 13,
                      backgroundColor: 'transparent', color: '#d32f2f',
                      display: 'flex', alignItems: 'center', gap: 8,
                    }}
                    onMouseEnter={e =>
                      (e.currentTarget as HTMLElement).style.backgroundColor = '#f8f9fa'}
                    onMouseLeave={e =>
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
                  >
                    <LogOut size={14} />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}