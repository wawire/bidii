"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { UserManagement } from "./user-management"
import { SystemSettings } from "./system-settings"

type AdminTab = "users" | "settings"

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<AdminTab>("users")

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
        <p className="text-slate-400">Manage users and system settings</p>
      </div>

      <div className="flex gap-4 border-b border-slate-700">
        <Button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === "users"
              ? "border-cyan-500 text-cyan-400 bg-transparent"
              : "border-transparent text-slate-400 hover:text-white bg-transparent"
          }`}
          variant="ghost"
        >
          User Management
        </Button>
        <Button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === "settings"
              ? "border-cyan-500 text-cyan-400 bg-transparent"
              : "border-transparent text-slate-400 hover:text-white bg-transparent"
          }`}
          variant="ghost"
        >
          System Settings
        </Button>
      </div>

      <div>
        {activeTab === "users" && <UserManagement />}
        {activeTab === "settings" && <SystemSettings />}
      </div>
    </div>
  )
}
