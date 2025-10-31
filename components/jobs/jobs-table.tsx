"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

interface Job {
  id: string
  job_number: string
  status: string
  start_date?: string
  end_date?: string
  estimates?: {
    estimate_number: string
    leads?: { project_name: string; customers?: { name: string } | null } | null
  } | null
  created_at: string
}

interface JobsTableProps {
  jobs: Job[]
}

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-900/30 text-blue-200 border-blue-700",
  in_progress: "bg-yellow-900/30 text-yellow-200 border-yellow-700",
  completed: "bg-green-900/30 text-green-200 border-green-700",
  on_hold: "bg-orange-900/30 text-orange-200 border-orange-700",
  cancelled: "bg-red-900/30 text-red-200 border-red-700",
}

export function JobsTable({ jobs: initialJobs }: JobsTableProps) {
  const [jobs, setJobs] = useState(initialJobs)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return

    setIsDeleting(id)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("jobs").delete().eq("id", id)
      if (error) throw error
      setJobs((prev) => prev.filter((j) => j.id !== id))
    } catch (error) {
      console.error("Error deleting job:", error)
      alert("Failed to delete job")
    } finally {
      setIsDeleting(null)
    }
  }

  if (jobs.length === 0) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
        <p className="text-slate-400 mb-4">No jobs yet. Create your first job to get started.</p>
        <Link href="/jobs/new">
          <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">Create Job</Button>
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
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Job #</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Project</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Start Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">End Date</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-slate-200">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-slate-700/30 transition">
                <td className="px-6 py-4 text-sm text-white font-medium">{job.job_number}</td>
                <td className="px-6 py-4 text-sm text-slate-300">{job.estimates?.leads?.project_name || "-"}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[job.status] || statusColors.scheduled}`}
                  >
                    {job.status.replace("_", " ").charAt(0).toUpperCase() + job.status.slice(1).replace("_", " ")}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-300">
                  {job.start_date ? new Date(job.start_date).toLocaleDateString() : "-"}
                </td>
                <td className="px-6 py-4 text-sm text-slate-300">
                  {job.end_date ? new Date(job.end_date).toLocaleDateString() : "-"}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/jobs/${job.id}`}>
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
                      onClick={() => handleDelete(job.id)}
                      disabled={isDeleting === job.id}
                      className="bg-red-900/50 hover:bg-red-900 text-red-200 border-red-700"
                    >
                      {isDeleting === job.id ? "Deleting..." : "Delete"}
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
