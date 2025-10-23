"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { resourceApi } from "@/lib/api"
import { useParams, useRouter } from "next/navigation"
import { X } from "lucide-react"

export default function EditVenuePage() {
  const params = useParams()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    capacity: "",
    amenities: [] as string[],
    contactPerson: "",
    contactPhone: "",
  })
  const [amenityInput, setAmenityInput] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchVenue()
  }, [params.id])

  const fetchVenue = async () => {
    const response = await resourceApi.venues.getById(params.id as string)
    if (response.data) {
      setFormData(response.data)
    }
    setLoading(false)
  }

  const handleAddAmenity = () => {
    if (amenityInput.trim()) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenityInput.trim()],
      })
      setAmenityInput("")
    }
  }

  const handleRemoveAmenity = (index: number) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const response = await resourceApi.venues.update(params.id as string, {
      ...formData,
      capacity: Number.parseInt(formData.capacity as any),
    })

    if (response.data) {
      router.push("/admin/resources")
    } else {
      alert("Error updating venue: " + response.error)
    }
    setSaving(false)
  }

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Edit Venue</h1>

      <Card className="p-6 border border-border">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Venue Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Capacity</label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Contact Person</label>
            <input
              type="text"
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Contact Phone</label>
            <input
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Amenities</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddAmenity())}
                className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                placeholder="Add amenity"
              />
              <Button type="button" onClick={handleAddAmenity} variant="outline">
                Add
              </Button>
            </div>
            {formData.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded">
                    <span className="text-sm">{amenity}</span>
                    <button type="button" onClick={() => handleRemoveAmenity(index)} className="hover:text-primary/70">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={saving} className="bg-primary hover:bg-primary/90">
              {saving ? "Saving..." : "Save Changes"}
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
