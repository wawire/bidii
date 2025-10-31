interface DashboardStatsProps {
  stats: {
    totalCustomers: number
    activeLeads: number
    completedJobs: number
    totalRevenue: number
    pendingInvoices: number
    overallJobCompletion: number
  }
  isLoading: boolean
}

export function DashboardStats({ stats, isLoading }: DashboardStatsProps) {
  const statCards = [
    {
      label: "Total Customers",
      value: stats.totalCustomers,
      color: "text-blue-400",
      bgColor: "bg-blue-900/20",
      borderColor: "border-blue-700",
    },
    {
      label: "Active Leads",
      value: stats.activeLeads,
      color: "text-yellow-400",
      bgColor: "bg-yellow-900/20",
      borderColor: "border-yellow-700",
    },
    {
      label: "Completed Jobs",
      value: stats.completedJobs,
      color: "text-green-400",
      bgColor: "bg-green-900/20",
      borderColor: "border-green-700",
    },
    {
      label: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      color: "text-cyan-400",
      bgColor: "bg-cyan-900/20",
      borderColor: "border-cyan-700",
    },
    {
      label: "Pending Invoices",
      value: stats.pendingInvoices,
      color: "text-orange-400",
      bgColor: "bg-orange-900/20",
      borderColor: "border-orange-700",
    },
    {
      label: "Job Completion Rate",
      value: `${stats.overallJobCompletion}%`,
      color: "text-purple-400",
      bgColor: "bg-purple-900/20",
      borderColor: "border-purple-700",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {statCards.map((card, index) => (
        <div
          key={index}
          className={`${card.bgColor} border ${card.borderColor} rounded-lg p-6 ${isLoading ? "opacity-50" : ""}`}
        >
          <p className="text-slate-400 text-sm mb-2">{card.label}</p>
          <p className={`text-3xl font-bold ${card.color}`}>{isLoading ? "-" : card.value}</p>
        </div>
      ))}
    </div>
  )
}
