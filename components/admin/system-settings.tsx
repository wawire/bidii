"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function SystemSettings() {
  const [settings, setSettings] = useState({
    companyName: "Renovation Estimate System",
    supportEmail: "support@example.com",
    maxUploadSize: "10",
    invoicePrefix: "INV",
    estimatePrefix: "EST",
    jobPrefix: "JOB",
    maintenanceMode: false,
    systemNotice: "",
  })

  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSuccess(false)

    // Simulate saving to backend
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setSuccess(true)
    setIsSaving(false)

    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">General Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="companyName" className="text-slate-200">
                Company Name
              </Label>
              <Input
                id="companyName"
                name="companyName"
                value={settings.companyName}
                onChange={handleChange}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="supportEmail" className="text-slate-200">
                Support Email
              </Label>
              <Input
                id="supportEmail"
                name="supportEmail"
                type="email"
                value={settings.supportEmail}
                onChange={handleChange}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="maxUploadSize" className="text-slate-200">
                Max Upload Size (MB)
              </Label>
              <Input
                id="maxUploadSize"
                name="maxUploadSize"
                type="number"
                value={settings.maxUploadSize}
                onChange={handleChange}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-6">
          <h3 className="text-lg font-semibold text-white mb-4">Document Prefixes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="invoicePrefix" className="text-slate-200">
                Invoice Prefix
              </Label>
              <Input
                id="invoicePrefix"
                name="invoicePrefix"
                value={settings.invoicePrefix}
                onChange={handleChange}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="estimatePrefix" className="text-slate-200">
                Estimate Prefix
              </Label>
              <Input
                id="estimatePrefix"
                name="estimatePrefix"
                value={settings.estimatePrefix}
                onChange={handleChange}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="jobPrefix" className="text-slate-200">
                Job Prefix
              </Label>
              <Input
                id="jobPrefix"
                name="jobPrefix"
                value={settings.jobPrefix}
                onChange={handleChange}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-6">
          <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <input
                id="maintenanceMode"
                name="maintenanceMode"
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={handleChange}
                className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-cyan-500"
              />
              <Label htmlFor="maintenanceMode" className="text-slate-200 cursor-pointer">
                Enable Maintenance Mode
              </Label>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="systemNotice" className="text-slate-200">
                System Notice
              </Label>
              <Textarea
                id="systemNotice"
                name="systemNotice"
                value={settings.systemNotice}
                onChange={handleChange}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 min-h-24"
                placeholder="Display a notice to all users..."
              />
            </div>
          </div>
        </div>

        {success && (
          <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 text-green-200">
            Settings saved successfully!
          </div>
        )}

        <div className="flex gap-4">
          <Button onClick={handleSave} className="bg-cyan-500 hover:bg-cyan-600 text-white" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </div>
  )
}
