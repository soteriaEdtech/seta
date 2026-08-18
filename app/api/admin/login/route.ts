import { NextResponse } from "next/server"
import { ADMIN_COOKIE, checkPassword, expectedToken } from "@/lib/auth"

export async function POST(req: Request) {
  let password = ""
  try {
    const body = await req.json()
    password = String(body.password || "")
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  if (!checkPassword(password)) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 })
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
