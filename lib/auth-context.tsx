"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authApi, userApi } from "./api"

interface User {
  id: string
  name: string
  email: string
  role: "student" | "admin"
  registeredEvents?: string[]
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setToken(storedToken)
      fetchUserProfile(storedToken)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUserProfile = async (authToken: string) => {
    try {
      const response = await userApi.getProfile()
      if (response.data) {
        setUser(response.data)
      } else {
        // Token invalid, clear it
        localStorage.removeItem("token")
        setToken(null)
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      console.log("auth")
      const response = await authApi.login(email, password)
      if (response.error) {
        throw new Error(response.error)
      }

      const data = response.data as any
      localStorage.setItem("token", data.token)
      setToken(data.token)
      setUser(data.user)
    } catch (error) {
      throw error
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await authApi.signup(name, email, password)
      if (response.error) {
        throw new Error(response.error)
      }

      const data = response.data as any
      localStorage.setItem("token", data.token)
      setToken(data.token)
      setUser(data.user)
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!token,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
