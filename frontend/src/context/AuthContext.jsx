import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)
const TOKEN_KEY = 'paystride_token'
const USER_KEY = 'paystride_user'

export function AuthProvider({ children }) {
  // Clear any older persistent login so users must sign in explicitly.
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)

  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem(USER_KEY)
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })

  const [token, setToken] = useState(() =>
    sessionStorage.getItem(TOKEN_KEY) || null
  )

  const isAuthenticated = !!token && !!user

  function login(userData, tokenValue) {
    setUser(userData)
    setToken(tokenValue)
    sessionStorage.setItem(TOKEN_KEY, tokenValue)
    sessionStorage.setItem(USER_KEY, JSON.stringify(userData))
  }

  function logout() {
    const nextPath = user?.role === 'WORKER' ? '/worker-login' : '/login'
    setUser(null)
    setToken(null)
    sessionStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(USER_KEY)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    window.location.href = nextPath
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export default AuthContext
