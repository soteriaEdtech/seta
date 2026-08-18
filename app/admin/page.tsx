import { listApplications, getStats } from "@/lib/applications"
import { ApplicationsTable } from "@/components/admin/applications-table"
import { AdminHeader } from "@/components/admin/admin-header"
import { Toaster } from "@/components/ui/sonner"
import { Users, CreditCard, GraduationCap, ClipboardList } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  const [applications, stats] = await Promise.all([listApplications(), getStats()])

  const cards = [
    { label: "Total applications", value: stats.total, icon: Users },
    { label: "Paid", value: stats.paid, icon: CreditCard },
    { label: "Awaiting review", value: stats.pending_review, icon: ClipboardList },
    { label: "Admitted", value: stats.admitted, icon: GraduationCap },
  ]

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">Applications</h1>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {cards.map((c) => (
            <div key={c.label} className="rounded-lg bg-card border border-border p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{c.label}</span>
                <c.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">{c.value}</div>
            </div>
          ))}
        </div>

        <ApplicationsTable initial={applications} />
      </main>
      <Toaster richColors position="top-center" />
    </div>
  )
}
