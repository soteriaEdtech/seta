import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { z } from "zod"
import { ADMIN_COOKIE, isValidToken } from "@/lib/auth"
import { updateAdmission } from "@/lib/applications"
import { sendAdmissionDecision } from "@/lib/email"
import { ADMISSION_STATUSES } from "@/lib/config"

const schema = z.object({
  admission_status: z.enum(ADMISSION_STATUSES),
  admin_notes: z.string().max(2000).optional(),
  notify: z.boolean().optional().default(true),
})

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value
  if (!isValidToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  let data: z.infer<typeof schema>
  try {
    data = schema.parse(await req.json())
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const updated = await updateAdmission(id, data.admission_status, data.admin_notes)
  if (!updated) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 })
  }

  if (data.notify) {
    void sendAdmissionDecision(updated)
  }

  return NextResponse.json({ application: updated })
}
