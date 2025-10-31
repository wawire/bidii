"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts"

interface JobStatusChartProps {
  userId: string
}

const COLORS = {
  scheduled: "#3b82f6",
  in_progress: "#f59e0b",
  completed: "#10b981",
  on_hold: "#f97316",
  cancelled: "#ef4444",
}

export function JobStatusChart({ userId }: JobStatusChartProps) {
  const [data, setData] = useState<Array<{ name: string; value: number }>>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      try {
        const { data: jobs } = await supabase.from("jobs").select("status").eq("user_id", userId)

        const statusCounts: Record<string, number> = {
          scheduled: 0,
          in_progress: 0,
          completed: 0,
          on_hold: 0,
          cancelled: 0,
        }

        jobs?.forEach((job) => {
          statusCounts[job.status] = (statusCounts[job.status] || 0) + 1
        })

        const chartData = Object.entries(statusCounts)
          .filter(([, count]) => count > 0)
          .map(([status, count]) => ({
            name: status.replace("_", " ").charAt(0).toUpperCase() + status.slice(1).replace("_", " "),
            value: count,
          }))

        setData(chartData)
      } catch (error) {
        console.error("Error fetching job status data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [userId])

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Job Status Distribution</h3>
      {isLoading ? (
        <div className="h-64 flex items-center justify-center text-slate-400">Loading...</div>
      ) : data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-slate-400">No jobs yet</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index % Object.values(COLORS).length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }}
              labelStyle={{ color: "#e2e8f0" }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
