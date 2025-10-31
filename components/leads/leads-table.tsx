"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

interface Lead {
  id: string
  project_name: string
  status: string
  estimated_value?: number
  customers?: { name: string; email: string } | null
  created_at: string
}

interface LeadsTableProps {
  leads: Lead[]
}

const statusColors: Record<string, string> = {
  new: "bg-blue-900/30 text-blue-200 border-blue-700",
  contacted: "bg-purple-900/30 text-purple-200 border-purple-700",
  qualified: "bg-yellow-900/30 text-yellow-200 border-yellow-700",
  estimate_sent: "bg-cyan-900/30 text-cyan-200 border-cyan-700",
  won: "bg-green-900/30 text-green-200 border-green-700",
  lost: "bg-red-900/30 text-red-200 border-red-700",
}

export function LeadsTable({ leads: initialLeads }: LeadsTableProps) {
  const [leads, setLeads] = useState(initialLeads)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return

    setIsDeleting(id)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("leads").delete().eq("id", id)
      if (error) throw error
      setLeads((prev) => prev.filter((l) => l.id !== id))
    } catch (error) {
      console.error("Error deleting lead:", error)
      alert("Failed to delete lead")
    } finally {
      setIsDeleting(null)
    }
  }

  if (leads.length === 0) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
        <p className="text-slate-400 mb-4">No leads yet. Create your first lead to get started.</p>
        <Link href="/leads/new">
          <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">Add Lead</Button>
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
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Project</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Customer</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Estimated Value</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-slate-200">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-700/30 transition">
                <td className="px-6 py-4 text-sm text-white font-medium">{lead.project_name}</td>
                <td className="px-6 py-4 text-sm text-slate-300">{lead.customers?.name || "-"}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[lead.status] || statusColors.new}`}
                  >
                    {lead.status.replace("_", " ").charAt(0).toUpperCase() + lead.status.slice(1).replace("_", " ")}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-300">
                  {lead.estimated_value ? `$${lead.estimated_value.toLocaleString()}` : "-"}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/leads/${lead.id}`}>
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
                      onClick={() => handleDelete(lead.id)}
                      disabled={isDeleting === lead.id}
                      className="bg-red-900/50 hover:bg-red-900 text-red-200 border-red-700"
                    >
                      {isDeleting === lead.id ? "Deleting..." : "Delete"}
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
