"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface CustomerFormProps {
  userId: string
  initialData?: {
    id: string
    name: string
    email: string
    phone?: string
    address?: string
    city?: string
    state?: string
    zip_code?: string
    notes?: string
  }
}

export function CustomerForm({ userId, initialData }: CustomerFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    zip_code: initialData?.zip_code || "",
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
      if (initialData?.id) {
        // Update existing customer
        const { error: updateError } = await supabase
          .from("customers")
          .update(formData)
          .eq("id", initialData.id)
          .eq("user_id", userId)

        if (updateError) throw updateError
      } else {
        // Create new customer
        const { error: insertError } = await supabase.from("customers").insert({
          ...formData,
          user_id: userId,
        })

        if (insertError) throw insertError
      }

      router.push("/customers")
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
          <Label htmlFor="name" className="text-slate-200">
            Customer Name *
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            placeholder="John Doe"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email" className="text-slate-200">
            Email *
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            placeholder="john@example.com"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone" className="text-slate-200">
            Phone
          </Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            placeholder="(555) 123-4567"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="address" className="text-slate-200">
            Address
          </Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            placeholder="123 Main St"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="city" className="text-slate-200">
            City
          </Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            placeholder="New York"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="state" className="text-slate-200">
            State
          </Label>
          <Input
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            placeholder="NY"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="zip_code" className="text-slate-200">
            Zip Code
          </Label>
          <Input
            id="zip_code"
            name="zip_code"
            value={formData.zip_code}
            onChange={handleChange}
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            placeholder="10001"
          />
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
          placeholder="Additional notes about the customer..."
        />
      </div>

      {error && <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-200">{error}</div>}

      <div className="flex gap-4">
        <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Customer"}
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
