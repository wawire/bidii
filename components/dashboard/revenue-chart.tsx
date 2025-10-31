"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface RevenueChartProps {
  userId: string
}

export function RevenueChart({ userId }: RevenueChartProps) {
  const [data, setData] = useState<Array<{ month: string; revenue: number }>>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      try {
        const { data: invoices } = await supabase
          .from("invoices")
          .select("total_amount, created_at")
          .eq("user_id", userId)
          .eq("status", "paid")

        // Group by month
        const monthlyData: Record<string, number> = {}
        invoices?.forEach((invoice) => {
          const date = new Date(invoice.created_at)
          const monthKey = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
          monthlyData[monthKey] = (monthlyData[monthKey] || 0) + invoice.total_amount
        })

        const chartData = Object.entries(monthlyData)
          .map(([month, revenue]) => ({ month, revenue }))
          .slice(-6)

        setData(chartData)
      } catch (error) {
        console.error("Error fetching revenue data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [userId])

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Revenue Trend (Last 6 Months)</h3>
      {isLoading ? (
        <div className="h-64 flex items-center justify-center text-slate-400">Loading...</div>
      ) : data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-slate-400">No data available</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }}
              labelStyle={{ color: "#e2e8f0" }}
            />
            <Legend />
            <Bar dataKey="revenue" fill="#06b6d4" name="Revenue" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
