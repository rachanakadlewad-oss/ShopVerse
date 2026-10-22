import axios from "axios"

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
})

API.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config

  try {
    const raw = localStorage.getItem("user")
    if (!raw) return config
    const user = JSON.parse(raw)
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
  } catch {
    localStorage.removeItem("user")
  }

  return config
})

export default API
