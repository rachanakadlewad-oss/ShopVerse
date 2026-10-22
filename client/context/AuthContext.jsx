"use client"
import { createContext, useContext, useState, useEffect } from "react"
import API from "../lib/axios"

export const AuthContext = createContext(null)

function readStoredUser() {
  if (typeof window === "undefined") return null
  try {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) return null
    const parsed = JSON.parse(storedUser)
    if (!parsed?.token) {
      localStorage.removeItem("user")
      return null
    }
    return parsed
  } catch {
    localStorage.removeItem("user")
    return null
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setUser(readStoredUser())
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const { data } = await API.post("/auth/login", { email, password })
    localStorage.setItem("user", JSON.stringify(data))
    setUser(data)
    return data
  }

  const register = async (name, email, password) => {
    const { data } = await API.post("/auth/register", {
      name,
      email,
      password
    })
    localStorage.setItem("user", JSON.stringify(data))
    setUser(data)
    return data
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
