"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { resourceApi } from "@/lib/api"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"

export default function NewVenuePage() {
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
  const [loading, setLoading] = useState(false)

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
    setLoading(true)
    try {
      const response = await resourceApi.venues.create({
        ...formData,
        capacity: Number.parseInt(formData.capacity),
      })

      if (response.data) {
        router.push("/admin/resources")
      } else {
        alert("Error creating venue: " + response.error)
      }
    } catch (err: any) {
      alert("Unexpected error: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (window.history.length > 1) router.back()
    else router.push("/admin/resources")
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8 flex justify-center">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground text-center sm:text-left">
          Add New Venue
        </h1>

        <Card className="p-4 sm:p-6 border border-border">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Venue Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Venue Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                required
              />
            </div>

            {/* Capacity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Capacity
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  required
                />
              </div>

              {/* Contact Person */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Contact Person
                </label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Contact Phone
              </label>
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Amenities
              </label>
              <div className="flex flex-col sm:flex-row gap-2 mb-3">
                <input
                  type="text"
                  value={amenityInput}
                  onChange={(e) => setAmenityInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddAmenity())}
                  className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="Add amenity (e.g., WiFi, Projector)"
                />
                <Button
                  type="button"
                  onClick={handleAddAmenity}
                  variant="outline"
                  className="shrink-0"
                >
                  Add
                </Button>
              </div>
              {formData.amenities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded"
                    >
                      <span className="text-sm">{amenity}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAmenity(index)}
                        className="hover:text-primary/70"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
              >
                {loading ? "Creating..." : "Create Venue"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
