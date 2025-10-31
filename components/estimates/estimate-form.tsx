"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface EstimateFormProps {
  userId: string
  leads: Array<{ id: string; project_name: string; customers?: { name: string } | null }>
  initialData?: {
    id: string
    lead_id: string
    estimate_number: string
    status: string
    total_amount: number
    labor_cost?: number
    material_cost?: number
    tax_amount?: number
    notes?: string
    valid_until?: string
  }
  initialItems?: Array<{
    id: string
    description: string
    quantity: number
    unit_price: number
    total_price: number
    category?: string
  }>
}

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
]

export function EstimateForm({ userId, leads, initialData, initialItems = [] }: EstimateFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState(initialData?.status || "draft")
  const [items, setItems] = useState(
    initialItems.length > 0
      ? initialItems
      : [{ id: "new-1", description: "", quantity: 1, unit_price: 0, total_price: 0, category: "" }],
  )
  const [formData, setFormData] = useState({
    lead_id: initialData?.lead_id || "",
    estimate_number: initialData?.estimate_number || "",
    labor_cost: initialData?.labor_cost?.toString() || "",
    material_cost: initialData?.material_cost?.toString() || "",
    tax_amount: initialData?.tax_amount?.toString() || "",
    notes: initialData?.notes || "",
    valid_until: initialData?.valid_until || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...items]
    const item = newItems[index]

    if (field === "quantity" || field === "unit_price") {
      const quantity = field === "quantity" ? Number(value) : Number(item.quantity)
      const unitPrice = field === "unit_price" ? Number(value) : Number(item.unit_price)
      item.total_price = quantity * unitPrice
    }
    ;(item as any)[field] = value
    setItems(newItems)
  }

  const addItem = () => {
    setItems([
      ...items,
      {
        id: `new-${Date.now()}`,
        description: "",
        quantity: 1,
        unit_price: 0,
        total_price: 0,
        category: "",
      },
    ])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const calculateTotal = () => {
    const itemsTotal = items.reduce((sum, item) => sum + (item.total_price || 0), 0)
    const laborCost = Number(formData.labor_cost) || 0
    const materialCost = Number(formData.material_cost) || 0
    const subtotal = itemsTotal + laborCost + materialCost
    const tax = Number(formData.tax_amount) || 0
    return subtotal + tax
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const totalAmount = calculateTotal()

      const estimateData = {
        lead_id: formData.lead_id,
        estimate_number: formData.estimate_number,
        status,
        total_amount: totalAmount,
        labor_cost: formData.labor_cost ? Number(formData.labor_cost) : null,
        material_cost: formData.material_cost ? Number(formData.material_cost) : null,
        tax_amount: formData.tax_amount ? Number(formData.tax_amount) : null,
        notes: formData.notes,
        valid_until: formData.valid_until || null,
      }

      if (initialData?.id) {
        const { error: updateError } = await supabase
          .from("estimates")
          .update(estimateData)
          .eq("id", initialData.id)
          .eq("user_id", userId)

        if (updateError) throw updateError

        // Delete old items and insert new ones
        await supabase.from("estimate_items").delete().eq("estimate_id", initialData.id)
      } else {
        const { data: newEstimate, error: insertError } = await supabase
          .from("estimates")
          .insert({ ...estimateData, user_id: userId })
          .select()
          .single()

        if (insertError) throw insertError
        initialData = { ...newEstimate, id: newEstimate.id }
      }

      // Insert items
      const itemsToInsert = items
        .filter((item) => item.description)
        .map((item) => ({
          estimate_id: initialData?.id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price,
          category: item.category,
        }))

      if (itemsToInsert.length > 0) {
        const { error: itemsError } = await supabase.from("estimate_items").insert(itemsToInsert)
        if (itemsError) throw itemsError
      }

      router.push("/estimates")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
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
          <Label htmlFor="estimate_number" className="text-slate-200">
            Estimate Number *
          </Label>
          <Input
            id="estimate_number"
            name="estimate_number"
            value={formData.estimate_number}
            onChange={handleChange}
            required
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            placeholder="EST-001"
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
          <Label htmlFor="valid_until" className="text-slate-200">
            Valid Until
          </Label>
          <Input
            id="valid_until"
            name="valid_until"
            type="date"
            value={formData.valid_until}
            onChange={handleChange}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>
      </div>

      <div className="border-t border-slate-700 pt-8">
        <h3 className="text-lg font-semibold text-white mb-4">Line Items</h3>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div className="grid gap-2">
                <Label className="text-xs text-slate-400">Description</Label>
                <Input
                  value={item.description}
                  onChange={(e) => handleItemChange(index, "description", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 text-sm"
                  placeholder="Item description"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-xs text-slate-400">Qty</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white text-sm"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-xs text-slate-400">Unit Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={item.unit_price}
                  onChange={(e) => handleItemChange(index, "unit_price", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white text-sm"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-xs text-slate-400">Total</Label>
                <div className="bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white text-sm">
                  ${item.total_price.toFixed(2)}
                </div>
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeItem(index)}
                className="bg-red-900/50 hover:bg-red-900 text-red-200 border-red-700"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={addItem}
          className="mt-4 border-slate-600 text-slate-200 hover:bg-slate-700 bg-transparent"
        >
          Add Item
        </Button>
      </div>

      <div className="border-t border-slate-700 pt-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="grid gap-2">
            <Label htmlFor="labor_cost" className="text-slate-200">
              Labor Cost
            </Label>
            <Input
              id="labor_cost"
              name="labor_cost"
              type="number"
              step="0.01"
              value={formData.labor_cost}
              onChange={handleChange}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              placeholder="0.00"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="material_cost" className="text-slate-200">
              Material Cost
            </Label>
            <Input
              id="material_cost"
              name="material_cost"
              type="number"
              step="0.01"
              value={formData.material_cost}
              onChange={handleChange}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              placeholder="0.00"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tax_amount" className="text-slate-200">
              Tax
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
        </div>

        <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-white">Total Amount:</span>
            <span className="text-2xl font-bold text-cyan-400">${calculateTotal().toFixed(2)}</span>
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
          placeholder="Additional notes for the estimate..."
        />
      </div>

      {error && <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-200">{error}</div>}

      <div className="flex gap-4">
        <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Estimate"}
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
