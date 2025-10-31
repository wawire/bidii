"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function logoutAction() {
  const supabase = createClient()

  // Sign the user out from Supabase auth
  await (await supabase).auth.signOut()

  // Redirect to homepage after logout
  redirect("/")
}
