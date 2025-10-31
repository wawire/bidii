"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

interface Material {
  id: string
  name: string
  quantity: number
  unit?: string
  cost_per_unit: number
  total_cost: number
  supplier?: string
  delivery_date?: string
}

interface MaterialsListProps {
  jobId: string
  userId: string
  materials: Material[]
}

export function MaterialsList({ jobId, userId, materials: initialMaterials }: MaterialsListProps) {
  const [materials, setMaterials] = useState(initialMaterials)
  const [isAdding, setIsAdding] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    quantity: "1",
    unit: "",
    cost_per_unit: "0",
    supplier: "",
    delivery_date: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAdding(true)

    const supabase = createClient()
    const quantity = Number(formData.quantity)
    const costPerUnit = Number(formData.cost_per_unit)
    const totalCost = quantity * costPerUnit

    try {
      const { data: newMaterial, error } = await supabase
        .from("materials")
        .insert({
          job_id: jobId,
          user_id: userId,
          name: formData.name,
          quantity,
          unit: formData.unit,
          cost_per_unit: costPerUnit,
          total_cost: totalCost,
          supplier: formData.supplier,
          delivery_date: formData.delivery_date || null,
        })
        .select()
        .single()

      if (error) throw error

      setMaterials([...materials, newMaterial])
      setFormData({
        name: "",
        quantity: "1",
        unit: "",
        cost_per_unit: "0",
        supplier: "",
        delivery_date: "",
      })
    } catch (error) {
      console.error("Error adding material:", error)
      alert("Failed to add material")
    } finally {
      setIsAdding(false)
    }
  }

  const handleDeleteMaterial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this material?")) return

    setIsDeleting(id)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("materials").delete().eq("id", id)
      if (error) throw error
      setMaterials((prev) => prev.filter((m) => m.id !== id))
    } catch (error) {
      console.error("Error deleting material:", error)
      alert("Failed to delete material")
    } finally {
      setIsDeleting(null)
    }
  }

  const totalMaterialsCost = materials.reduce((sum, m) => sum + m.total_cost, 0)

  return (
    <div className="space-y-6">
      <form onSubmit={handleAddMaterial} className="bg-slate-700/50 border border-slate-600 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">Add Material</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-xs text-slate-300">
              Material Name *
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 text-sm"
              placeholder="e.g., Drywall"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="quantity" className="text-xs text-slate-300">
              Quantity *
            </Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              step="0.01"
              value={formData.quantity}
              onChange={handleChange}
              required
              className="bg-slate-700 border-slate-600 text-white text-sm"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="unit" className="text-xs text-slate-300">
              Unit
            </Label>
            <Input
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 text-sm"
              placeholder="e.g., sheets"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cost_per_unit" className="text-xs text-slate-300">
              Cost Per Unit *
            </Label>
            <Input
              id="cost_per_unit"
              name="cost_per_unit"
              type="number"
              step="0.01"
              value={formData.cost_per_unit}
              onChange={handleChange}
              required
              className="bg-slate-700 border-slate-600 text-white text-sm"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="supplier" className="text-xs text-slate-300">
              Supplier
            </Label>
            <Input
              id="supplier"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 text-sm"
              placeholder="Supplier name"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="delivery_date" className="text-xs text-slate-300">
              Delivery Date
            </Label>
            <Input
              id="delivery_date"
              name="delivery_date"
              type="date"
              value={formData.delivery_date}
              onChange={handleChange}
              className="bg-slate-700 border-slate-600 text-white text-sm"
            />
          </div>
        </div>

        <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white" disabled={isAdding}>
          {isAdding ? "Adding..." : "Add Material"}
        </Button>
      </form>

      {materials.length === 0 ? (
        <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-8 text-center">
          <p className="text-slate-400">No materials added yet.</p>
        </div>
      ) : (
        <div className="bg-slate-700/30 border border-slate-600 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50 border-b border-slate-600">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Material</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Qty</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Unit</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Cost/Unit</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Total</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Supplier</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Delivery</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-slate-200">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-600">
                {materials.map((material) => (
                  <tr key={material.id} className="hover:bg-slate-700/30 transition">
                    <td className="px-6 py-3 text-sm text-white font-medium">{material.name}</td>
                    <td className="px-6 py-3 text-sm text-slate-300">{material.quantity}</td>
                    <td className="px-6 py-3 text-sm text-slate-300">{material.unit || "-"}</td>
                    <td className="px-6 py-3 text-sm text-slate-300">${material.cost_per_unit.toFixed(2)}</td>
                    <td className="px-6 py-3 text-sm text-white font-medium">${material.total_cost.toFixed(2)}</td>
                    <td className="px-6 py-3 text-sm text-slate-300">{material.supplier || "-"}</td>
                    <td className="px-6 py-3 text-sm text-slate-300">
                      {material.delivery_date ? new Date(material.delivery_date).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteMaterial(material.id)}
                        disabled={isDeleting === material.id}
                        className="bg-red-900/50 hover:bg-red-900 text-red-200 border-red-700"
                      >
                        {isDeleting === material.id ? "Deleting..." : "Delete"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-700/50 border-t border-slate-600 px-6 py-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-white">Total Materials Cost:</span>
              <span className="text-2xl font-bold text-cyan-400">${totalMaterialsCost.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
