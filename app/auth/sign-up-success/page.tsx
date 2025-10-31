import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-sm">
        <Card className="border-slate-700 bg-slate-800">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Check your email</CardTitle>
            <CardDescription className="text-slate-400">We&apos;ve sent you a confirmation link</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <p className="text-slate-300">
                Please check your email and click the confirmation link to verify your account. Once verified, you can
                log in to your account.
              </p>
              <Link href="/auth/login">
                <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white">Back to Login</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
