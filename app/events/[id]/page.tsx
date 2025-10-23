"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Calendar, MapPin, Users, ArrowLeft, Share2 } from "lucide-react"
import { useParams } from "next/navigation"
import { eventApi, userApi } from "@/lib/api"

interface Event {
  _id: string
  title: string
  description: string
  category: string
  date: string
  venue: string
  bannerUrl?: string
  attendees: any[]
  createdBy: { name: string; email: string }
  resources?: string[]
  personnel?: string[]
}

export default function EventDetails() {
  const params = useParams()
  const eventId = params.id as string
  const [event, setEvent] = useState<Event | null>(null)
  const [isRegistered, setIsRegistered] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvent()
  }, [eventId])

  const fetchEvent = async () => {
    try {
      setLoading(true)
      const response = await eventApi.getById(eventId)
      if (response.data) {
        setEvent(response.data)

        // Check if user is registered
        const userResponse = await userApi.getProfile()
        if (userResponse.data) {
          const userData = userResponse.data as any
          const registered = userData.registeredEvents?.some((e: any) => (e._id || e) === eventId)
          setIsRegistered(registered || false)
        }
      }
    } catch (error) {
      console.error("Error fetching event:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    try {
      const response = await eventApi.register(eventId)
      if (response.data) {
        setIsRegistered(true)
        fetchEvent()
      }
    } catch (error) {
      console.error("Error registering:", error)
    }
  }

  const handleUnregister = async () => {
    try {
      const response = await eventApi.unregister(eventId)
      if (response.data) {
        setIsRegistered(false)
        fetchEvent()
      }
    } catch (error) {
      console.error("Error unregistering:", error)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <p className="text-muted-foreground text-center text-lg sm:text-xl">Loading event details...</p>
      </main>
    )
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <p className="text-muted-foreground text-center text-lg sm:text-xl">Event not found</p>
      </main>
    )
  }

  const eventDate = new Date(event.date)
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Banner */}
        {event.bannerUrl && (
          <div className="mb-6 sm:mb-8 rounded-lg overflow-hidden h-56 sm:h-80 md:h-96 bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20">
            <img
              src={event.bannerUrl || "/placeholder.svg"}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Title and Category */}
        <div className="mb-8 text-center sm:text-left">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs sm:text-sm font-semibold rounded-full capitalize mb-3 sm:mb-4">
            {event.category}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance leading-tight">
            {event.title}
          </h1>
        </div>

        {/* Event Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10 sm:mb-12">
          <Card className="p-4 sm:p-6 border border-border">
            <div className="flex items-start gap-3 sm:gap-4">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-primary mt-1" />
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">Date & Time</p>
                <p className="font-semibold text-sm sm:text-base">{formattedDate}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6 border border-border">
            <div className="flex items-start gap-3 sm:gap-4">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-accent mt-1" />
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">Location</p>
                <p className="font-semibold text-sm sm:text-base">{event.venue}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6 border border-border">
            <div className="flex items-start gap-3 sm:gap-4">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary mt-1" />
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">Attendees</p>
                <p className="font-semibold text-sm sm:text-base">
                  {event.attendees.length} registered
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Description */}
        <Card className="p-6 sm:p-8 border border-border mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3 sm:mb-4">
            About This Event
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {event.description}
          </p>
        </Card>

        {/* Organizer */}
        <Card className="p-6 sm:p-8 border border-border mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3 sm:mb-4">
            Organized By
          </h2>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-base sm:text-lg font-semibold text-primary">
                {event.createdBy.name.charAt(0)}
              </span>
            </div>
            <div>
              <p className="font-semibold text-sm sm:text-base text-foreground">
                {event.createdBy.name}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">{event.createdBy.email}</p>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sticky bottom-4">
          {isRegistered ? (
            <Button
              variant="outline"
              size="lg"
              onClick={handleUnregister}
              className="flex-1 bg-transparent text-sm sm:text-base"
            >
              Unregister from Event
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={handleRegister}
              className="flex-1 bg-primary hover:bg-primary/90 text-sm sm:text-base"
            >
              Register for Event
            </Button>
          )}
          <Button
            variant="outline"
            size="lg"
            className="gap-2 bg-transparent text-sm sm:text-base"
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      </div>
    </main>
  )
}
