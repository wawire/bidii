"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface SiteVisitFormProps {
  userId: string
  leads: Array<{ id: string; project_name: string; customers?: { name: string } | null }>
  initialData?: {
    id: string
    lead_id: string
    visit_date: string
    notes?: string
    measurements?: string
  }
}

export function SiteVisitForm({ userId, leads, initialData }: SiteVisitFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    lead_id: initialData?.lead_id || "",
    visit_date: initialData?.visit_date ? initialData.visit_date.split("T")[0] : "",
    visit_time: initialData?.visit_date ? initialData.visit_date.split("T")[1]?.slice(0, 5) : "",
    notes: initialData?.notes || "",
    measurements: initialData?.measurements || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const visitDateTime = `${formData.visit_date}T${formData.visit_time || "09:00"}:00`

      const submitData = {
        lead_id: formData.lead_id,
        visit_date: visitDateTime,
        notes: formData.notes,
        measurements: formData.measurements,
      }

      if (initialData?.id) {
        const { error: updateError } = await supabase
          .from("site_visits")
          .update(submitData)
          .eq("id", initialData.id)
          .eq("user_id", userId)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase.from("site_visits").insert({
          ...submitData,
          user_id: userId,
        })

        if (insertError) throw insertError
      }

      router.push("/site-visits")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="grid gap-2">
          <Label htmlFor="lead_id" className="text-slate-200">
            Project *
          </Label>
          <select
            id="lead_id"
            name="lead_id"
            value={formData.lead_id}
            onChange={(e) => setFormData((prev) => ({ ...prev, lead_id: e.target.value }))}
            required
            className="bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
          >
            <option value="">Select a project...</option>
            {leads.map((lead) => (
              <option key={lead.id} value={lead.id}>
                {lead.project_name} {lead.customers?.name ? `(${lead.customers.name})` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="visit_date" className="text-slate-200">
            Visit Date *
          </Label>
          <Input
            id="visit_date"
            name="visit_date"
            type="date"
            value={formData.visit_date}
            onChange={handleChange}
            required
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="visit_time" className="text-slate-200">
            Visit Time
          </Label>
          <Input
            id="visit_time"
            name="visit_time"
            type="time"
            value={formData.visit_time}
            onChange={handleChange}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="measurements" className="text-slate-200">
          Measurements
        </Label>
        <Textarea
          id="measurements"
          name="measurements"
          value={formData.measurements}
          onChange={handleChange}
          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 min-h-20"
          placeholder="Room dimensions, wall measurements, etc..."
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="notes" className="text-slate-200">
          Notes
        </Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 min-h-24"
          placeholder="Observations, photos taken, customer feedback..."
        />
      </div>

      {error && <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-200">{error}</div>}

      <div className="flex gap-4">
        <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Site Visit"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="border-slate-600 text-slate-200 hover:bg-slate-700 bg-transparent"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
