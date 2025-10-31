"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { DashboardStats } from "./dashboard-stats"
import { RecentActivity } from "./recent-activity"
import { RevenueChart } from "./revenue-chart"
import { JobStatusChart } from "./job-status-chart"
import { logoutAction } from "@/actions/logout" 

interface ManagerDashboardProps {
  userId: string
}

export function ManagerDashboard({ userId }: ManagerDashboardProps) {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeLeads: 0,
    completedJobs: 0,
    totalRevenue: 0,
    pendingInvoices: 0,
    overallJobCompletion: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient()

      try {
        const { count: customersCount } = await supabase
          .from("customers")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)

        const { count: leadsCount } = await supabase
          .from("leads")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .in("status", ["new", "contacted", "qualified", "estimate_sent"])

        const { count: completedJobsCount } = await supabase
          .from("jobs")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("status", "completed")

        const { count: totalJobsCount } = await supabase
          .from("jobs")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)

        const { data: paidInvoices } = await supabase
          .from("invoices")
          .select("total_amount")
          .eq("user_id", userId)
          .eq("status", "paid")

        const { count: pendingCount } = await supabase
          .from("invoices")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .in("status", ["sent", "overdue"])

        const totalRevenue =
          paidInvoices?.reduce((sum, inv) => sum + inv.total_amount, 0) || 0

        const completionRate = totalJobsCount
          ? Math.round(((completedJobsCount || 0) / totalJobsCount) * 100)
          : 0

        setStats({
          totalCustomers: customersCount || 0,
          activeLeads: leadsCount || 0,
          completedJobs: completedJobsCount || 0,
          totalRevenue,
          pendingInvoices: pendingCount || 0,
          overallJobCompletion: completionRate,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [userId])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <nav className="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">
            Renovation Estimate System
          </h1>

          {/* ✅ Use the imported server action here */}
          <form action={logoutAction}>
            <Button
              type="submit"
              variant="outline"
              className="border-slate-600 text-slate-200 hover:bg-slate-700 bg-transparent"
            >
              Logout
            </Button>
          </form>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <DashboardStats stats={stats} isLoading={isLoading} />

        {/* Quick Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/customers">
            <div className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg p-6 cursor-pointer transition">
              <h3 className="text-lg font-semibold text-white mb-2">Customers</h3>
              <p className="text-slate-400 text-sm">Manage customer information</p>
            </div>
          </Link>

          <Link href="/leads">
            <div className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg p-6 cursor-pointer transition">
              <h3 className="text-lg font-semibold text-white mb-2">Leads</h3>
              <p className="text-slate-400 text-sm">Track and manage leads</p>
            </div>
          </Link>

          <Link href="/estimates">
            <div className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg p-6 cursor-pointer transition">
              <h3 className="text-lg font-semibold text-white mb-2">Estimates</h3>
              <p className="text-slate-400 text-sm">Create and send estimates</p>
            </div>
          </Link>

          <Link href="/jobs">
            <div className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg p-6 cursor-pointer transition">
              <h3 className="text-lg font-semibold text-white mb-2">Jobs</h3>
              <p className="text-slate-400 text-sm">Track job progress</p>
            </div>
          </Link>

          <Link href="/site-visits">
            <div className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg p-6 cursor-pointer transition">
              <h3 className="text-lg font-semibold text-white mb-2">Site Visits</h3>
              <p className="text-slate-400 text-sm">Schedule and manage visits</p>
            </div>
          </Link>

          <Link href="/invoices">
            <div className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg p-6 cursor-pointer transition">
              <h3 className="text-lg font-semibold text-white mb-2">Invoices</h3>
              <p className="text-slate-400 text-sm">Manage invoices and payments</p>
            </div>
          </Link>

          <Link href="/reports">
            <div className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg p-6 cursor-pointer transition">
              <h3 className="text-lg font-semibold text-white mb-2">Reports</h3>
              <p className="text-slate-400 text-sm">View detailed reports</p>
            </div>
          </Link>

          <Link href="/settings">
            <div className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg p-6 cursor-pointer transition">
              <h3 className="text-lg font-semibold text-white mb-2">Settings</h3>
              <p className="text-slate-400 text-sm">Manage account settings</p>
            </div>
          </Link>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RevenueChart userId={userId} />
          <JobStatusChart userId={userId} />
        </div>

        {/* Recent Activity */}
        <RecentActivity userId={userId} />
      </main>
    </div>
  )
}
