"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

interface Payment {
  id: string
  amount: number
  payment_method?: string
  payment_date: string
  reference_number?: string
  notes?: string
}

interface PaymentsListProps {
  invoiceId: string
  userId: string
  payments: Payment[]
  invoiceTotal: number
}

const paymentMethods = [
  { value: "cash", label: "Cash" },
  { value: "check", label: "Check" },
  { value: "credit_card", label: "Credit Card" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "other", label: "Other" },
]

export function PaymentsList({ invoiceId, userId, payments: initialPayments, invoiceTotal }: PaymentsListProps) {
  const [payments, setPayments] = useState(initialPayments)
  const [isAdding, setIsAdding] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    amount: "",
    payment_method: "bank_transfer",
    payment_date: new Date().toISOString().split("T")[0],
    reference_number: "",
    notes: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAdding(true)

    const supabase = createClient()

    try {
      const { data: newPayment, error } = await supabase
        .from("payments")
        .insert({
          invoice_id: invoiceId,
          user_id: userId,
          amount: Number(formData.amount),
          payment_method: formData.payment_method,
          payment_date: `${formData.payment_date}T00:00:00`,
          reference_number: formData.reference_number,
          notes: formData.notes,
        })
        .select()
        .single()

      if (error) throw error

      setPayments([newPayment, ...payments])
      setFormData({
        amount: "",
        payment_method: "bank_transfer",
        payment_date: new Date().toISOString().split("T")[0],
        reference_number: "",
        notes: "",
      })
    } catch (error) {
      console.error("Error adding payment:", error)
      alert("Failed to add payment")
    } finally {
      setIsAdding(false)
    }
  }

  const handleDeletePayment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this payment?")) return

    setIsDeleting(id)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("payments").delete().eq("id", id)
      if (error) throw error
      setPayments((prev) => prev.filter((p) => p.id !== id))
    } catch (error) {
      console.error("Error deleting payment:", error)
      alert("Failed to delete payment")
    } finally {
      setIsDeleting(null)
    }
  }

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0)
  const remaining = invoiceTotal - totalPaid

  return (
    <div className="space-y-6">
      <form onSubmit={handleAddPayment} className="bg-slate-700/50 border border-slate-600 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">Record Payment</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="amount" className="text-xs text-slate-300">
              Amount *
            </Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              required
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 text-sm"
              placeholder="0.00"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="payment_method" className="text-xs text-slate-300">
              Payment Method
            </Label>
            <select
              id="payment_method"
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              className="bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 text-sm"
            >
              {paymentMethods.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="payment_date" className="text-xs text-slate-300">
              Payment Date
            </Label>
            <Input
              id="payment_date"
              name="payment_date"
              type="date"
              value={formData.payment_date}
              onChange={handleChange}
              className="bg-slate-700 border-slate-600 text-white text-sm"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="reference_number" className="text-xs text-slate-300">
              Reference Number
            </Label>
            <Input
              id="reference_number"
              name="reference_number"
              value={formData.reference_number}
              onChange={handleChange}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 text-sm"
              placeholder="Check #, Transaction ID, etc."
            />
          </div>

          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="notes" className="text-xs text-slate-300">
              Notes
            </Label>
            <Input
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 text-sm"
              placeholder="Payment notes..."
            />
          </div>
        </div>

        <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white" disabled={isAdding}>
          {isAdding ? "Recording..." : "Record Payment"}
        </Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4">
          <p className="text-xs text-slate-400 mb-1">Invoice Total</p>
          <p className="text-2xl font-bold text-white">${invoiceTotal.toFixed(2)}</p>
        </div>
        <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4">
          <p className="text-xs text-slate-400 mb-1">Total Paid</p>
          <p className="text-2xl font-bold text-green-400">${totalPaid.toFixed(2)}</p>
        </div>
        <div
          className={`border rounded-lg p-4 ${remaining > 0 ? "bg-red-900/20 border-red-700" : "bg-green-900/20 border-green-700"}`}
        >
          <p className="text-xs text-slate-400 mb-1">Remaining</p>
          <p className={`text-2xl font-bold ${remaining > 0 ? "text-red-400" : "text-green-400"}`}>
            ${remaining.toFixed(2)}
          </p>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-8 text-center">
          <p className="text-slate-400">No payments recorded yet.</p>
        </div>
      ) : (
        <div className="bg-slate-700/30 border border-slate-600 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50 border-b border-slate-600">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Method</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Reference</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Notes</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-slate-200">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-600">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-700/30 transition">
                    <td className="px-6 py-3 text-sm text-white font-medium">
                      {new Date(payment.payment_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 text-sm text-white font-medium">${payment.amount.toFixed(2)}</td>
                    <td className="px-6 py-3 text-sm text-slate-300">
                      {paymentMethods.find((m) => m.value === payment.payment_method)?.label ||
                        payment.payment_method ||
                        "-"}
                    </td>
                    <td className="px-6 py-3 text-sm text-slate-300">{payment.reference_number || "-"}</td>
                    <td className="px-6 py-3 text-sm text-slate-300 truncate max-w-xs">{payment.notes || "-"}</td>
                    <td className="px-6 py-3 text-right">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeletePayment(payment.id)}
                        disabled={isDeleting === payment.id}
                        className="bg-red-900/50 hover:bg-red-900 text-red-200 border-red-700"
                      >
                        {isDeleting === payment.id ? "Deleting..." : "Delete"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
