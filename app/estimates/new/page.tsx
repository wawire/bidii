import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { EstimateForm } from "@/components/estimates/estimate-form"

export default async function NewEstimatePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: leads } = await supabase
    .from("leads")
    .select("id, project_name, customers(name)")
    .eq("user_id", data.user.id)
    .order("project_name")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <nav className="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/estimates" className="text-slate-400 hover:text-white transition">
            ← Back to Estimates
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Create Estimate</h1>
          <EstimateForm userId={data.user.id} leads={leads || []} />
        </div>
      </main>
    </div>
  )
}
