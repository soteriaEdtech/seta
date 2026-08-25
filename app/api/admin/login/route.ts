import { NextResponse } from "next/server"
import { ADMIN_COOKIE, expectedToken } from "@/lib/auth"
import { verifyAdmin } from "@/lib/admins"

export async function POST(req: Request) {
  let email = ""
  let password = ""
  try {
    const body = await req.json()
    email = String(body.email || "")
    password = String(body.password || "")
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  if (!email || !password || !(await verifyAdmin(email, password))) {
    return NextResponse.json({ error: "Incorrect email or password" }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, expectedToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 hours
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete(ADMIN_COOKIE)
  return res
}
