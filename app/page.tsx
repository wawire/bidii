import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-5xl font-bold text-white mb-6">Renovation Estimate System</h1>
        <p className="text-xl text-slate-300 mb-8">Professional estimate and job management for renovation companies</p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/login">
            <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600">
              Login
            </Button>
          </Link>
          <Link href="/auth/sign-up">
            <Button
              size="lg"
              variant="outline"
              className="border-cyan-500 text-cyan-500 hover:bg-cyan-500/10 bg-transparent"
            >
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
