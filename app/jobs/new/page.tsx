import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { JobForm } from "@/components/jobs/job-form"

export default async function NewJobPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: estimates } = await supabase
    .from("estimates")
    .select("id, estimate_number, leads(project_name, customers(name))")
    .eq("user_id", data.user.id)
    .eq("status", "accepted")
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <nav className="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/jobs" className="text-slate-400 hover:text-white transition">
            ← Back to Jobs
          </Link>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Create Job</h1>
          <JobForm userId={data.user.id} estimates={estimates || []} />
        </div>
      </main>
    </div>
  )
}
