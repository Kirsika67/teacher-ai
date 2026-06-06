import { createContext, useContext, useState, useEffect } from 'react'
import { apiCall } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [teacher, setTeacher] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('eduai_token')
    if (!token) { setLoading(false); return }
    apiCall('/api/auth/me')
      .then(data => setTeacher(data.teacher))
      .catch(() => localStorage.removeItem('eduai_token'))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const data = await apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    localStorage.setItem('eduai_token', data.token)
    setTeacher(data.teacher)
    return data
  }

  const register = async (name, email, password) => {
    const data = await apiCall('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    })
    localStorage.setItem('eduai_token', data.token)
    setTeacher(data.teacher)
    return data
  }

  const logout = () => {
    localStorage.removeItem('eduai_token')
    setTeacher(null)
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ teacher, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth peab olema AuthProvider sees')
  return ctx
}
