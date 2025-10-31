"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface JobFormProps {
  userId: string
  estimates: Array<{
    id: string
    estimate_number: string
    leads?: { project_name: string; customers?: { name: string } | null } | null
  }>
  initialData?: {
    id: string
    estimate_id: string
    job_number: string
    status: string
    start_date?: string
    end_date?: string
    actual_start_date?: string
    actual_end_date?: string
    notes?: string
  }
}

const statusOptions = [
  { value: "scheduled", label: "Scheduled" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "on_hold", label: "On Hold" },
  { value: "cancelled", label: "Cancelled" },
]

export function JobForm({ userId, estimates, initialData }: JobFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState(initialData?.status || "scheduled")
  const [formData, setFormData] = useState({
    estimate_id: initialData?.estimate_id || "",
    job_number: initialData?.job_number || "",
    start_date: initialData?.start_date || "",
    end_date: initialData?.end_date || "",
    actual_start_date: initialData?.actual_start_date || "",
    actual_end_date: initialData?.actual_end_date || "",
    notes: initialData?.notes || "",
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
      const submitData = {
        estimate_id: formData.estimate_id,
        job_number: formData.job_number,
        status,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        actual_start_date: formData.actual_start_date || null,
        actual_end_date: formData.actual_end_date || null,
        notes: formData.notes,
      }

      if (initialData?.id) {
        const { error: updateError } = await supabase
          .from("jobs")
          .update(submitData)
          .eq("id", initialData.id)
          .eq("user_id", userId)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase.from("jobs").insert({
          ...submitData,
          user_id: userId,
        })

        if (insertError) throw insertError
      }

      router.push("/jobs")
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
          <Label htmlFor="estimate_id" className="text-slate-200">
            Estimate *
          </Label>
          <select
            id="estimate_id"
            name="estimate_id"
            value={formData.estimate_id}
            onChange={(e) => setFormData((prev) => ({ ...prev, estimate_id: e.target.value }))}
            required
            className="bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
          >
            <option value="">Select an estimate...</option>
            {estimates.map((estimate) => (
              <option key={estimate.id} value={estimate.id}>
                {estimate.estimate_number} - {estimate.leads?.project_name}{" "}
                {estimate.leads?.customers?.name ? `(${estimate.leads.customers.name})` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="job_number" className="text-slate-200">
            Job Number *
          </Label>
          <Input
            id="job_number"
            name="job_number"
            value={formData.job_number}
            onChange={handleChange}
            required
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            placeholder="JOB-001"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="status" className="text-slate-200">
            Status
          </Label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="border-t border-slate-700 pt-6">
        <h3 className="text-lg font-semibold text-white mb-4">Scheduled Dates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid gap-2">
            <Label htmlFor="start_date" className="text-slate-200">
              Scheduled Start Date
            </Label>
            <Input
              id="start_date"
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleChange}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="end_date" className="text-slate-200">
              Scheduled End Date
            </Label>
            <Input
              id="end_date"
              name="end_date"
              type="date"
              value={formData.end_date}
              onChange={handleChange}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-700 pt-6">
        <h3 className="text-lg font-semibold text-white mb-4">Actual Dates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid gap-2">
            <Label htmlFor="actual_start_date" className="text-slate-200">
              Actual Start Date
            </Label>
            <Input
              id="actual_start_date"
              name="actual_start_date"
              type="date"
              value={formData.actual_start_date}
              onChange={handleChange}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="actual_end_date" className="text-slate-200">
              Actual End Date
            </Label>
            <Input
              id="actual_end_date"
              name="actual_end_date"
              type="date"
              value={formData.actual_end_date}
              onChange={handleChange}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
        </div>
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
          placeholder="Job notes and details..."
        />
      </div>

      {error && <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-200">{error}</div>}

      <div className="flex gap-4">
        <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Job"}
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
