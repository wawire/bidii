"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface InvoiceFormProps {
  userId: string
  jobs: Array<{
    id: string
    job_number: string
    estimates?: { leads?: { project_name: string; customers?: { name: string } | null } | null } | null
  }>
  initialData?: {
    id: string
    job_id: string
    invoice_number: string
    status: string
    total_amount: number
    tax_amount?: number
    paid_amount?: number
    due_date: string
    paid_date?: string
    notes?: string
  }
}

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
  { value: "cancelled", label: "Cancelled" },
]

export function InvoiceForm({ userId, jobs, initialData }: InvoiceFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState(initialData?.status || "draft")
  const [formData, setFormData] = useState({
    job_id: initialData?.job_id || "",
    invoice_number: initialData?.invoice_number || "",
    total_amount: initialData?.total_amount?.toString() || "",
    tax_amount: initialData?.tax_amount?.toString() || "",
    paid_amount: initialData?.paid_amount?.toString() || "0",
    due_date: initialData?.due_date || "",
    paid_date: initialData?.paid_date || "",
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
        job_id: formData.job_id,
        invoice_number: formData.invoice_number,
        status,
        total_amount: Number(formData.total_amount),
        tax_amount: formData.tax_amount ? Number(formData.tax_amount) : null,
        paid_amount: Number(formData.paid_amount) || 0,
        due_date: formData.due_date,
        paid_date: formData.paid_date || null,
        notes: formData.notes,
      }

      if (initialData?.id) {
        const { error: updateError } = await supabase
          .from("invoices")
          .update(submitData)
          .eq("id", initialData.id)
          .eq("user_id", userId)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase.from("invoices").insert({
          ...submitData,
          user_id: userId,
        })

        if (insertError) throw insertError
      }

      router.push("/invoices")
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
          <Label htmlFor="job_id" className="text-slate-200">
            Job *
          </Label>
          <select
            id="job_id"
            name="job_id"
            value={formData.job_id}
            onChange={(e) => setFormData((prev) => ({ ...prev, job_id: e.target.value }))}
            required
            className="bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
          >
            <option value="">Select a job...</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.job_number} - {job.estimates?.leads?.project_name}{" "}
                {job.estimates?.leads?.customers?.name ? `(${job.estimates.leads.customers.name})` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="invoice_number" className="text-slate-200">
            Invoice Number *
          </Label>
          <Input
            id="invoice_number"
            name="invoice_number"
            value={formData.invoice_number}
            onChange={handleChange}
            required
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            placeholder="INV-001"
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

        <div className="grid gap-2">
          <Label htmlFor="due_date" className="text-slate-200">
            Due Date *
          </Label>
          <Input
            id="due_date"
            name="due_date"
            type="date"
            value={formData.due_date}
            onChange={handleChange}
            required
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>
      </div>

      <div className="border-t border-slate-700 pt-6">
        <h3 className="text-lg font-semibold text-white mb-4">Amount Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="grid gap-2">
            <Label htmlFor="total_amount" className="text-slate-200">
              Total Amount *
            </Label>
            <Input
              id="total_amount"
              name="total_amount"
              type="number"
              step="0.01"
              value={formData.total_amount}
              onChange={handleChange}
              required
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              placeholder="0.00"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tax_amount" className="text-slate-200">
              Tax Amount
            </Label>
            <Input
              id="tax_amount"
              name="tax_amount"
              type="number"
              step="0.01"
              value={formData.tax_amount}
              onChange={handleChange}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              placeholder="0.00"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="paid_amount" className="text-slate-200">
              Paid Amount
            </Label>
            <Input
              id="paid_amount"
              name="paid_amount"
              type="number"
              step="0.01"
              value={formData.paid_amount}
              onChange={handleChange}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="paid_date" className="text-slate-200">
          Paid Date
        </Label>
        <Input
          id="paid_date"
          name="paid_date"
          type="date"
          value={formData.paid_date}
          onChange={handleChange}
          className="bg-slate-700 border-slate-600 text-white"
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
          placeholder="Invoice notes..."
        />
      </div>

      {error && <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-200">{error}</div>}

      <div className="flex gap-4">
        <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Invoice"}
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
