import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Users, MonitorCheck, History,
  UserCog, Settings, Shield, BarChart2, LogOut,
  Bell, ChevronDown, Scan, Crown
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'
import type { ElementType } from 'react'

const menuItems: Array<{ path: string; icon: ElementType; label: string; roles: ('ROLE_ADMIN' | 'ROLE_SUPER_ADMIN')[] }> = [
  { path: '/dashboard',        icon: LayoutDashboard, label: 'Dashboard',        roles: ['ROLE_ADMIN','ROLE_SUPER_ADMIN'] },
  { path: '/employees',        icon: Users,           label: 'Empleados',        roles: ['ROLE_ADMIN','ROLE_SUPER_ADMIN'] },
  { path: '/monitor',          icon: MonitorCheck,    label: 'Monitor en Vivo',  roles: ['ROLE_ADMIN','ROLE_SUPER_ADMIN'] },
  { path: '/history',          icon: History,         label: 'Historial',        roles: ['ROLE_ADMIN','ROLE_SUPER_ADMIN'] },
  { path: '/analytics',        icon: BarChart2,       label: 'Analítica',        roles: ['ROLE_ADMIN','ROLE_SUPER_ADMIN'] },
  { path: '/admin-management', icon: UserCog,         label: 'Administradores',  roles: ['ROLE_SUPER_ADMIN'] },
  { path: '/system-config',    icon: Settings,        label: 'Config. Sistema',  roles: ['ROLE_SUPER_ADMIN'] },
]

export default function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const visible = menuItems.filter(item =>
    user?.role && item.roles.includes(user.role as any)
  )

  const currentLabel = visible.find(
    i => i.path === location.pathname)?.label ?? 'ROOM_911'

  return (
    <div style={{ display:'flex', height:'100vh',
      backgroundColor:'#f8f9fa', overflow:'hidden' }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: 256, backgroundColor: '#0d47a1',
        color: 'white', display: 'flex',
        flexDirection: 'column', flexShrink: 0,
      }}>
        {/* Logo */}
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

        {/* Nav */}
        <nav style={{
          flex: 1, padding: '16px 12px', overflowY: 'auto',
        }}>
          {visible.map(item => {
            const Icon = item.icon
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

          <div style={{
            borderTop: '1px solid #1565c0', marginTop: 12, paddingTop: 12,
          }}>
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

        {/* Footer */}
        <div style={{
          padding: '12px 16px', borderTop: '1px solid #1565c0',
        }}>
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: 8, padding: '8px 12px',
          }}>
            <div style={{ fontSize: 11, fontWeight: 600 }}>
              Laboratorios XYZ
            </div>
            <div style={{ fontSize: 10, opacity: 0.6 }}>
              Medicamentos de Alto Costo
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
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
            <div style={{ fontSize: 11, color: '#546e7a' }}>
              Laboratorios XYZ
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button style={{
              position: 'relative', background: 'none',
              border: 'none', cursor: 'pointer',
              padding: 8, color: '#546e7a',
            }}>
              <Bell size={20} />
              <span style={{
                position: 'absolute', top: 6, right: 6,
                width: 8, height: 8, backgroundColor: '#d32f2f',
                borderRadius: '50%',
              }} />
            </button>

            <div style={{ position: 'relative' }}>
              <button onClick={() => setUserMenuOpen(v => !v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 10px', borderRadius: 8,
                  border: 'none', cursor: 'pointer',
                  backgroundColor: 'transparent',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={e =>
                  (e.currentTarget as HTMLElement)
                    .style.backgroundColor = '#f8f9fa'}
                onMouseLeave={e =>
                  (e.currentTarget as HTMLElement)
                    .style.backgroundColor = 'transparent'}
              >
                <div style={{
                  width: 32, height: 32, backgroundColor: '#0d47a1',
                  borderRadius: '50%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: 12, fontWeight: 700,
                }}>
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{
                    fontSize: 13, fontWeight: 500, color: '#1a1d29',
                  }}>
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div style={{ fontSize: 11, color: '#546e7a' }}>
                    {user?.role === 'ROLE_SUPER_ADMIN'
                      ? 'Super Admin' : 'Administrador'}
                  </div>
                </div>
                <ChevronDown size={14} color="#546e7a" />
              </button>

              {userMenuOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: '100%',
                  marginTop: 4, width: 180, backgroundColor: 'white',
                  border: '1px solid #e0e0e0', borderRadius: 10,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)', zIndex: 50,
                  overflow: 'hidden',
                }}>
                  <button onClick={() => {
                    navigate('/settings')
                    setUserMenuOpen(false)
                  }} style={{
                    width: '100%', padding: '10px 16px',
                    textAlign: 'left', border: 'none',
                    cursor: 'pointer', fontSize: 13,
                    backgroundColor: 'transparent', color: '#1a1d29',
                  }}
                  onMouseEnter={e =>
                    (e.currentTarget as HTMLElement)
                      .style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={e =>
                    (e.currentTarget as HTMLElement)
                      .style.backgroundColor = 'transparent'}
                  >
                    Mi Perfil
                  </button>
                  <div style={{
                    borderTop: '1px solid #e0e0e0',
                  }} />
                  <button onClick={() => {
                    logout()
                    navigate('/login')
                  }} style={{
                    width: '100%', padding: '10px 16px',
                    textAlign: 'left', border: 'none',
                    cursor: 'pointer', fontSize: 13,
                    backgroundColor: 'transparent', color: '#d32f2f',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}
                  onMouseEnter={e =>
                    (e.currentTarget as HTMLElement)
                      .style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={e =>
                    (e.currentTarget as HTMLElement)
                      .style.backgroundColor = 'transparent'}
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
        <main style={{
          flex: 1, overflowY: 'auto', padding: 24,
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}