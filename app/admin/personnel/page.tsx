"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { resourceApi } from "@/lib/api"
import { Plus, Edit2, Trash2, Mail, Phone, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface Personnel {
  _id: string
  name: string
  role: string
  email: string
  phone: string
  skills: string[]
  assignments: any[]
}

export default function PersonnelPage() {
  const [personnel, setPersonnel] = useState<Personnel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPersonnel()
  }, [])

  const fetchPersonnel = async () => {
    setLoading(true)
    const response = await resourceApi.personnel.getAll()
    if (response.data) {
      setPersonnel(response.data)
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this personnel?")) {
      await resourceApi.personnel.delete(id)
      fetchPersonnel()
    }
  }

  const roleColors: Record<string, string> = {
    Coordinator: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    Volunteer: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    Staff: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    Security: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    "Technical Support": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  }

  return (
    <div className="space-y-8 p-10 animate-fade-in">

     

      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-background via-background/80 to-background/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-sm">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Personnel Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your team members, roles, and assignments effortlessly.
          </p>
        </div>
        <div className="flex gap-5">
            <Link href="/admin/personnel/new">
          <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-all rounded-xl shadow-lg hover:shadow-primary/30">
            <Plus className="w-4 h-4" />
            Add Personnel
          </Button>
        </Link>
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
      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground animate-pulse">
          Loading personnel...
        </div>
      ) : personnel.length === 0 ? (
        <Card className="p-12 text-center border border-border/60 bg-muted/30 backdrop-blur-md rounded-2xl">
          <p className="text-muted-foreground">No personnel added yet</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {personnel.map((person, idx) => (
            <motion.div
              key={person._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="group relative overflow-hidden p-6 border border-border/60 bg-gradient-to-br from-background via-background/60 to-muted/30 backdrop-blur-md hover:border-primary/40 transition-all duration-300 rounded-2xl shadow-sm hover:shadow-lg">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {person.name}
                    </h3>
                    <span
                      className={`inline-block text-xs font-medium px-2 py-1 mt-2 rounded-full ${roleColors[person.role]}`}
                    >
                      {person.role}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/personnel/${person._id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-primary/10 transition-colors rounded-full"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-destructive/10 transition-colors rounded-full"
                      onClick={() => handleDelete(person._id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${person.email}`} className="hover:text-primary">
                      {person.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <a href={`tel:${person.phone}`} className="hover:text-primary">
                      {person.phone}
                    </a>
                  </div>

                  {person.skills.length > 0 && (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-1">
                        Skills
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {person.skills.map((skill) => (
                          <span
                            key={skill}
                            className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {person.assignments.length > 0 && (
                    <div className="pt-2 border-t border-border/40">
                      <p className="text-xs text-muted-foreground">
                        Assigned to{" "}
                        <span className="font-medium text-foreground">
                          {person.assignments.length} event
                          {person.assignments.length !== 1 ? "s" : ""}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
