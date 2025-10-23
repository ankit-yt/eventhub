"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { resourceApi } from "@/lib/api"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"

export default function NewPersonnelPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    role: "Volunteer",
    email: "",
    phone: "",
    skills: [] as string[],
  })
  const [skillInput, setSkillInput] = useState("")
  const [loading, setLoading] = useState(false)

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      })
      setSkillInput("")
    }
  }

  const handleRemoveSkill = (index: number) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await resourceApi.personnel.create(formData)
      if (response.data) {
        router.push("/admin/personnel")
      } else {
        alert("Error creating personnel: " + response.error)
      }
    } catch (err: any) {
      alert("Unexpected error: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (window.history.length > 1) router.back()
    else router.push("/admin/personnel")
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8 flex justify-center">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground text-center sm:text-left">
          Add New Personnel
        </h1>

        <Card className="p-4 sm:p-6 border border-border">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                required
              />
            </div>

            {/* Role & Email (side by side on larger screens) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="Coordinator">Coordinator</option>
                  <option value="Volunteer">Volunteer</option>
                  <option value="Staff">Staff</option>
                  <option value="Security">Security</option>
                  <option value="Technical Support">Technical Support</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                required
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Skills</label>
              <div className="flex flex-col sm:flex-row gap-2 mb-3">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                  className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="Add skill (e.g., Sound Engineering)"
                />
                <Button type="button" onClick={handleAddSkill} variant="outline" className="shrink-0">
                  Add
                </Button>
              </div>

              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded"
                    >
                      <span className="text-sm">{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(index)}
                        className="hover:text-accent/70"
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
                {loading ? "Creating..." : "Create Personnel"}
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
