"use client"
import { createContext, useState, useEffect } from "react"
import API from "../lib/axios"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) setUser(JSON.parse(storedUser))
  }, [])

  const login = async (email, password) => {
    const { data } = await API.post("/auth/login", { email, password })
    localStorage.setItem("user", JSON.stringify(data))
    setUser(data)
  }

  const register = async (name, email, password) => {
    const { data } = await API.post("/auth/register", {
      name,
      email,
      password
    })
    localStorage.setItem("user", JSON.stringify(data))
    setUser(data)
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}