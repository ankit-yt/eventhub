"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { resourceApi } from "@/lib/api"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

interface CalendarEvent {
  _id: string
  eventId: {
    _id: string
    title: string
    date: string
    venue: string
  }
  venueId: {
    _id: string
    name: string
  }
  status: string
  allocatedEquipment: any[]
  assignedPersonnel: any[]
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9))
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCalendarEvents()
  }, [])

  const fetchCalendarEvents = async () => {
    setLoading(true)
    const response = await resourceApi.calendar.getAll()
    if (response.data) {
      setCalendarEvents(response.data)
    }
    setLoading(false)
  }

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const getEventsForDate = (day: number) =>
    calendarEvents.filter((event) => {
      const eventDate = new Date(event.eventId.date)
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      )
    })

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" })

  const days = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)

  const statusColors: Record<string, string> = {
    Planned: "bg-blue-100 text-blue-800",
    Confirmed: "bg-green-100 text-green-800",
    "In Progress": "bg-yellow-100 text-yellow-800",
    Completed: "bg-gray-100 text-gray-800",
    Cancelled: "bg-red-100 text-red-800",
  }

  return (
    <>
      {/* Top Bar */}
      <div className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Admin</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground text-center sm:text-left">
            Event Calendar
          </h1>
        </div>

        {/* Calendar */}
        <Card className="p-4 sm:p-6 border border-border">
          <div className="space-y-6">
            {/* Calendar Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground">{monthName}</h2>
              <div className="flex justify-center sm:justify-end gap-2">
                <Button variant="outline" size="sm" onClick={previousMonth}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={nextMonth}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 text-xs sm:text-sm">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center font-semibold text-muted-foreground py-1 sm:py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {days.map((day, index) => {
                const dayEvents = day ? getEventsForDate(day) : []
                return (
                  <div
                    key={index}
                    className={`min-h-[70px] sm:min-h-[100px] p-1 sm:p-2 rounded-lg border ${
                      day ? "border-border bg-card hover:bg-card/80 transition-colors" : "border-transparent bg-muted/30"
                    }`}
                  >
                    {day && (
                      <>
                        <div className="font-semibold text-foreground mb-1 text-xs sm:text-sm">{day}</div>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map((event) => (
                            <Link
                              key={event._id}
                              href={`/admin/calendar/${event._id}`}
                              className={`text-[10px] sm:text-xs p-0.5 sm:p-1 rounded truncate block ${
                                statusColors[event.status] || "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {event.eventId.title}
                            </Link>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-[10px] sm:text-xs text-muted-foreground">
                              +{dayEvents.length - 2} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </Card>

        {/* Upcoming Events */}
        <Card className="p-4 sm:p-6 border border-border">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4">Upcoming Events</h2>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">
              Loading events...
            </div>
          ) : calendarEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">
              No scheduled events
            </div>
          ) : (
            <div className="space-y-3">
              {calendarEvents
                .sort((a, b) => new Date(a.eventId.date).getTime() - new Date(b.eventId.date).getTime())
                .slice(0, 5)
                .map((event) => (
                  <Link
                    key={event._id}
                    href={`/admin/calendar/${event._id}`}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-lg border border-border hover:bg-card/50 transition-colors gap-2"
                  >
                    <div>
                      <h3 className="font-semibold text-foreground text-sm sm:text-base">
                        {event.eventId.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {new Date(event.eventId.date).toLocaleDateString()} at {event.venueId.name}
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          )}
        </Card>
      </div>
    </>
  )
}
