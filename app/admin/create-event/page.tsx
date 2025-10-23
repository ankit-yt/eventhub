"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { eventApi, resourceApi } from "@/lib/api"
import { ProtectedRoute } from "@/components/protected-route"
import { useRouter } from "next/navigation"

export default function CreateEvent() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "workshop",
    date: "",
    bannerUrl: "",
  })
  const [secondFormData, setSecondFormData] = useState({
      eventId: "",
    venueId: "",
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [venues, setVenues] = useState<any[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))


    
  }

 useEffect(()=>{
  
  fetchData()
 },[])
const fetchData = async () => {
    const [venuesRes] = await Promise.all([resourceApi.venues.getAll()])
   
    console.log("Venues Response:", venuesRes)
    if (venuesRes.data) setVenues(venuesRes.data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await eventApi.create(formData)
      console.log("Create Event Response:", response)
      secondFormData.eventId = response.data._id
      secondFormData.notes = formData.description
      await resourceApi.calendar.create(secondFormData)
      if (response.error) {
        setError(response.error)
      } else {
        setSuccess(true)
        setFormData({
          title: "",
          description: "",
          category: "workshop",
          date: "",
          venue: "",
          bannerUrl: "",
        })
        setTimeout(() => {
          router.push("/admin")
        }, 1500)
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
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
            <h1 className="text-4xl font-bold text-foreground mb-2">Create New Event</h1>
            <p className="text-muted-foreground">Fill in the details to create a new campus event</p>
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
                  Event created successfully! Redirecting...
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Event Title</label>
                <Input
                  type="text"
                  name="title"
                  placeholder="e.g., Tech Meetup 2025"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description</label>
                <textarea
                  name="description"
                  placeholder="Describe your event..."
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
                  <Input type="datetime-local" name="date" value={formData.date} onChange={handleChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Venue</label>
                <select
              value={secondFormData.venueId}
              onChange={(e) => setSecondFormData({ ...secondFormData, venueId: e.target.value })}
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

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Banner Image URL (Optional)</label>
                <Input
                  type="url"
                  name="bannerUrl"
                  placeholder="https://example.com/image.jpg"
                  value={formData.bannerUrl}
                  onChange={handleChange}
                />
              </div>

              <div className="flex gap-4 pt-6">
                <Button type="submit" size="lg" className="flex-1 bg-primary hover:bg-primary/90" disabled={loading}>
                  {loading ? "Creating..." : "Create Event"}
                </Button>
                <Link href="/admin" className="flex-1">
                  <Button type="button" variant="outline" size="lg" className="w-full bg-transparent">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </Card>
        </div>
      </main>
  )
}
