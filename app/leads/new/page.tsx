import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { LeadForm } from "@/components/leads/lead-form"

export default async function NewLeadPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: customers } = await supabase
    .from("customers")
    .select("id, name")
    .eq("user_id", data.user.id)
    .order("name")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <nav className="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/leads" className="text-slate-400 hover:text-white transition">
            ← Back to Leads
          </Link>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Add New Lead</h1>
          <LeadForm userId={data.user.id} customers={customers || []} />
        </div>
      </main>
    </div>
  )
}
