"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { resourceApi } from "@/lib/api"
import { useParams, useRouter } from "next/navigation"

export default function EditEquipmentPage() {
  const params = useParams()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    category: "Audio",
    quantity: "",
    availableQuantity: "",
    description: "",
    condition: "Good",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchEquipment()
  }, [params.id])

  const fetchEquipment = async () => {
    const response = await resourceApi.equipment.getById(params.id as string)
    if (response.data) {
      setFormData(response.data)
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const response = await resourceApi.equipment.update(params.id as string, {
      ...formData,
      quantity: Number.parseInt(formData.quantity as any),
      availableQuantity: Number.parseInt(formData.availableQuantity as any),
    })

    if (response.data) {
      router.push("/admin/resources")
    } else {
      alert("Error updating equipment: " + response.error)
    }
    setSaving(false)
  }

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Edit Equipment</h1>

      <Card className="p-6 border border-border">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Equipment Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            >
              <option value="Audio">Audio</option>
              <option value="Visual">Visual</option>
              <option value="Lighting">Lighting</option>
              <option value="Furniture">Furniture</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Total Quantity</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Available Quantity</label>
              <input
                type="number"
                value={formData.availableQuantity}
                onChange={(e) => setFormData({ ...formData, availableQuantity: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Condition</label>
            <select
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            >
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Needs Repair">Needs Repair</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              rows={4}
            />
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
