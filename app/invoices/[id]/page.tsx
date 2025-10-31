import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { InvoiceForm } from "@/components/invoices/invoice-form"
import { PaymentsList } from "@/components/payments/payments-list"

export default async function EditInvoicePage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", data.user.id)
    .single()

  if (invoiceError || !invoice) {
    redirect("/invoices")
  }

  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("invoice_id", params.id)
    .order("payment_date", { ascending: false })

  const { data: jobs } = await supabase
    .from("jobs")
    .select("id, job_number, estimates(leads(project_name, customers(name)))")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <nav className="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/invoices" className="text-slate-400 hover:text-white transition">
            ← Back to Invoices
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Edit Invoice</h1>
          <InvoiceForm userId={data.user.id} jobs={jobs || []} initialData={invoice} />
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Payments</h2>
          <PaymentsList
            invoiceId={params.id}
            userId={data.user.id}
            payments={payments || []}
            invoiceTotal={invoice.total_amount}
          />
        </div>
      </main>
    </div>
  )
}
