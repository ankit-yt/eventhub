"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowLeft, Trash2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { eventApi, resourceApi } from "@/lib/api"

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
  const router = useRouter()

  const [formData, setFormData] = useState<Event | null>(null)
  const [calendarEventId, setCalendarEventId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchEvent()
    fetchCalendarEvent(eventId)
  }, [eventId])

  const fetchCalendarEvent = async (eventId: string) => {
    const res = await resourceApi.calendar.getId(eventId)
    if (res.data) setCalendarEventId(res.data._id)
  }

  const fetchEvent = async () => {
    try {
      const response = await eventApi.getById(eventId)
      if (response.data) setFormData(response.data)
      else setError("Failed to load event")
    } catch {
      setError("Failed to load event")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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
      if (response.error) setError(response.error)
      else {
        setSuccess(true)
        setTimeout(() => router.push("/admin"), 1500)
      }
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event?")) return
    try {
      await eventApi.delete(eventId)
      if (calendarEventId) await resourceApi.calendar.delete(calendarEventId)
      router.push("/admin")
    } catch {
      setError("Failed to delete event")
    }
  }

  if (loading)
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading event...</p>
      </main>
    )

  if (!formData)
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Event not found</p>
      </main>
    )

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

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-2">
            Edit Event
          </h1>
          <p className="text-muted-foreground">Update event details below</p>
        </div>

        <Card className="p-4 sm:p-8 border border-border shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Alerts */}
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

            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Event Title
              </label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                rows={5}
              />
            </div>

            {/* Category & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
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
                <label className="text-sm font-medium text-foreground">
                  Date & Time
                </label>
                <Input
                  type="datetime-local"
                  name="date"
                  value={formData.date.slice(0, 16)}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Venue */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Venue
              </label>
              <Input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                required
              />
            </div>

            {/* Banner URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Banner Image URL
              </label>
              <Input
                type="url"
                name="bannerUrl"
                value={formData.bannerUrl || ""}
                onChange={handleChange}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
              <Button
                type="submit"
                size="lg"
                disabled={saving}
                className="w-full sm:flex-1 bg-primary hover:bg-primary/90"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>

              <Button
                type="button"
                variant="destructive"
                size="lg"
                onClick={handleDelete}
                className="w-full sm:w-auto flex justify-center gap-2"
              >
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
