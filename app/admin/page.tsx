"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Plus, LogOut, Users, Calendar, TrendingUp, Eye, Package, Users2 } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { eventApi, userApi, resourceApi } from "@/lib/api"

interface Event {
  _id: string
  title: string
  description: string
  category: string
  date: string
  venue: string
  attendees: any[]
  createdBy: { name: string }
}

interface AnalyticsData {
  totalEvents: number
  totalAttendees: number
  totalRegistrations: number
  averageAttendance: number
  eventsByCategory: { name: string; value: number }[]
  registrationTrend: { date: string; registrations: number }[]
}

export default function AdminDashboard() {
  const [events, setEvents] = useState<Event[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [resourceStats, setResourceStats] = useState({
    totalVenues: 0,
    totalEquipment: 0,
    totalPersonnel: 0,
    scheduledEvents: 0,
  })

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      window.location.href = "/login"
      return
    }

    fetchUserProfile(token)
    fetchEvents(token)
    fetchResourceStats()
  }, [])

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await userApi.getProfile()
      if (response.data) {
        if (response.data.role !== "admin") {
          window.location.href = "/dashboard"
        }
        setUser(response.data)
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  }

  const fetchEvents = async (token: string) => {
    try {
      setLoading(true)
      const response = await eventApi.getAll()
      if (response.data) {
        setEvents(response.data)
        await calculateAnalytics(response.data)
      }
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchResourceStats = async () => {
    try {
      const [venuesRes, equipmentRes, personnelRes, calendarRes] = await Promise.all([
        resourceApi.venues.getAll(),
        resourceApi.equipment.getAll(),
        resourceApi.personnel.getAll(),
        resourceApi.calendar.getAll(),
      ])

      setResourceStats({
        totalVenues: venuesRes.data?.length || 0,
        totalEquipment: equipmentRes.data?.length || 0,
        totalPersonnel: personnelRes.data?.length || 0,
        scheduledEvents: calendarRes.data?.length || 0,
      })
    } catch (error) {
      console.error("Error fetching resource stats:", error)
    }
  }

  const calculateAnalytics = async (eventsList: Event[]) => {
    const totalEvents = eventsList.length
    const totalAttendees = new Set(eventsList.flatMap((e) => e.attendees.map((a) => a.userId?._id || a._id))).size
    const totalRegistrations = eventsList.reduce((sum, e) => sum + e.attendees.length, 0)
    const averageAttendance = totalEvents > 0 ? Math.round(totalRegistrations / totalEvents) : 0

    // Events by category
    const categoryMap = new Map<string, number>()
    eventsList.forEach((event) => {
      categoryMap.set(event.category, (categoryMap.get(event.category) || 0) + 1)
    })
    const eventsByCategory = Array.from(categoryMap).map(([name, value]) => ({ name, value }))

    let registrationTrend = []
    const trendResponse = await eventApi.getRegistrationTrend()
    if (trendResponse.data) {
      registrationTrend = trendResponse.data
    }

    setAnalytics({
      totalEvents,
      totalAttendees,
      totalRegistrations,
      averageAttendance,
      eventsByCategory,
      registrationTrend,
    })
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.href = "/"
  }

  const COLORS = ["#8b5cf6", "#f97316", "#06b6d4", "#ec4899", "#10b981"]

  return (
    <ProtectedRoute requiredRole="admin">
      <main className="min-h-screen bg-background">
        {/* Header */}
        <nav className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            >
              EventHub Admin
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{user?.name}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </nav>

        {/* Sidebar Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-4 mb-8 border-b border-border pb-4 overflow-x-auto">
            <Button
              variant={activeTab === "overview" ? "default" : "ghost"}
              onClick={() => setActiveTab("overview")}
              className="gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Overview
            </Button>
            <Button
              variant={activeTab === "events" ? "default" : "ghost"}
              onClick={() => setActiveTab("events")}
              className="gap-2"
            >
              <Calendar className="w-4 h-4" />
              Events
            </Button>
            <Button
              variant={activeTab === "calendar" ? "default" : "ghost"}
              onClick={() => setActiveTab("calendar")}
              className="gap-2"
            >
              <Calendar className="w-4 h-4" />
              Calendar
            </Button>
            <Button
              variant={activeTab === "resources" ? "default" : "ghost"}
              onClick={() => setActiveTab("resources")}
              className="gap-2"
            >
              <Package className="w-4 h-4" />
              Resources
            </Button>
            <Button
              variant={activeTab === "users" ? "default" : "ghost"}
              onClick={() => setActiveTab("users")}
              className="gap-2"
            >
              <Users className="w-4 h-4" />
              Users
            </Button>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-6 border border-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Events</p>
                      <p className="text-3xl font-bold text-foreground">{analytics?.totalEvents || 0}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-primary opacity-20" />
                  </div>
                </Card>

                <Card className="p-6 border border-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Registrations</p>
                      <p className="text-3xl font-bold text-foreground">{analytics?.totalRegistrations || 0}</p>
                    </div>
                    <Users className="w-8 h-8 text-accent opacity-20" />
                  </div>
                </Card>

                <Card className="p-6 border border-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Unique Attendees</p>
                      <p className="text-3xl font-bold text-foreground">{analytics?.totalAttendees || 0}</p>
                    </div>
                    <Users className="w-8 h-8 text-primary opacity-20" />
                  </div>
                </Card>

                <Card className="p-6 border border-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Avg. Attendance</p>
                      <p className="text-3xl font-bold text-foreground">{analytics?.averageAttendance || 0}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-accent opacity-20" />
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-6 border border-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Venues</p>
                      <p className="text-3xl font-bold text-foreground">{resourceStats.totalVenues}</p>
                    </div>
                    <Package className="w-8 h-8 text-primary opacity-20" />
                  </div>
                </Card>

                <Card className="p-6 border border-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Equipment</p>
                      <p className="text-3xl font-bold text-foreground">{resourceStats.totalEquipment}</p>
                    </div>
                    <Package className="w-8 h-8 text-accent opacity-20" />
                  </div>
                </Card>

                <Card className="p-6 border border-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Personnel</p>
                      <p className="text-3xl font-bold text-foreground">{resourceStats.totalPersonnel}</p>
                    </div>
                    <Users2 className="w-8 h-8 text-primary opacity-20" />
                  </div>
                </Card>

                <Card className="p-6 border border-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Scheduled Events</p>
                      <p className="text-3xl font-bold text-foreground">{resourceStats.scheduledEvents}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-accent opacity-20" />
                  </div>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Registration Trend */}
                <Card className="p-6 border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Registration Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics?.registrationTrend || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
                      <YAxis stroke="var(--color-muted-foreground)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--color-card)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "8px",
                        }}
                      />
                      <Line type="monotone" dataKey="registrations" stroke="var(--color-primary)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                {/* Events by Category */}
                <Card className="p-6 border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Events by Category</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics?.eventsByCategory || []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {analytics?.eventsByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--color-card)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === "events" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Manage Events</h2>
                <Link href="/admin/create-event">
                  <Button className="gap-2 bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4" />
                    Create Event
                  </Button>
                </Link>
              </div>

              {loading ? (
                <p className="text-muted-foreground">Loading events...</p>
              ) : events.length === 0 ? (
                <p className="text-muted-foreground">No events created yet</p>
              ) : (
                <div className="space-y-4">
                  {events.map((event) => (
                    <Card
  key={event._id}
  className="p-4 md:p-6 border border-border hover:border-primary/50 transition-colors flex flex-col md:flex-row md:justify-between gap-4"
>
  <div className="flex-1">
    <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">{event.title}</h3>
    <p className="text-sm text-muted-foreground mb-2 line-clamp-3">{event.description}</p>
    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
      <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded capitalize text-xs font-semibold">
        {event.category}
      </span>
      <span>{new Date(event.date).toLocaleDateString()}</span>
      <span>{event.venue}</span>
      <span className="flex items-center gap-1">
        <Users className="w-4 h-4" /> {event.attendees.length} attendees
      </span>
    </div>
  </div>
  <div className="flex flex-wrap gap-2">
    <Link href={`/admin/edit-event/${event._id}`}>
      <Button variant="outline" size="sm" className="flex-1 md:flex-none w-full md:w-auto">
        Edit
      </Button>
    </Link>
    <Link href={`/admin/events/${event._id}/attendees`}>
      <Button variant="outline" size="sm" className="flex-1 md:flex-none w-full md:w-auto gap-2">
        <Eye className="w-4 h-4" /> Attendees
      </Button>
    </Link>
  </div>
</Card>

                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "calendar" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Event Calendar & Scheduling</h2>
                <Link href="/admin/calendar">
                  <Button className="gap-2 bg-primary hover:bg-primary/90">
                    <Calendar className="w-4 h-4" />
                    View Full Calendar
                  </Button>
                </Link>
              </div>
              <Card className="p-6 border border-border">
                <p className="text-muted-foreground mb-4">
                  Manage your event calendar, schedule seminars, guest lectures, and festivals. Allocate venues and
                  coordinate resources for smooth event execution.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/admin/calendar">
                    <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                      <Calendar className="w-4 h-4" />
                      View Calendar
                    </Button>
                  </Link>
                  <Link href="/admin/calendar/schedule">
                    <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                      <Plus className="w-4 h-4" />
                      Schedule New Event
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "resources" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Resource Management</h2>
                <Link href="/admin/resources">
                  <Button className="gap-2 bg-primary hover:bg-primary/90">
                    <Package className="w-4 h-4" />
                    Manage Resources
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-6 border border-border hover:border-primary/50 transition-colors">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Venues</h3>
                  <p className="text-3xl font-bold text-primary mb-4">{resourceStats.totalVenues}</p>
                  <Link href="/admin/resources">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      Manage Venues
                    </Button>
                  </Link>
                </Card>

                <Card className="p-6 border border-border hover:border-accent/50 transition-colors">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Equipment</h3>
                  <p className="text-3xl font-bold text-accent mb-4">{resourceStats.totalEquipment}</p>
                  <Link href="/admin/resources">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      Manage Equipment
                    </Button>
                  </Link>
                </Card>

                <Card className="p-6 border border-border hover:border-primary/50 transition-colors">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Personnel</h3>
                  <p className="text-3xl font-bold text-primary mb-4">{resourceStats.totalPersonnel}</p>
                  <Link href="/admin/personnel">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      Manage Personnel
                    </Button>
                  </Link>
                </Card>
              </div>

              <Card className="p-6 border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Link href="/admin/resources/venues/new">
                    <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                      <Plus className="w-4 h-4" />
                      Add Venue
                    </Button>
                  </Link>
                  <Link href="/admin/resources/equipment/new">
                    <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                      <Plus className="w-4 h-4" />
                      Add Equipment
                    </Button>
                  </Link>
                  <Link href="/admin/personnel/new">
                    <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                      <Plus className="w-4 h-4" />
                      Add Personnel
                    </Button>
                  </Link>
                  <Link href="/admin/calendar/schedule">
                    <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                      <Calendar className="w-4 h-4" />
                      Schedule Event
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">User Management</h2>
                <Link href="/admin/users">
                  <Button className="gap-2 bg-primary hover:bg-primary/90">
                    <Users className="w-4 h-4" />
                    View All Users
                  </Button>
                </Link>
              </div>
              <Card className="p-6 border border-border">
                <p className="text-muted-foreground">Click the button above to view and manage all registered users</p>
              </Card>
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  )
}
