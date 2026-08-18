import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; ref?: string }>
}) {
  const { status = "success", ref } = await searchParams

  const config = {
    success: {
      icon: CheckCircle2,
      color: "text-green-500",
      title: "Payment confirmed — you're all set!",
      body: "Thank you! Your commitment fee has been received and your application is now complete. Our team will review it and email you with an admission decision. Keep an eye on your inbox (and spam folder).",
    },
    failed: {
      icon: XCircle,
      color: "text-destructive",
      title: "Payment was not completed",
      body: "We couldn't confirm your payment. No charge was made, or the transaction was cancelled. You can safely try again to secure your seat.",
    },
    error: {
      icon: AlertCircle,
      color: "text-yellow-500",
      title: "We couldn't verify your payment yet",
      body: "Something went wrong while confirming your payment. If you were charged, don't worry — our webhook will reconcile it automatically. Contact us if your status doesn't update shortly.",
    },
  }[status] ?? {
    icon: AlertCircle,
    color: "text-yellow-500",
    title: "Application status",
    body: "",
  }

  const Icon = config.icon

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20">
        <div className="max-w-lg mx-auto px-4 text-center">
          <Icon className={`h-16 w-16 mx-auto mb-6 ${config.color}`} />
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">{config.title}</h1>
          <p className="text-muted-foreground mb-2">{config.body}</p>
          {ref && (
            <p className="text-sm text-muted-foreground mb-8">
              Reference: <span className="font-mono text-foreground">{ref}</span>
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            {status !== "success" && (
              <Button asChild size="lg">
                <Link href="/apply">Try again</Link>
              </Button>
            )}
            <Button asChild size="lg" variant={status === "success" ? "default" : "outline"}>
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
