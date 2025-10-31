"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface ReportsPageProps {
  userId: string
}

interface ReportData {
  totalLeads: number
  convertedLeads: number
  conversionRate: number
  totalEstimates: number
  acceptedEstimates: number
  estimateAcceptanceRate: number
  totalJobs: number
  completedJobs: number
  jobCompletionRate: number
  totalRevenue: number
  averageJobValue: number
  totalInvoices: number
  paidInvoices: number
  outstandingAmount: number
}

export function ReportsPage({ userId }: ReportsPageProps) {
  const [data, setData] = useState<ReportData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchReportData = async () => {
      const supabase = createClient()

      try {
        // Fetch leads data
        const { count: totalLeads } = await supabase
          .from("leads")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)

        const { count: convertedLeads } = await supabase
          .from("leads")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("status", "won")

        // Fetch estimates data
        const { count: totalEstimates } = await supabase
          .from("estimates")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)

        const { count: acceptedEstimates } = await supabase
          .from("estimates")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("status", "accepted")

        // Fetch jobs data
        const { count: totalJobs } = await supabase
          .from("jobs")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)

        const { count: completedJobs } = await supabase
          .from("jobs")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("status", "completed")

        // Fetch revenue data
        const { data: paidInvoices } = await supabase
          .from("invoices")
          .select("total_amount")
          .eq("user_id", userId)
          .eq("status", "paid")

        const { data: allInvoices } = await supabase
          .from("invoices")
          .select("total_amount, paid_amount")
          .eq("user_id", userId)

        const totalRevenue = paidInvoices?.reduce((sum, inv) => sum + inv.total_amount, 0) || 0
        const averageJobValue = totalJobs ? totalRevenue / totalJobs : 0

        const { count: totalInvoiceCount } = await supabase
          .from("invoices")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)

        const { count: paidInvoiceCount } = await supabase
          .from("invoices")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("status", "paid")

        const outstandingAmount =
          allInvoices?.reduce((sum, inv) => sum + (inv.total_amount - (inv.paid_amount || 0)), 0) || 0

        setData({
          totalLeads: totalLeads || 0,
          convertedLeads: convertedLeads || 0,
          conversionRate: totalLeads ? Math.round(((convertedLeads || 0) / totalLeads) * 100) : 0,
          totalEstimates: totalEstimates || 0,
          acceptedEstimates: acceptedEstimates || 0,
          estimateAcceptanceRate: totalEstimates ? Math.round(((acceptedEstimates || 0) / totalEstimates) * 100) : 0,
          totalJobs: totalJobs || 0,
          completedJobs: completedJobs || 0,
          jobCompletionRate: totalJobs ? Math.round(((completedJobs || 0) / totalJobs) * 100) : 0,
          totalRevenue,
          averageJobValue,
          totalInvoices: totalInvoiceCount || 0,
          paidInvoices: paidInvoiceCount || 0,
          outstandingAmount,
        })
      } catch (error) {
        console.error("Error fetching report data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReportData()
  }, [userId])

  if (isLoading) {
    return <div className="text-white">Loading reports...</div>
  }

  if (!data) {
    return <div className="text-white">Error loading reports</div>
  }

  const reportSections = [
    {
      title: "Lead Performance",
      metrics: [
        { label: "Total Leads", value: data.totalLeads },
        { label: "Converted Leads", value: data.convertedLeads },
        { label: "Conversion Rate", value: `${data.conversionRate}%` },
      ],
    },
    {
      title: "Estimate Performance",
      metrics: [
        { label: "Total Estimates", value: data.totalEstimates },
        { label: "Accepted Estimates", value: data.acceptedEstimates },
        { label: "Acceptance Rate", value: `${data.estimateAcceptanceRate}%` },
      ],
    },
    {
      title: "Job Performance",
      metrics: [
        { label: "Total Jobs", value: data.totalJobs },
        { label: "Completed Jobs", value: data.completedJobs },
        { label: "Completion Rate", value: `${data.jobCompletionRate}%` },
      ],
    },
    {
      title: "Financial Performance",
      metrics: [
        { label: "Total Revenue", value: `$${data.totalRevenue.toLocaleString()}` },
        { label: "Average Job Value", value: `$${data.averageJobValue.toLocaleString()}` },
        { label: "Outstanding Amount", value: `$${data.outstandingAmount.toLocaleString()}` },
      ],
    },
    {
      title: "Invoice Performance",
      metrics: [
        { label: "Total Invoices", value: data.totalInvoices },
        { label: "Paid Invoices", value: data.paidInvoices },
        {
          label: "Payment Rate",
          value: `${data.totalInvoices ? Math.round((data.paidInvoices / data.totalInvoices) * 100) : 0}%`,
        },
      ],
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Business Reports</h1>
        <p className="text-slate-400">Comprehensive overview of your business performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportSections.map((section, index) => (
          <div key={index} className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">{section.title}</h2>
            <div className="space-y-4">
              {section.metrics.map((metric, metricIndex) => (
                <div key={metricIndex} className="flex justify-between items-center">
                  <span className="text-slate-400">{metric.label}</span>
                  <span className="text-xl font-bold text-cyan-400">{metric.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
