"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Users, Mail, Calendar } from "lucide-react"
import { useParams } from "next/navigation"
import { eventApi } from "@/lib/api"

interface Attendee {
  _id: string
  name: string
  email: string
  role: string
  createdAt: string
}

interface AttendeeData {
  eventId: string
  eventTitle: string
  eventDate: string
  totalAttendees: number
  attendees: Attendee[]
}

export default function EventAttendeesPage() {
  const params = useParams()
  const eventId = params.id as string
  const [data, setData] = useState<AttendeeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchAttendees()
  }, [eventId])

  const fetchAttendees = async () => {
    try {
      setLoading(true)
      const response = await eventApi.getAttendees(eventId)
      if (response.data) setData(response.data)
      else setError(response.error || "Failed to fetch attendees")
    } catch (err) {
      setError("An error occurred while fetching attendees")
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
        {loading ? (
          <Card className="p-8 border border-border text-center">
            <p className="text-muted-foreground">Loading attendees...</p>
          </Card>
        ) : error ? (
          <Card className="p-8 border border-destructive/20 bg-destructive/10">
            <p className="text-destructive text-sm">{error}</p>
          </Card>
        ) : data ? (
          <div className="space-y-8">
            {/* Event Info */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 break-words">
                {data.eventTitle}
              </h1>
              <p className="text-muted-foreground flex items-center gap-2 flex-wrap">
                <Calendar className="w-4 h-4" />
                {new Date(data.eventDate).toLocaleDateString()}
              </p>
            </div>

            {/* Attendee Stats */}
            <Card className="p-6 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Attendees</p>
                  <p className="text-3xl font-bold text-foreground">{data.totalAttendees}</p>
                </div>
                <Users className="w-8 h-8 text-primary opacity-20" />
              </div>
            </Card>

            {/* Attendees List */}
            {data.totalAttendees === 0 ? (
              <Card className="p-8 border border-border text-center">
                <p className="text-muted-foreground">No attendees registered for this event yet</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* For Desktop */}
                <Card className="hidden md:block border border-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                      <thead className="bg-muted/50 border-b border-border">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Email</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Role</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Registered On</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {data.attendees.map((attendee) => (
                          <tr key={attendee._id} className="hover:bg-muted/50 transition-colors">
                            <td className="px-6 py-4 text-sm text-foreground font-medium">{attendee.name}</td>
                            <td className="px-6 py-4 text-sm text-muted-foreground flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              {attendee.email}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                                  attendee.role === "admin"
                                    ? "bg-primary/10 text-primary"
                                    : "bg-accent/10 text-accent"
                                }`}
                              >
                                {attendee.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-muted-foreground">
                              {new Date(attendee.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* For Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
                  {data.attendees.map((attendee) => (
                    <Card key={attendee._id} className="p-4 border border-border">
                      <p className="font-semibold text-foreground">{attendee.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2 break-all">
                        <Mail className="w-4 h-4" />
                        {attendee.email}
                      </p>
                      <p className="text-xs mt-1">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                            attendee.role === "admin"
                              ? "bg-primary/10 text-primary"
                              : "bg-accent/10 text-accent"
                          }`}
                        >
                          {attendee.role}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(attendee.createdAt).toLocaleDateString()}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </main>
  )
}
