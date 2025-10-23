"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { resourceApi } from "@/lib/api"
import { Plus, Edit2, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Venue {
  _id: string
  name: string
  location: string
  capacity: number
  amenities: string[]
}

interface Equipment {
  _id: string
  name: string
  category: string
  quantity: number
  availableQuantity: number
  condition: string
}

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState<"venues" | "equipment">("venues")
  const [venues, setVenues] = useState<Venue[]>([])
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    setLoading(true)
    const [venuesRes, equipmentRes] = await Promise.all([resourceApi.venues.getAll(), resourceApi.equipment.getAll()])
    if (venuesRes.data) setVenues(venuesRes.data)
    if (equipmentRes.data) setEquipment(equipmentRes.data)
    setLoading(false)
  }

  const handleDeleteVenue = async (id: string) => {
    if (confirm("Are you sure you want to delete this venue?")) {
      await resourceApi.venues.delete(id)
      fetchResources()
    }
  }

  const handleDeleteEquipment = async (id: string) => {
    if (confirm("Are you sure you want to delete this equipment?")) {
      await resourceApi.equipment.delete(id)
      fetchResources()
    }
  }

  const conditionColors: Record<string, string> = {
    Excellent: "bg-green-100 text-green-800",
    Good: "bg-blue-100 text-blue-800",
    Fair: "bg-yellow-100 text-yellow-800",
    "Needs Repair": "bg-red-100 text-red-800",
  }

  return (
    <>
    <div className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
              <div className="max-w-7xl mx-auto px-4  sm:px-6 lg:px-8 py-4">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Admin
                </Link>
              </div>
            </div>
    <div className="space-y-6 p-10 px-40">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Resource Management</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("venues")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === "venues"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Venues
        </button>
        <button
          onClick={() => setActiveTab("equipment")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === "equipment"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Equipment
        </button>
      </div>

      {/* Venues Tab */}
      {activeTab === "venues" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Link href="/admin/resources/venues/new">
              <Button className="bg-primary hover:bg-primary/90 gap-2">
                <Plus className="w-4 h-4" />
                Add Venue
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading venues...</div>
          ) : venues.length === 0 ? (
            <Card className="p-8 text-center border border-border">
              <p className="text-muted-foreground">No venues added yet</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {venues.map((venue) => (
                <Card key={venue._id} className="p-6 border border-border hover:border-primary/50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{venue.name}</h3>
                      <p className="text-sm text-muted-foreground">{venue.location}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/admin/resources/venues/${venue._id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteVenue(venue._id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Capacity</span>
                      <span className="font-medium text-foreground">{venue.capacity} people</span>
                    </div>
                    {venue.amenities.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Amenities</p>
                        <div className="flex flex-wrap gap-2">
                          {venue.amenities.map((amenity) => (
                            <span key={amenity} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Equipment Tab */}
      {activeTab === "equipment" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Link href="/admin/resources/equipment/new">
              <Button className="bg-primary hover:bg-primary/90 gap-2">
                <Plus className="w-4 h-4" />
                Add Equipment
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading equipment...</div>
          ) : equipment.length === 0 ? (
            <Card className="p-8 text-center border border-border">
              <p className="text-muted-foreground">No equipment added yet</p>
            </Card>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Category</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Total</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Available</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Condition</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {equipment.map((item) => (
                    <tr key={item._id} className="border-b border-border hover:bg-card/50 transition-colors">
                      <td className="py-3 px-4 text-foreground">{item.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{item.category}</td>
                      <td className="py-3 px-4 text-foreground font-medium">{item.quantity}</td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-foreground">{item.availableQuantity}</span>
                        <span className="text-muted-foreground text-sm">
                          {" "}
                          ({item.quantity - item.availableQuantity} allocated)
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded ${conditionColors[item.condition]}`}>
                          {item.condition}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Link href={`/admin/resources/equipment/${item._id}`}>
                            <Button variant="ghost" size="sm">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteEquipment(item._id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
    </>
  )
}
