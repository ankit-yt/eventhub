"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowLeft, Trash2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { eventApi, resourceApi } from "@/lib/api"
import { ProtectedRoute } from "@/components/protected-route"

interface Event {
  _id: string
  title: string
  description: string
  category: string
  date: string
  venue: string
  bannerUrl?: string
}

export default function EditEvent() {
  const params = useParams()
  const eventId = params.id as string
  const [formData, setFormData] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [calendarEventId, setCalendarEventId] = useState(null)

  useEffect(() => {
    fetchEvent()
    fetchCalendarEvent(eventId)
    console.log("Event ID for calendar fetch:", calendarEventId)
  }, [eventId,calendarEventId])


  const fetchCalendarEvent = async (eventId)=>{
    const res = await resourceApi.calendar.getId(eventId);
    if (res.data) {
      console.log("Fetched calendar event data:", res.data._id);
      setCalendarEventId(res.data._id);
    }
  }

  const fetchEvent = async () => {
    try {
      const response = await eventApi.getById(eventId)
      if (response.data) {
        setFormData(response.data)
      } else {
        setError("Failed to load event")
      }
    } catch (err) {
      setError("Failed to load event")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!formData) return
    const { name, value } = e.target
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    setError("")
    setSaving(true)

    try {
      const response = await eventApi.update(eventId, formData)
      if (response.error) {
        setError(response.error)
      } else {
        setSuccess(true)
        setTimeout(() => {
          window.location.href = "/admin"
        }, 1500)
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event?")) return

    try {
      const response = await eventApi.delete(eventId)
      await resourceApi.calendar.delete(calendarEventId as any)
      if (response.error) {
        setError("Failed to delete event")
      } else {
        router.push("/admin")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    }
  }

  if (loading) {
    return (
        <main className="min-h-screen bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <p className="text-muted-foreground">Loading event...</p>
          </div>
        </main>
    )
  }

  if (!formData) {
    return (
        <main className="min-h-screen bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <p className="text-muted-foreground">Event not found</p>
          </div>
        </main>
    )
  }

  return (
      <main className="min-h-screen bg-background">
        {/* Header */}
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

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Edit Event</h1>
            <p className="text-muted-foreground">Update event details</p>
          </div>

          <Card className="p-8 border border-border">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-600 text-sm">
                  Event updated successfully! Redirecting...
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Event Title</label>
                <Input type="text" name="title" value={formData.title} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="workshop">Workshop</option>
                    <option value="seminar">Seminar</option>
                    <option value="networking">Networking</option>
                    <option value="sports">Sports</option>
                    <option value="cultural">Cultural</option>
                    <option value="tech">Tech</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Date & Time</label>
                  <Input
                    type="datetime-local"
                    name="date"
                    value={formData.date.slice(0, 16)}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Venue</label>
                <Input type="text" name="venue" value={formData.venue} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Banner Image URL</label>
                <Input type="url" name="bannerUrl" value={formData.bannerUrl || ""} onChange={handleChange} />
              </div>

              <div className="flex gap-4 pt-6">
                <Button type="submit" size="lg" className="flex-1 bg-primary hover:bg-primary/90" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button type="button" variant="destructive" size="lg" onClick={handleDelete} className="gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>
  )
}
