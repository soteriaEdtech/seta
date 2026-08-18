"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import type { Application } from "@/lib/applications"
import { TRACKS, formatNaira, ADMISSION_STATUSES } from "@/lib/config"

const trackLabel = (v: string) => TRACKS.find((t) => t.value === v)?.label ?? v

function PaymentBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid: "bg-green-500/15 text-green-600 dark:text-green-400",
    pending: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400",
    failed: "bg-destructive/15 text-destructive",
  }
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${map[status] ?? ""}`}>{status}</span>
}

function AdmissionBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    admitted: "bg-primary/15 text-primary",
    waitlisted: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    rejected: "bg-destructive/15 text-destructive",
    pending: "bg-muted text-muted-foreground",
  }
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${map[status] ?? ""}`}>{status}</span>
}

export function ApplicationsTable({ initial }: { initial: Application[] }) {
  const router = useRouter()
  const [apps, setApps] = useState(initial)
  const [query, setQuery] = useState("")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [admissionFilter, setAdmissionFilter] = useState("all")
  const [selected, setSelected] = useState<Application | null>(null)
  const [decision, setDecision] = useState("")
  const [notes, setNotes] = useState("")
  const [notify, setNotify] = useState(true)
  const [saving, setSaving] = useState(false)

  const filtered = useMemo(() => {
    return apps.filter((a) => {
      const q = query.toLowerCase()
      const matchesQuery =
        !q ||
        a.full_name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.reference.toLowerCase().includes(q)
      const matchesPayment = paymentFilter === "all" || a.payment_status === paymentFilter
      const matchesAdmission = admissionFilter === "all" || a.admission_status === admissionFilter
      return matchesQuery && matchesPayment && matchesAdmission
    })
  }, [apps, query, paymentFilter, admissionFilter])

  function openRow(app: Application) {
    setSelected(app)
    setDecision(app.admission_status)
    setNotes(app.admin_notes ?? "")
    setNotify(true)
  }

  async function saveDecision() {
    if (!selected) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/applications/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admission_status: decision, admin_notes: notes, notify }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Could not update")
        setSaving(false)
        return
      }
      setApps((prev) => prev.map((a) => (a.id === selected.id ? data.application : a)))
      toast.success(`Marked as ${decision}${notify ? " · email sent" : ""}`)
      setSelected(null)
    } catch {
      toast.error("Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <Input
          placeholder="Search name, email, or reference…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
          <SelectTrigger className="sm:w-40"><SelectValue placeholder="Payment" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All payments</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={admissionFilter} onValueChange={setAdmissionFilter}>
          <SelectTrigger className="sm:w-40"><SelectValue placeholder="Admission" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All admissions</SelectItem>
            {ADMISSION_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">Applicant</th>
              <th className="px-4 py-3 font-medium">Track</th>
              <th className="px-4 py-3 font-medium">Payment</th>
              <th className="px-4 py-3 font-medium">Admission</th>
              <th className="px-4 py-3 font-medium">Applied</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  No applications match your filters.
                </td>
              </tr>
            )}
            {filtered.map((a) => (
              <tr key={a.id} className="border-t border-border hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground">{a.full_name}</div>
                  <div className="text-xs text-muted-foreground">{a.email}</div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{trackLabel(a.track)}</td>
                <td className="px-4 py-3"><PaymentBadge status={a.payment_status} /></td>
                <td className="px-4 py-3"><AdmissionBadge status={a.admission_status} /></td>
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                  {new Date(a.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="outline" size="sm" onClick={() => openRow(a)}>
                    Review
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground mt-3">
        Showing {filtered.length} of {apps.length} applications.
      </p>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.full_name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Email" value={selected.email} />
                  <Field label="Phone" value={selected.phone} />
                  <Field label="Location" value={selected.location || "—"} />
                  <Field label="Track" value={trackLabel(selected.track)} />
                  <Field label="Experience" value={selected.experience_level || "—"} />
                  <Field label="Referral" value={selected.referral_source || "—"} />
                  <Field label="Fee" value={formatNaira(selected.amount)} />
                  <Field label="Reference" value={selected.reference} />
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-muted-foreground">Payment:</span>
                  <PaymentBadge status={selected.payment_status} />
                  {selected.paid_at && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(selected.paid_at).toLocaleString()}
                    </span>
                  )}
                </div>
                {selected.background && (
                  <Block label="Background" value={selected.background} />
                )}
                {selected.motivation && (
                  <Block label="Motivation" value={selected.motivation} />
                )}
                {selected.portfolio_url && (
                  <div>
                    <span className="text-muted-foreground">Portfolio: </span>
                    <a href={selected.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-primary underline break-all">
                      {selected.portfolio_url}
                    </a>
                  </div>
                )}

                <div className="border-t border-border pt-4 mt-2 space-y-3">
                  <div>
                    <label className="text-sm font-medium">Admission decision</label>
                    <Select value={decision} onValueChange={setDecision}>
                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {ADMISSION_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selected.payment_status !== "paid" && (
                      <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                        Note: this applicant hasn't paid the commitment fee yet.
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Internal notes</label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                      className="mt-1.5"
                      placeholder="Not sent to the applicant."
                    />
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={notify}
                      onChange={(e) => setNotify(e.target.checked)}
                      className="h-4 w-4 rounded border-border"
                    />
                    Email the applicant about this decision
                  </label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelected(null)}>Cancel</Button>
                <Button onClick={saveDecision} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save decision"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-foreground break-words">{value}</div>
    </div>
  )
}

function Block({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <p className="text-foreground whitespace-pre-wrap bg-muted/40 rounded p-2">{value}</p>
    </div>
  )
}
