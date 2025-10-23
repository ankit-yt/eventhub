"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Users, Mail, Calendar } from "lucide-react"
import { userApi } from "@/lib/api"
import { ProtectedRoute } from "@/components/protected-route"

interface User {
  _id: string
  name: string
  email: string
  role: string
  avatar?: string
  registeredEvents: any[]
  createdAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError("")
      console.log("[v0] Fetching users...")
      const response = await userApi.getAll()
      console.log("[v0] Users response:", response)

      if (response.data) {
        setUsers(response.data)
      } else {
        const errorMsg = response.error || "Failed to fetch users"
        console.error("[v0] Users fetch error:", errorMsg)
        setError(errorMsg)
      }
    } catch (err) {
      const errorMsg = "An error occurred while fetching users"
      console.error("[v0] Users exception:", err)
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
      <main className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Admin
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">User Management</h1>
            <p className="text-muted-foreground">View and manage all registered users in the system</p>
          </div>

          {error && (
            <Card className="p-4 mb-6 border border-destructive/20 bg-destructive/10">
              <p className="text-destructive text-sm">{error}</p>
            </Card>
          )}

          {loading ? (
            <Card className="p-8 border border-border text-center">
              <p className="text-muted-foreground">Loading users...</p>
            </Card>
          ) : users.length === 0 ? (
            <Card className="p-8 border border-border text-center">
              <p className="text-muted-foreground">No users found</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card className="p-6 border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                      <p className="text-3xl font-bold text-foreground">{users.length}</p>
                    </div>
                    <Users className="w-8 h-8 text-primary opacity-20" />
                  </div>
                </Card>

                <Card className="p-6 border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Students</p>
                      <p className="text-3xl font-bold text-foreground">
                        {users.filter((u) => u.role === "student").length}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-accent opacity-20" />
                  </div>
                </Card>

                <Card className="p-6 border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Admins</p>
                      <p className="text-3xl font-bold text-foreground">
                        {users.filter((u) => u.role === "admin").length}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-primary opacity-20" />
                  </div>
                </Card>
              </div>

              {/* Users Table */}
              <Card className="border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50 border-b border-border">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Email</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Role</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Events Registered</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {users.map((user) => (
                        <tr key={user._id} className="hover:bg-muted/50 transition-colors">
                          <td className="px-6 py-4 text-sm text-foreground font-medium">{user.name}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {user.email}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                                user.role === "admin" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-foreground">{user.registeredEvents?.length || 0}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>
  )
}
