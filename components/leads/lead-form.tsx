"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface LeadFormProps {
  userId: string
  customers: Array<{ id: string; name: string }>
  initialData?: {
    id: string
    customer_id?: string
    project_name: string
    description?: string
    status: string
    estimated_value?: number
  }
}

const statusOptions = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "estimate_sent", label: "Estimate Sent" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
]

export function LeadForm({ userId, customers, initialData }: LeadFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState(initialData?.status || "new")
  const [formData, setFormData] = useState({
    customer_id: initialData?.customer_id || "",
    project_name: initialData?.project_name || "",
    description: initialData?.description || "",
    estimated_value: initialData?.estimated_value?.toString() || "",
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
        customer_id: formData.customer_id || null,
        project_name: formData.project_name,
        description: formData.description,
        status,
        estimated_value: formData.estimated_value ? Number.parseFloat(formData.estimated_value) : null,
      }

      if (initialData?.id) {
        // Update existing lead
        const { error: updateError } = await supabase
          .from("leads")
          .update(submitData)
          .eq("id", initialData.id)
          .eq("user_id", userId)

        if (updateError) throw updateError
      } else {
        // Create new lead
        const { error: insertError } = await supabase.from("leads").insert({
          ...submitData,
          user_id: userId,
        })

        if (insertError) throw insertError
      }

      router.push("/leads")
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
          <Label htmlFor="project_name" className="text-slate-200">
            Project Name *
          </Label>
          <Input
            id="project_name"
            name="project_name"
            value={formData.project_name}
            onChange={handleChange}
            required
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            placeholder="Kitchen Renovation"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="customer_id" className="text-slate-200">
            Customer
          </Label>
          <select
            id="customer_id"
            name="customer_id"
            value={formData.customer_id}
            onChange={(e) => setFormData((prev) => ({ ...prev, customer_id: e.target.value }))}
            className="bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
          >
            <option value="">Select a customer...</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="status" className="text-slate-200">
            Status *
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

        <div className="grid gap-2">
          <Label htmlFor="estimated_value" className="text-slate-200">
            Estimated Value ($)
          </Label>
          <Input
            id="estimated_value"
            name="estimated_value"
            type="number"
            step="0.01"
            value={formData.estimated_value}
            onChange={handleChange}
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            placeholder="5000.00"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description" className="text-slate-200">
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 min-h-24"
          placeholder="Project details and notes..."
        />
      </div>

      {error && <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-200">{error}</div>}

      <div className="flex gap-4">
        <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Lead"}
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
