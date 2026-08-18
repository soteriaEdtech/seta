"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, ShieldCheck } from "lucide-react"

export function AdminHeader() {
  const router = useRouter()

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" })
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <span className="font-bold text-foreground">SETA Admin</span>
        </div>
        <Button variant="ghost" size="sm" onClick={logout} className="gap-2">
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </div>
    </header>
  )
}
