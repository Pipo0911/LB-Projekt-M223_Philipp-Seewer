import { createContext, useContext, useState, useEffect } from 'react'

const API_URL = 'http://localhost:8080/api/auth'

/* implements React's Context API for Login fun in entire application. */
const AuthContext = createContext()

/*
Custom hook to access the authentication context.
Creates a context that will hold authentication state and methods
*/
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO 1: load existing user data from local storage on mount
    const saved = localStorage.getItem('user')
    if (saved) {
      setUser(JSON.parse(saved))
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    setLoading(true)
    // TODO 2: Login implementieren
    const res = await fetch(`${API_URL}/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      setLoading(false)
      throw new Error(err.message || 'Login fehlgeschlagen')
    }
    const userData = await res.json()
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    setLoading(false)
  }

  const register = async (name, email, password) => {
    setLoading(true)
    // TODO 3: Registrierung implementieren
    const res = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      setLoading(false)
      throw new Error(err.message || 'Registrierung fehlgeschlagen')
    }
    setLoading(false)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const getToken = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    return user ? user.token : null
  }

  const value = {
    user,
    login,
    register,
    logout,
    getToken,
    loading,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
