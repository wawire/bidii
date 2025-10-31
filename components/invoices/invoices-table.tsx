"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

interface Invoice {
  id: string
  invoice_number: string
  status: string
  total_amount: number
  paid_amount?: number
  due_date: string
  jobs?: {
    job_number: string
    estimates?: { leads?: { project_name: string; customers?: { name: string } | null } | null } | null
  } | null
  created_at: string
}

interface InvoicesTableProps {
  invoices: Invoice[]
}

const statusColors: Record<string, string> = {
  draft: "bg-slate-900/30 text-slate-200 border-slate-700",
  sent: "bg-blue-900/30 text-blue-200 border-blue-700",
  paid: "bg-green-900/30 text-green-200 border-green-700",
  overdue: "bg-red-900/30 text-red-200 border-red-700",
  cancelled: "bg-gray-900/30 text-gray-200 border-gray-700",
}

export function InvoicesTable({ invoices: initialInvoices }: InvoicesTableProps) {
  const [invoices, setInvoices] = useState(initialInvoices)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return

    setIsDeleting(id)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("invoices").delete().eq("id", id)
      if (error) throw error
      setInvoices((prev) => prev.filter((i) => i.id !== id))
    } catch (error) {
      console.error("Error deleting invoice:", error)
      alert("Failed to delete invoice")
    } finally {
      setIsDeleting(null)
    }
  }

  if (invoices.length === 0) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
        <p className="text-slate-400 mb-4">No invoices yet. Create your first invoice to get started.</p>
        <Link href="/invoices/new">
          <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">Create Invoice</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-700/50 border-b border-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Invoice #</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Project</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Total</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Paid</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Due Date</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-slate-200">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {invoices.map((invoice) => {
              const remaining = invoice.total_amount - (invoice.paid_amount || 0)
              return (
                <tr key={invoice.id} className="hover:bg-slate-700/30 transition">
                  <td className="px-6 py-4 text-sm text-white font-medium">{invoice.invoice_number}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">
                    {invoice.jobs?.estimates?.leads?.project_name || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[invoice.status] || statusColors.draft}`}
                    >
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-white font-medium">${invoice.total_amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">
                    ${(invoice.paid_amount || 0).toLocaleString()} / ${remaining.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">
                    {new Date(invoice.due_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/invoices/${invoice.id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600 text-slate-200 hover:bg-slate-700 bg-transparent"
                        >
                          Edit
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(invoice.id)}
                        disabled={isDeleting === invoice.id}
                        className="bg-red-900/50 hover:bg-red-900 text-red-200 border-red-700"
                      >
                        {isDeleting === invoice.id ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
