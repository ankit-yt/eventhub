"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { resourceApi } from "@/lib/api"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, MapPin, ClipboardList, Users, Trash2, Edit2, ArrowLeft } from "lucide-react"

export default function CalendarDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [calendarEvent, setCalendarEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCalendarEvent()
  }, [params.id])

  const fetchCalendarEvent = async () => {
    const response = await resourceApi.calendar.getById(params.id as string)
    if (response.data) setCalendarEvent(response.data)
    setLoading(false)
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this calendar entry?")) {
      await resourceApi.calendar.delete(params.id as string)
      router.push("/admin/calendar")
    }
  }

  if (loading)
    return <div className="text-center py-12 text-muted-foreground animate-pulse">Loading event details...</div>

  if (!calendarEvent)
    return <div className="text-center py-12 text-muted-foreground">Calendar entry not found</div>

  const event = calendarEvent.eventId
  const venue = calendarEvent.venueId

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-10 p-10 h-screen "
    >
      
      {/* Header */}
      <div className="flex items-center  justify-between bg-gradient-to-r from-background via-background/60 to-muted/30 backdrop-blur-md border border-border/50 rounded-2xl p-6 shadow-sm">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">{event.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Event overview, resource allocations, and notes in one glance.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/calendar/${params.id}/edit`}>
            <Button
              variant="outline"
              className="gap-2 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </Button>
          </Link>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="gap-2 rounded-xl bg-destructive hover:bg-destructive/90"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
          <Link
              href="/admin/calendar"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              
            </Link>
        </div>
      </div>

      {/* Event Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-8 border border-border/60 bg-gradient-to-br from-background via-background/70 to-muted/20 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
          <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-primary" /> Event Details
          </h2>
          <div className="space-y-4">
            <DetailItem icon={<Calendar className="w-4 h-4 text-primary" />} label="Date">
              {new Date(event.date).toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </DetailItem>
            <DetailItem icon={<MapPin className="w-4 h-4 text-primary" />} label="Venue">
              {venue?.name}
            </DetailItem>
            <DetailItem label="Status">{calendarEvent.status}</DetailItem>
          </div>
        </Card>

        {/* Resources Allocated */}
        <Card className="p-8 border border-border/60 bg-gradient-to-br from-background via-background/70 to-muted/20 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
          <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" /> Resources Allocated
          </h2>
          <div className="space-y-6">
            <ResourceBlock
              title="Equipment"
              items={calendarEvent.allocatedEquipment}
              emptyText="No equipment allocated"
              renderItem={(item: any) => (
                <span>
                  {item.equipmentId.name} <span className="text-xs text-muted-foreground">×{item.quantity}</span>
                </span>
              )}
            />
            <ResourceBlock
              title="Personnel"
              items={calendarEvent.assignedPersonnel}
              emptyText="No personnel assigned"
              renderItem={(person: any) => (
                <span>
                  {person.personnelId.name}{" "}
                  <span className="text-xs text-muted-foreground">— {person.role}</span>
                </span>
              )}
            />
          </div>
        </Card>
      </div>

      {/* Notes Section */}
      {calendarEvent.notes && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="p-8 border border-border/60 bg-gradient-to-br from-background via-background/70 to-muted/20 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <h2 className="text-xl font-semibold text-foreground mb-4">Notes</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {calendarEvent.notes}
            </p>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}

/* ✅ Reusable small UI helpers for elegance */
function DetailItem({
  icon,
  label,
  children,
}: {
  icon?: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3">
      {icon && <div className="mt-1">{icon}</div>}
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-foreground font-medium">{children}</p>
      </div>
    </div>
  )
}

function ResourceBlock({
  title,
  items,
  emptyText,
  renderItem,
}: {
  title: string
  items: any[]
  emptyText: string
  renderItem: (item: any) => React.ReactNode
}) {
  return (
    <div>
      <p className="text-sm font-medium text-foreground mb-2">{title}</p>
      {items?.length > 0 ? (
        <ul className="space-y-1 text-sm text-muted-foreground">
          {items.map((item: any, i: number) => (
            <li key={i} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary/60 rounded-full" />
              {renderItem(item)}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">{emptyText}</p>
      )}
    </div>
  )
}
