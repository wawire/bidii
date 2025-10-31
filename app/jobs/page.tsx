import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { JobsTable } from "@/components/jobs/jobs-table"

export default async function JobsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: jobs, error: jobsError } = await supabase
    .from("jobs")
    .select("*, estimates(estimate_number, leads(project_name, customers(name)))")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <nav className="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-slate-400 hover:text-white transition">
              ← Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-white">Jobs</h1>
          </div>
          <Link href="/jobs/new">
            <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">Create Job</Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {jobsError ? (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-200">
            Error loading jobs: {jobsError.message}
          </div>
        ) : (
          <JobsTable jobs={jobs || []} />
        )}
      </main>
    </div>
  )
}
