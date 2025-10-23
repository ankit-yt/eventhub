"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { resourceApi, eventApi } from "@/lib/api"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ScheduleEventPage() {
  const router = useRouter()
  const [events, setEvents] = useState<any[]>([])
  const [venues, setVenues] = useState<any[]>([])
  const [formData, setFormData] = useState({
    eventId: "",
    venueId: "",
    status: "Planned",
    notes: "",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const [eventsRes, venuesRes] = await Promise.all([eventApi.getAll(), resourceApi.venues.getAll()])
    console.log("Events Response:", eventsRes)
    console.log("Venues Response:", venuesRes)
    if (eventsRes.data) setEvents(eventsRes.data)
    if (venuesRes.data) setVenues(venuesRes.data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const response = await resourceApi.calendar.create(formData)
    if (response.data) {
      router.push("/admin/calendar")
    } else {
      alert("Error scheduling event: " + response.error)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl p-10 mx-auto space-y-6">
       <div className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Admin
            </Link>
          </div>
        </div>
      <h1 className="text-3xl font-bold text-foreground">Schedule Event</h1>

      <Card className="p-6 border border-border">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Event</label>
            <select
              value={formData.eventId}
              onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              required
            >
              <option value="">Select an event</option>
              {events.map((event) => (
                <option key={event._id} value={event._id}>
                  {event.title} - {new Date(event.date).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Venue</label>
            <select
              value={formData.venueId}
              onChange={(e) => setFormData({ ...formData, venueId: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              required
            >
              <option value="">Select a venue</option>
              {venues.map((venue) => (
                <option key={venue._id} value={venue._id}>
                  {venue.name} (Capacity: {venue.capacity})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            >
              <option value="Planned">Planned</option>
              <option value="Confirmed">Confirmed</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              rows={4}
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90">
              {loading ? "Scheduling..." : "Schedule Event"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
