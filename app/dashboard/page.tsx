import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ManagerDashboard } from "@/components/dashboard/manager-dashboard"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/")
  }

  return <ManagerDashboard userId={data.user.id} />
}
