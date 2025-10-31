"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

interface RecentActivityProps {
  userId: string
}

interface Activity {
  id: string
  type: string
  title: string
  description: string
  timestamp: string
  link?: string
}

export function RecentActivity({ userId }: RecentActivityProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      const supabase = createClient()

      try {
        const activities: Activity[] = []

        // Fetch recent leads
        const { data: leads } = await supabase
          .from("leads")
          .select("id, project_name, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(3)

        leads?.forEach((lead) => {
          activities.push({
            id: `lead-${lead.id}`,
            type: "lead",
            title: "New Lead",
            description: lead.project_name,
            timestamp: lead.created_at,
            link: `/leads/${lead.id}`,
          })
        })

        // Fetch recent estimates
        const { data: estimates } = await supabase
          .from("estimates")
          .select("id, estimate_number, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(3)

        estimates?.forEach((estimate) => {
          activities.push({
            id: `estimate-${estimate.id}`,
            type: "estimate",
            title: "New Estimate",
            description: estimate.estimate_number,
            timestamp: estimate.created_at,
            link: `/estimates/${estimate.id}`,
          })
        })

        // Fetch recent jobs
        const { data: jobs } = await supabase
          .from("jobs")
          .select("id, job_number, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(3)

        jobs?.forEach((job) => {
          activities.push({
            id: `job-${job.id}`,
            type: "job",
            title: "New Job",
            description: job.job_number,
            timestamp: job.created_at,
            link: `/jobs/${job.id}`,
          })
        })

        // Sort by timestamp and take top 10
        activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        setActivities(activities.slice(0, 10))
      } catch (error) {
        console.error("Error fetching activities:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivities()
  }, [userId])

  const getActivityColor = (type: string) => {
    switch (type) {
      case "lead":
        return "bg-yellow-900/20 border-yellow-700 text-yellow-200"
      case "estimate":
        return "bg-blue-900/20 border-blue-700 text-blue-200"
      case "job":
        return "bg-green-900/20 border-green-700 text-green-200"
      default:
        return "bg-slate-700/20 border-slate-600 text-slate-200"
    }
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
      {isLoading ? (
        <div className="text-slate-400">Loading...</div>
      ) : activities.length === 0 ? (
        <div className="text-slate-400">No recent activity</div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <Link key={activity.id} href={activity.link || "#"}>
              <div
                className={`border rounded-lg p-4 cursor-pointer hover:opacity-80 transition ${getActivityColor(activity.type)}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{activity.title}</p>
                    <p className="text-sm opacity-75">{activity.description}</p>
                  </div>
                  <p className="text-xs opacity-60">{new Date(activity.timestamp).toLocaleDateString()}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
