import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { SiteVisitForm } from "@/components/site-visits/site-visit-form"

export default async function EditSiteVisitPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: visit, error: visitError } = await supabase
    .from("site_visits")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", data.user.id)
    .single()

  if (visitError || !visit) {
    redirect("/site-visits")
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
          <Link href="/site-visits" className="text-slate-400 hover:text-white transition">
            ← Back to Site Visits
          </Link>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Edit Site Visit</h1>
          <SiteVisitForm userId={data.user.id} leads={leads || []} initialData={visit} />
        </div>
      </main>
    </div>
  )
}
