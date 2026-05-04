import React, { createContext, useContext,
  useState, useEffect, useCallback } from 'react'
import type { CurrentUser, AuthResponse } from '../types'

interface AuthContextValue {
  user: CurrentUser | null
  token: string | null
  isAuthenticated: boolean
  login: (authResponse: AuthResponse) => void
  logout: () => void
  updateUser: (data: Partial<CurrentUser>) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,  setUser]  = useState<CurrentUser | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const savedToken = localStorage.getItem('room911_token')
    const savedUser  = localStorage.getItem('room911_user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = useCallback((res: AuthResponse) => {
    const u: CurrentUser = {
      id: res.id, email: res.email,
      firstName: res.firstName, lastName: res.lastName,
      role: res.role, departmentId: res.departmentId,
      departmentName: res.departmentName, avatarUrl: res.avatarUrl,
    }
    localStorage.setItem('room911_token', res.token)
    localStorage.setItem('room911_user',  JSON.stringify(u))
    setToken(res.token)
    setUser(u)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('room911_token')
    localStorage.removeItem('room911_user')
    setToken(null)
    setUser(null)
  }, [])

  const updateUser = useCallback((data: Partial<CurrentUser>) => {
    setUser(prev => {
      if (!prev) return prev
      const updated = { ...prev, ...data }
      localStorage.setItem('room911_user', JSON.stringify(updated))
      return updated
    })
  }, [])

  return (
    <AuthContext.Provider value={{
      user, token,
      isAuthenticated: !!token && !!user,
      login, logout, updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}