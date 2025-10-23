"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "admin" | "student"
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  console.log("chaiuiuyiuyiula")
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log(isAuthenticated)
    if (!loading && !isAuthenticated) {
      console.log("no authenticated")
      router.push("/login")
    }

    if (!loading && isAdmin) {
      router.push("/admin")
    }else if(requiredRole === 'student'){
      router.push("/dashoard")
    }
  }, [isAuthenticated, isAdmin, loading, requiredRole, router])



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }
  if (!isAuthenticated) {
    return null
  }

  if (requiredRole === "admin" && !isAdmin) {
    return null
  }
  

console.log("protected")
  return <>{children}</>
}
