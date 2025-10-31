"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface User {
  id: string
  email: string
  full_name?: string
  company_name?: string
  role?: string
  created_at: string
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [newRole, setNewRole] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      const supabase = createClient()

      try {
        const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

        if (error) throw error
        setUsers(data || [])
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleUpdateRole = async () => {
    if (!selectedUser || !newRole) return

    setIsUpdating(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", selectedUser.id)

      if (error) throw error

      setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? { ...u, role: newRole } : u)))
      setSelectedUser(null)
      setNewRole("")
    } catch (error) {
      console.error("Error updating user role:", error)
      alert("Failed to update user role")
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return <div className="text-slate-400">Loading users...</div>
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50 border-b border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Company</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Joined</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-slate-200">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-700/30 transition">
                  <td className="px-6 py-4 text-sm text-white font-medium">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{user.full_name || "-"}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{user.company_name || "-"}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-200">
                      {user.role || "user"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedUser(user)
                        setNewRole(user.role || "user")
                      }}
                      className="border-slate-600 text-slate-200 hover:bg-slate-700 bg-transparent"
                    >
                      Edit Role
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">Update User Role</h3>
          <div className="grid gap-2">
            <Label className="text-slate-200">User: {selectedUser.email}</Label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
            >
              <option value="user">User</option>
              <option value="estimator">Estimator</option>
              <option value="manager">Manager</option>
              <option value="billing">Billing</option>
              <option value="procurement">Procurement</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handleUpdateRole}
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update Role"}
            </Button>
            <Button
              onClick={() => {
                setSelectedUser(null)
                setNewRole("")
              }}
              variant="outline"
              className="border-slate-600 text-slate-200 hover:bg-slate-700 bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
