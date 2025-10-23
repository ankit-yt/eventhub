"use client"

import type React from "react"

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

    const response = await resourceApi.personnel.create(formData)

    if (response.data) {
      router.push("/admin/personnel")
    } else {
      alert("Error creating personnel: " + response.error)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl p-10 mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Add New Personnel</h1>

      <Card className="p-6 border border-border">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
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
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Skills</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                placeholder="Add skill (e.g., Sound Engineering)"
              />
              <Button type="button" onClick={handleAddSkill} variant="outline">
                Add
              </Button>
            </div>
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded">
                    <span className="text-sm">{skill}</span>
                    <button type="button" onClick={() => handleRemoveSkill(index)} className="hover:text-accent/70">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90">
              {loading ? "Creating..." : "Create Personnel"}
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
