import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { JobForm } from "@/components/jobs/job-form"
import { MaterialsList } from "@/components/materials/materials-list"

export default async function EditJobPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", data.user.id)
    .single()

  if (jobError || !job) {
    redirect("/jobs")
  }

  const { data: materials } = await supabase.from("materials").select("*").eq("job_id", params.id).order("created_at")

  const { data: estimates } = await supabase
    .from("estimates")
    .select("id, estimate_number, leads(project_name, customers(name))")
    .eq("user_id", data.user.id)
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Edit Job</h1>
          <JobForm userId={data.user.id} estimates={estimates || []} initialData={job} />
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Materials</h2>
          <MaterialsList jobId={params.id} userId={data.user.id} materials={materials || []} />
        </div>
      </main>
    </div>
  )
}
