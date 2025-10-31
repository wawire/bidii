"use client"

import type React from "react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SettingsPageProps {
  userEmail: string
  profile?: {
    id: string
    full_name?: string
    company_name?: string
    phone?: string
  }
}

export function SettingsPage({ userEmail, profile }: SettingsPageProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    company_name: profile?.company_name || "",
    phone: profile?.phone || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    const supabase = createClient()

    try {
      const { error: updateError } = await supabase.from("profiles").update(formData).eq("id", profile?.id)

      if (updateError) throw updateError
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Manage your account and preferences</p>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Account Information</h2>
          <div className="grid gap-2 mb-4">
            <Label className="text-slate-200">Email</Label>
            <div className="bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-slate-300">{userEmail}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Profile Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label htmlFor="full_name" className="text-slate-200">
                  Full Name
                </Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  placeholder="Your full name"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="company_name" className="text-slate-200">
                  Company Name
                </Label>
                <Input
                  id="company_name"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  placeholder="Your company name"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone" className="text-slate-200">
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  placeholder="Your phone number"
                />
              </div>
            </div>
          </div>

          {error && <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-200">{error}</div>}
          {success && (
            <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 text-green-200">
              Settings updated successfully!
            </div>
          )}

          <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Settings"}
          </Button>
        </form>
      </div>
    </div>
  )
}
