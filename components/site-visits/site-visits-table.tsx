"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

interface SiteVisit {
  id: string
  visit_date: string
  notes?: string
  leads?: { project_name: string; customers?: { name: string } | null } | null
  created_at: string
}

interface SiteVisitsTableProps {
  visits: SiteVisit[]
}

export function SiteVisitsTable({ visits: initialVisits }: SiteVisitsTableProps) {
  const [visits, setVisits] = useState(initialVisits)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this site visit?")) return

    setIsDeleting(id)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("site_visits").delete().eq("id", id)
      if (error) throw error
      setVisits((prev) => prev.filter((v) => v.id !== id))
    } catch (error) {
      console.error("Error deleting visit:", error)
      alert("Failed to delete site visit")
    } finally {
      setIsDeleting(null)
    }
  }

  if (visits.length === 0) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
        <p className="text-slate-400 mb-4">No site visits scheduled yet.</p>
        <Link href="/site-visits/new">
          <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">Schedule Visit</Button>
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
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Visit Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Notes</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-slate-200">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {visits.map((visit) => (
              <tr key={visit.id} className="hover:bg-slate-700/30 transition">
                <td className="px-6 py-4 text-sm text-white font-medium">{visit.leads?.project_name || "-"}</td>
                <td className="px-6 py-4 text-sm text-slate-300">{visit.leads?.customers?.name || "-"}</td>
                <td className="px-6 py-4 text-sm text-slate-300">{new Date(visit.visit_date).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm text-slate-300 truncate max-w-xs">{visit.notes || "-"}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/site-visits/${visit.id}`}>
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
                      onClick={() => handleDelete(visit.id)}
                      disabled={isDeleting === visit.id}
                      className="bg-red-900/50 hover:bg-red-900 text-red-200 border-red-700"
                    >
                      {isDeleting === visit.id ? "Deleting..." : "Delete"}
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
