"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

interface Estimate {
  id: string
  estimate_number: string
  status: string
  total_amount: number
  leads?: { project_name: string; customers?: { name: string } | null } | null
  created_at: string
}

interface EstimatesTableProps {
  estimates: Estimate[]
}

const statusColors: Record<string, string> = {
  draft: "bg-slate-900/30 text-slate-200 border-slate-700",
  sent: "bg-blue-900/30 text-blue-200 border-blue-700",
  accepted: "bg-green-900/30 text-green-200 border-green-700",
  rejected: "bg-red-900/30 text-red-200 border-red-700",
}

export function EstimatesTable({ estimates: initialEstimates }: EstimatesTableProps) {
  const [estimates, setEstimates] = useState(initialEstimates)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this estimate?")) return

    setIsDeleting(id)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("estimates").delete().eq("id", id)
      if (error) throw error
      setEstimates((prev) => prev.filter((e) => e.id !== id))
    } catch (error) {
      console.error("Error deleting estimate:", error)
      alert("Failed to delete estimate")
    } finally {
      setIsDeleting(null)
    }
  }

  if (estimates.length === 0) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
        <p className="text-slate-400 mb-4">No estimates yet. Create your first estimate to get started.</p>
        <Link href="/estimates/new">
          <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">Create Estimate</Button>
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
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Estimate #</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Project</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Customer</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Amount</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-slate-200">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {estimates.map((estimate) => (
              <tr key={estimate.id} className="hover:bg-slate-700/30 transition">
                <td className="px-6 py-4 text-sm text-white font-medium">{estimate.estimate_number}</td>
                <td className="px-6 py-4 text-sm text-slate-300">{estimate.leads?.project_name || "-"}</td>
                <td className="px-6 py-4 text-sm text-slate-300">{estimate.leads?.customers?.name || "-"}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[estimate.status] || statusColors.draft}`}
                  >
                    {estimate.status.charAt(0).toUpperCase() + estimate.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-white font-medium">${estimate.total_amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/estimates/${estimate.id}`}>
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
                      onClick={() => handleDelete(estimate.id)}
                      disabled={isDeleting === estimate.id}
                      className="bg-red-900/50 hover:bg-red-900 text-red-200 border-red-700"
                    >
                      {isDeleting === estimate.id ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
