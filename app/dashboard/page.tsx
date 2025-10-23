"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Calendar, MapPin, Users, Search, LogOut, User } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/lib/auth-context"
import { eventApi } from "@/lib/api"

interface Event {
  _id: string
  title: string
  description: string
  category: string
  date: string
  venue: string
  attendees: any[]
  createdBy: { name: string; email: string }
}

export default function Dashboard() {
  const [events, setEvents] = useState<Event[]>([])
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [loading, setLoading] = useState(true)
  const { user, logout } = useAuth()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await eventApi.getAll()
      if (response.data) {
        setEvents(response.data)
        // Extract registered events from user profile
        if (user?.registeredEvents) {
          setRegisteredEvents(user.registeredEvents.map((e: any) => (typeof e === "string" ? e : e._id)))
        }
      }
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (eventId: string) => {
    try {
      const response = await eventApi.register(eventId)
      if (response.data) {
        setRegisteredEvents([...registeredEvents, eventId])
      }
    } catch (error) {
      console.error("Error registering:", error)
    }
  }

  const handleUnregister = async (eventId: string) => {
    try {
      const response = await eventApi.unregister(eventId)
      if (response.data) {
        setRegisteredEvents(registeredEvents.filter((id) => id !== eventId))
      }
    } catch (error) {
      console.error("Error unregistering:", error)
    }
  }

  const handleLogout = () => {
    logout()
    window.location.href = "/"
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ["all", ...new Set(events.map((e) => e.category))]

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-background">
        {/* Header */}
        <nav className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            >
              EventHub
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span>{user?.name || "Student"}</span>
              </div>
              <Link href={"/dashboard/calendar"} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Calendar</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Page Title */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-2">Discover Events</h1>
            <p className="text-muted-foreground">Find and register for events happening on campus</p>
          </div>

          {/* Search and Filter */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Events Grid */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading events...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No events found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => {
                const isRegistered = registeredEvents.includes(event._id)
                const eventDate = new Date(event.date)
                const formattedDate = eventDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })

                return (
                  <Card
                    key={event._id}
                    className="overflow-hidden hover:border-primary/50 transition-colors flex flex-col"
                  >
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="mb-4">
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full capitalize">
                          {event.category}
                        </span>
                      </div>

                      <h3 className="text-xl font-semibold text-foreground mb-2 line-clamp-2">{event.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">{event.description}</p>

                      <div className="space-y-2 mb-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{event.venue}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{event.attendees.length} attending</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {isRegistered ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUnregister(event._id)}
                            className="flex-1"
                          >
                            Unregister
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                          onClick={() => handleRegister(event._id)}
                            className="flex-1 bg-primary hover:bg-primary/90"
                          >
                            Register
                          </Button>
                        )}
                        <Link href={`/events/${event._id}`}>
                          <Button variant="outline" size="sm">
                            Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  )
}
