"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  city?: string
  state?: string
  created_at: string
}

interface CustomersTableProps {
  customers: Customer[]
}

export function CustomersTable({ customers: initialCustomers }: CustomersTableProps) {
  const router = useRouter()
  const [customers, setCustomers] = useState(initialCustomers)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this customer?")) return

    setIsDeleting(id)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("customers").delete().eq("id", id)
      if (error) throw error
      setCustomers((prev) => prev.filter((c) => c.id !== id))
    } catch (error) {
      console.error("Error deleting customer:", error)
      alert("Failed to delete customer")
    } finally {
      setIsDeleting(null)
    }
  }

  if (customers.length === 0) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
        <p className="text-slate-400 mb-4">No customers yet. Create your first customer to get started.</p>
        <Link href="/customers/new">
          <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">Add Customer</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-700/50 border-b border-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Location</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-slate-200">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-slate-700/30 transition">
                <td className="px-6 py-4 text-sm text-white font-medium">{customer.name}</td>
                <td className="px-6 py-4 text-sm text-slate-300">{customer.email}</td>
                <td className="px-6 py-4 text-sm text-slate-300">{customer.phone || "-"}</td>
                <td className="px-6 py-4 text-sm text-slate-300">
                  {customer.city && customer.state ? `${customer.city}, ${customer.state}` : "-"}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/customers/${customer.id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-slate-200 hover:bg-slate-700 bg-transparent"
                      >
                        Edit
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(customer.id)}
                      disabled={isDeleting === customer.id}
                      className="bg-red-900/50 hover:bg-red-900 text-red-200 border-red-700"
                    >
                      {isDeleting === customer.id ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
